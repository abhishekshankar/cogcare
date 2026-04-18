# CogCare Amplify backend (Gen 2)

## Local development

- Run **`npm run sandbox`** from the repo root. This deploys a sandbox stack and writes **`src/amplify_outputs.json`** (see `package.json` `sandbox` script). For an already-deployed cloud app, use **`npx ampx generate outputs --app-id <id> --branch <branch> --out-dir src`** instead.
- The Vite app calls **`Amplify.configure()`** only when `amplify_outputs.json` includes a non-empty Cognito **`user_pool_client_id`** (see `src/lib/amplifyConfigure.js`).

## Frontend hosting (AWS Amplify Hosting)

- **Backend build installs devDependencies:** Amplify’s install step often runs with `NODE_ENV=production`, which skips `devDependencies`. This repo keeps **`@aws-amplify/backend-cli`** (the `ampx` CLI) in **devDependencies**, so **[`amplify.yml`](../amplify.yml)** uses **`npm install --include=dev`**. Without that, `npx ampx pipeline-deploy` fails. Also use the full command **`npx ampx pipeline-deploy …`** — **`npx @aws-amplify/backend-cli`** alone prints help (no subcommand).
- Connect this repo in **[Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)** as a **Gen 2 fullstack** app so builds can deploy the backend. The build spec is **[`amplify.yml`](../amplify.yml)**:
  - **Backend phase:** `npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID`
  - **Frontend phase:** `npx ampx generate outputs … --out-dir src`, then `npm run build` → artifacts from **`dist/`**
- Amplify provides **`AWS_BRANCH`** and **`AWS_APP_ID`** during the build; do not commit secrets.
- Optional **`VITE_`** overrides in the Amplify console (per branch) can supply Cognito or GraphQL values if you ever build without generated outputs — see [`src/lib/amplifyOutputs.js`](../src/lib/amplifyOutputs.js). Do not put secrets in `VITE_*` vars.
- One-time: ensure the AWS account/region is **CDK-bootstrapped** for `ampx pipeline-deploy`. Set Lambda secrets (**`BREVO_API_KEY`**, **`BREVO_SENDER_EMAIL`**) in the Amplify console for **`completeAssessment`**.
- See [Amplify Gen 2 deploy](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/) and [Create a backend for Gen 2](https://docs.aws.amazon.com/amplify/latest/userguide/build-backend-Gen2.html).

### If Hosting shows “cancelled” or fails immediately

- Confirm the connected **branch** (e.g. `cogcare-3`) has **`amplify.yml`** at the repo root and you triggered a build for that branch.
- Open **Amplify → App → Hosting → Build history** → failed job → **Download logs**. Fast failures are often **wrong Node version** (this repo expects **Node 20+**; see root `amplify.yml` `nvm` steps) or **`npm ci`** / lockfile strictness (we use **`npm install`** in `amplify.yml` plus **`.npmrc`** `legacy-peer-deps=true` so Amplify matches local installs).
- **Yellow `npm warn deprecated …` lines** are normal noise from transitive dependencies (Webpack, Vue tooling pulled in by doc packages, etc.); they do **not** fail the build by themselves. **Red `npm error`** lines or a non‑zero step after `npm run build` are the real failure.
- **SUPERSEDED** / cancelled runs when a **new commit** arrives while a build is running is normal.
- GitHub **Actions** (e.g. Pages) use separate workflows; they do not show in Amplify build history.

## Secrets (never in the browser)

- **Brevo** API key and sender email are configured as Lambda **secrets** in `amplify/functions/completeAssessment/resource.ts` (`secret('BREVO_API_KEY')`, etc.). They are available only to the **`completeAssessment`** function, not to Vite env vars.

## Backend environment (magic links)

- **`APP_BASE_URL`** — Injected in `amplify/backend.ts` into the **`completeAssessment`** Lambda (`process.env.APP_BASE_URL`). Must be the **public HTTPS URL** of the SPA (no trailing slash; include a subpath if the app is hosted under one). Used to build **`/auth/magic?email=&token=`** links in onboarding email. Defaults to `http://localhost:5173` when unset (local/sandbox). **Set this for production** when running backend deploy so emailed links match your Hosting URL.
- **Cognito custom auth** — Lambda triggers under `amplify/auth/` (`define-auth-challenge`, `create-auth-challenge`, `verify-auth-challenge-response`, `pre-sign-up`) implement **CUSTOM_WITHOUT_SRP** magic-link sign-in. The **`MagicLinkToken`** model stores hashed one-time tokens (see `amplify/data/resource.ts`).

## Frontend environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_COMPLETE_ASSESSMENT_URL` | Optional override for the **completeAssessment** HTTPS function URL. If unset, the app uses `custom.completeAssessmentFunctionUrl` from `amplify_outputs.json` (see `src/lib/completeAssessmentUrl.js`). |
| `VITE_QUIZ_EMAIL_API_URL` | **Legacy** only: points at a standalone serverless handler such as `api/send-quiz-email.js` (Brevo/SES). Production onboarding should use the Lambda + Cognito path instead. |

## Shared BHI report HTML

- Email HTML for the BHI report is built in **`lib/bhiReportEmailHtml.js`** (shared by the Lambda handler and **`api/send-quiz-email.js`**). Use **`buildBhiReportWithMagicLinkEmailHtml`** for the combined report + CTA email from **`completeAssessment`**.
- The Lambda handler imports it via **`../../../lib/bhiReportEmailHtml.js`** relative to `amplify/functions/completeAssessment/handler.ts` (bundled by `ampx`).

## Rate limiting

- **`completeAssessment`** enforces a per-email **daily cap** (UTC date) using the **`OnboardingAttempt`** model (`slotKey` = `email#YYYY-MM-DD`). Returns **429** when the cap is exceeded.

## CAPTCHA / API Gateway / WAF

- Not implemented in-repo. For WAF, API Gateway usage plans, and CAPTCHA verification patterns, see **[docs/edge-hardening.md](edge-hardening.md)**.
- For an optional UI migration to **`Authenticator` / `useAuthenticator`**, see **[docs/authenticator-migration.md](authenticator-migration.md)**.
