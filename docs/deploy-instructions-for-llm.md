# Handoff: Deploy CogCare on AWS Amplify (Gen 2 fullstack)

Give this entire file to another LLM or operator. Goal: **deploy the CogCare repo so the hosted app has working Cognito sign-in and “Email my results” (Brevo via Lambda)**. The project is **not** “frontend-only”: it requires **Amplify Gen 2 backend** + **Amplify Hosting** wired together.

---

## Browser assistant: AWS Amplify Console only

Use this section for automation that **only drives the browser** on `console.aws.amazon.com` (Amplify). It does not include CLI, Git pushes, or Brevo’s website (except where noted as “open in another tab”).

### A. Sign in and open Amplify

1. Go to **https://console.aws.amazon.com/amplify/** (pick the correct **Region** in the top bar if the app already exists elsewhere).
2. Open **AWS Amplify** → **All apps**.

### B. Create the app (if it does not exist)

1. Choose **Create new app** / **Host web app** (wording may vary).
2. Connect **GitHub**, **GitLab**, or **Bitbucket**; authorize AWS when prompted.
3. Select the **CogCare repository** and the **branch** to deploy (e.g. `main`).
4. On the build/configure step, ensure the build uses the **build specification from the repository** (`amplify.yml` at the **root**). Do **not** replace it with a generic “npm run build” unless you are sure — this repo needs the **backend + frontend** spec.
5. Save / **Create app** / **Save and deploy** so the first build starts.

### C. App already exists — verify hosting

1. Click the **app name**.
2. Open **Hosting** → **Build settings** (or **App settings** → **Build settings**). Confirm **`amplify.yml`** is read from the repo (root), not an empty override.
3. Open **Hosting** → **Branches**: confirm the right **branch** is connected and builds are enabled.

### D. Backend secrets (Brevo — required for email)

Secrets are **not** “Hosting environment variables” for the frontend. They must be stored as **Amplify Gen 2 / Lambda secrets** for the backend (exact menu labels change; look under the app for **Secrets**, **Backend**, or **Sandbox**).

