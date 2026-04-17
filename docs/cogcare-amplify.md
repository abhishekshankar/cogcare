# CogCare Amplify backend (Gen 2)

## Local development

- Run **`npm run sandbox`** from the repo root. This deploys a sandbox stack and writes **`src/amplify_outputs.json`** (see `package.json` `sandbox` script).
- The Vite app calls **`Amplify.configure()`** only when `amplify_outputs.json` includes a non-empty Cognito **`user_pool_client_id`** (see `src/lib/amplifyConfigure.js`).

## Frontend hosting (AWS Amplify Hosting)

- Use **[Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)** with this repo: the build spec is **[`amplify.yml`](../amplify.yml)** (`npm ci` → `npm run build` → artifacts from **`dist/`**).
- Set **`VITE_`** environment variables in the Amplify console for each branch (e.g. `VITE_COMPLETE_ASSESSMENT_URL` after your backend function URL is known). Do not commit secrets.
- Deploy the **Gen 2 backend** (Lambda, Cognito, AppSync) via **`ampx pipeline-deploy`** or your CI/CD pipeline — see [Amplify Gen 2 deploy](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/).

## Secrets (never in the browser)

- **Brevo** API key and sender email are configured as Lambda **secrets** in `amplify/functions/completeAssessment/resource.ts` (`secret('BREVO_API_KEY')`, etc.). They are available only to the **`completeAssessment`** function, not to Vite env vars.

## Frontend environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_COMPLETE_ASSESSMENT_URL` | Optional override for the **completeAssessment** HTTPS function URL. If unset, the app uses `custom.completeAssessmentFunctionUrl` from `amplify_outputs.json` (see `src/lib/completeAssessmentUrl.js`). |
| `VITE_QUIZ_EMAIL_API_URL` | **Legacy** only: points at a standalone serverless handler such as `api/send-quiz-email.js` (Brevo/SES). Production onboarding should use the Lambda + Cognito path instead. |

## Shared BHI report HTML

- Email HTML for the BHI report is built in **`lib/bhiReportEmailHtml.js`** (shared by the Lambda handler and **`api/send-quiz-email.js`**).
- The Lambda handler imports it via **`../../../lib/bhiReportEmailHtml.js`** relative to `amplify/functions/completeAssessment/handler.ts` (bundled by `ampx`).

## Rate limiting

- **`completeAssessment`** enforces a per-email **daily cap** (UTC date) using the **`OnboardingAttempt`** model (`slotKey` = `email#YYYY-MM-DD`). Returns **429** when the cap is exceeded.

## CAPTCHA / API Gateway / WAF

- Not implemented in-repo. For WAF, API Gateway usage plans, and CAPTCHA verification patterns, see **[docs/edge-hardening.md](edge-hardening.md)**.
- For an optional UI migration to **`Authenticator` / `useAuthenticator`**, see **[docs/authenticator-migration.md](authenticator-migration.md)**.