1. In the Amplify app, find **Secrets** or **Environment secrets** / **Backend secrets** (Gen 2).
2. Add two secrets with **these exact names**:
   - `BREVO_API_KEY` → paste the Brevo API key (from **https://app.brevo.com** → API keys — open Brevo in another tab if needed).
   - `BREVO_SENDER_EMAIL` → the verified sender email in Brevo.
3. Save. **Redeploy** the backend or trigger a new **build** so Lambdas pick up secrets (see F).

### E. Optional: Hosting “Environment variables” (usually skip)

1. **Hosting** → **Environment variables** (per branch).
2. Only add **`VITE_*`** vars if documented by the team (e.g. overrides). **Do not** put `BREVO_API_KEY` here — it would be exposed to the browser.

### F. Run a deployment and watch it

1. **Hosting** → **Build history** (or the branch view) → **Redeploy this version** or trigger a build after a new commit.
2. Open the **latest build** → **View logs** (or download logs).
3. Wait until **Backend** (if shown) and **Frontend** steps finish **Succeeded**.

### G. Get the live URL

1. **Hosting** → select the **branch** → copy the **Default domain** URL (e.g. `*.amplifyapp.com`).
2. In the browser, open **`/login`** — you should see a real sign-in form, not “Authentication is not configured…”.

### H. If something fails (still in Amplify only)

1. **Hosting** → failed build → **Download logs** / copy error lines.
2. Confirm **D** was done (secret names exact: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`).
3. Confirm build spec is still **repo `amplify.yml`**, not overwritten in the console.

---

## 1. Repository facts (do not guess)

- **Stack:** Vite + React app in repo root; **Amplify Gen 2** backend under `amplify/`.
- **Build spec:** Root `amplify.yml` (must stay at repo root).
- **Backend entry:** `amplify/backend.ts` defines Cognito, AppSync (Amplify Data), S3, and a Lambda `completeAssessment` with a **Lambda Function URL** (public HTTPS POST).
- **Email:** Production path is **`completeAssessment` Lambda** → Brevo REST API (one combined email: BHI report + magic link). Secrets are **`BREVO_API_KEY`** and **`BREVO_SENDER_EMAIL`** (see `amplify/functions/completeAssessment/resource.ts`). These are **Lambda secrets**, never `VITE_*`.
- **Magic links:** The Lambda builds URLs as `${APP_BASE_URL}/auth/magic?email=…&token=…`. The value is **baked into the Lambda environment at backend-deploy time** (CDK synth), so it must be set in the **shell that runs `ampx pipeline-deploy` / `ampx sandbox`**, not at request time.
  - **Amplify Hosting:** `amplify.yml` defaults **`APP_BASE_URL=https://cogcare.org`** before backend deploy. To override per branch (preview/staging), set **`APP_BASE_URL`** in the Amplify Hosting **Environment variables** for that branch and trigger a backend redeploy.
  - **Local sandbox:** `export APP_BASE_URL=http://localhost:5173` (or your dev URL) before `npx ampx sandbox`.
  - **Symptom of misconfig:** emailed magic links open `http://localhost:5173/auth/magic…`. Fix by setting `APP_BASE_URL` and **redeploying the backend** (frontend redeploy alone won't refresh the Lambda env).
- **Client config:** The SPA needs real **`src/amplify_outputs.json`** at **build time** (or equivalent `VITE_*` overrides — see `src/lib/amplifyOutputs.js`). A stub JSON with empty `user_pool_client_id` disables auth and email UI.
- **Hosting build flow (already in repo):**
  1. **Backend phase:** `npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID`
  2. **Frontend preBuild:** `npx ampx generate outputs --branch $AWS_BRANCH --app-id $AWS_APP_ID --out-dir src`
  3. **Frontend build:** `npm run build` → artifact `dist/`
- **Node:** Use **Node 20+** (build uses `nvm install 20` in `amplify.yml`).
- **npm:** Repo uses **`npm install`**, not `npm ci`, and **`.npmrc`** has `legacy-peer-deps=true` — do not “fix” by switching to `npm ci` on Amplify without verifying lockfile.

---

## 2. Prerequisites

- AWS account with permissions to: Amplify, CloudFormation, Lambda, Cognito, AppSync, S3, IAM, Secrets (as used by Amplify Gen 2).
- Git repository access (GitHub/GitLab/Bitbucket) for Amplify to connect.
- **Brevo** account: create an API key; verify the **sender** email domain/address Brevo expects.
- Target **AWS region** chosen for the app (note it; Amplify app region matters).

---

## 3. One-time: CDK bootstrap

Amplify Gen 2 uses CDK under the hood. If `pipeline-deploy` fails with bootstrap-related errors, bootstrap the account in the **same region** as the Amplify app, e.g.:

```bash
npx aws-cdk bootstrap aws://<ACCOUNT_ID>/<REGION>
```

Use the AWS CLI profile that matches where the Amplify app runs.

---

## 4. Create / configure the Amplify app (console)

1. Open **AWS Amplify Console** → **Create new app** → **Host web app** (wording may vary).
2. Connect the **Git provider** and select the **CogCare repository**.
3. Connect the **branch** to deploy (e.g. `main` or your feature branch).
4. Ensure Amplify detects **`amplify.yml`** at the **repository root**. If the console offers to override build settings, **keep the repo’s `amplify.yml`** unless you have a documented reason to change it.
5. Create the app in the intended **region**.

**Critical:** The app must be set up so **Gen 2 backend builds** run. Follow current AWS docs for **“Create a backend for a Gen 2 app”** / **fullstack branch deployments** if the console asks to link a backend or enable backend builds. If the Amplify app is created as **static hosting only** without backend linkage, `ampx pipeline-deploy` in CI may fail or deploy to the wrong context.

---

## 5. Secrets: Brevo (Lambda only)

In the Amplify **Gen 2 backend / Sandbox / Secrets** UI (exact path varies by console version), define secrets named exactly:

| Secret name            | Value |
|------------------------|--------|
| `BREVO_API_KEY`        | Brevo API key (server-side only) |
| `BREVO_SENDER_EMAIL`   | Verified sender address in Brevo |

These names must match `amplify/functions/completeAssessment/resource.ts` (`secret('BREVO_API_KEY')`, etc.).

| Env (backend build / sandbox shell) | Value |
|-------------------------------------|--------|
| `APP_BASE_URL` | **Recommended for production:** public URL of the hosted app (see **Repository facts** → magic links). Wrong value ⇒ magic links in email point at the wrong host. |

**Brevo IP allowlisting:** If email fails with **“unrecognised IP”**, add the relevant egress IP in the **Brevo dashboard** (Security → Authorised IPs). This cannot be fixed in application code.

---

## 6. Environment variables (Amplify Hosting — optional)

Do **not** put `BREVO_*` in `VITE_*` (they would be exposed to the browser).

Optional **browser-safe** overrides (per branch), if ever needed, are supported in `src/lib/amplifyOutputs.js`:

- `VITE_COMPLETE_ASSESSMENT_URL` — Lambda Function URL override  
- `VITE_USER_POOL_ID`, `VITE_USER_POOL_CLIENT_ID`, `VITE_IDENTITY_POOL_ID`  
- `VITE_AWS_REGION`  
- `VITE_GRAPHQL_URL` (AppSync)  
- `VITE_S3_BUCKET`  

Normally **`ampx generate outputs`** fills `amplify_outputs.json` and you do **not** need these.

---

## 7. Trigger deployment

1. Push a commit to the connected branch (or use **Redeploy** in Amplify).
2. Watch **Build history**:
   - **Backend** phase should run `pipeline-deploy` without fatal errors.
   - **Frontend** phase should run `generate outputs` then `npm run build`.

---

## 8. Success criteria (verify)

After deploy, open the Hosting URL (e.g. `https://<branch>.<appid>.amplifyapp.com`):

1. **`/login`** — Should show the real **Sign in** form (email + password), **not** “Authentication is not configured in this build.”
2. **Brain Health Index** — Complete the quiz; **“Email my results”** should be enabled (not “Email delivery is not available…”).
3. Submit email — Should hit the **completeAssessment** URL; user receives **one** email with the report and a **magic link** (check spam). Opening the link should land on **`/auth/magic`** and then the dashboard. If links open the wrong site, fix **`APP_BASE_URL`** for the backend build. If Brevo errors, check Lambda logs in CloudWatch and Brevo dashboard.

---

## 9. Troubleshooting (actionable)

| Symptom | Likely cause | What to do |
|--------|----------------|------------|
| Backend phase fails / CDK errors | Account not bootstrapped, wrong region, IAM | Bootstrap; confirm region; check build role permissions |
| `generate outputs` fails | Backend not deployed for that branch/app | Fix backend deploy first; confirm `AWS_APP_ID` / branch match |
| Frontend builds but auth still “not configured” | Empty Cognito ids in built bundle | Confirm `generate outputs` ran; check `amplify_outputs.json` content in build log artifact or add `VITE_USER_POOL_CLIENT_ID` etc. as temporary override |
| Email 5xx / Lambda error | Missing secrets, wrong secret names | Verify `BREVO_API_KEY` / `BREVO_SENDER_EMAIL` in Amplify secrets; redeploy backend |
| Brevo “unrecognised IP” | Brevo allowlist | Add IP in Brevo UI |
| Build cancelled / Node errors | Wrong Node | Repo expects Node 20 (`amplify.yml` uses nvm) |
| `npm ci` errors on Amplify | Lockfile strictness | Repo intentionally uses `npm install` + `.npmrc` — do not change without testing |

**Logs:** Amplify → App → **Hosting** → failed build → **Download logs**. Search for `error`, `Error`, `ampx`, `pipeline-deploy`, `generate outputs`.

---

## 10. Local development (optional, for humans)

- `npm run sandbox` from repo root deploys a **sandbox** stack and writes `src/amplify_outputs.json`.  
- This is for **development**, not a substitute for cloud pipeline deploy for production.

---

## 11. What not to do

- Do not expose Brevo keys in `VITE_*` or commit them to Git.
- Do not assume **GitHub Pages** (`.github/workflows/deploy.yml`) deploys this backend; production for this project is **Amplify Hosting + Gen 2** per org conventions.
- Do not replace `npm install` with `npm ci` in `amplify.yml` without validating the lockfile on Amplify’s build image.

---

## 12. Canonical doc in repo

After changes, operators should also read **`docs/cogcare-amplify.md`** for variable tables and edge cases.
