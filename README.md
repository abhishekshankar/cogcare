# CogCare (Vite + React)

Marketing site and **Brain Health Index** quiz with optional **AWS Amplify Gen 2** backend: Cognito auth, AppSync data, S3 avatars, and a **`completeAssessment`** Lambda (Brevo emails + onboarding).

## Amplify & env

See **[docs/cogcare-amplify.md](docs/cogcare-amplify.md)** for:

- `npm run sandbox` and `src/amplify_outputs.json`
- Brevo secrets on Lambda only (not in Vite)
- `VITE_COMPLETE_ASSESSMENT_URL` and legacy `VITE_QUIZ_EMAIL_API_URL`
- Shared report HTML in `lib/bhiReportEmailHtml.js` and rate limiting notes
- Optional edge hardening and Authenticator migration: [docs/edge-hardening.md](docs/edge-hardening.md), [docs/authenticator-migration.md](docs/authenticator-migration.md)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run sandbox` | Deploy Amplify sandbox; writes `src/amplify_outputs.json` |
| `npm run test:e2e` | Playwright smoke tests (`e2e/`); optional `E2E_EMAIL` / `E2E_PASSWORD` for full sign-in |
| `npm run deploy` | Build with `VITE_BASE_PATH=/cogcare/` and publish to `gh-pages` |

## Quiz email (production)

**Preferred:** the Amplify **`completeAssessment`** HTTPS function (Brevo + Cognito onboarding). Configure secrets in Lambda and use **`VITE_COMPLETE_ASSESSMENT_URL`** / `amplify_outputs.json` — see **[docs/cogcare-amplify.md](docs/cogcare-amplify.md)**.

**Legacy optional:** [`api/send-quiz-email.js`](api/send-quiz-email.js) is a standalone Brevo/SES handler sharing HTML with the Lambda via `lib/bhiReportEmailHtml.js`. Use **`VITE_QUIZ_EMAIL_API_URL`** only if you host that handler yourself (not required when `completeAssessment` is deployed).

### Local dev (`npm run dev`)

The Vite dev server exposes **`POST /api/send-quiz-email`** (see [`vite-plugin-local-email-api.js`](vite-plugin-local-email-api.js)) so you can test the legacy handler locally. Copy [`.env.example`](.env.example) to **`.env`** and set **`BREVO_API_KEY`** and **`BREVO_SENDER_EMAIL`** (server-side only; not `VITE_*`). In development the app defaults to same-origin `/api/send-quiz-email`; override with **`VITE_QUIZ_EMAIL_API_URL`** if needed.

### Brevo “authorised IPs” (API key)

If Brevo returns **`unrecognised IP address`**, add the caller’s public IPv4 under **[Security → Authorised IPs](https://app.brevo.com/security/authorised_ips)**. For **Lambda (`completeAssessment`)**, AWS egress IPs are stable per subnet/NAT setup; for **local dev**, your home IP changes more often. That list is **only editable in the Brevo dashboard**.

### AWS: Amplify Hosting (frontend)

Host the static Vite app on **[Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)** using the repo’s [`amplify.yml`](amplify.yml) (build → `dist`). Connect your Git branch, set **`VITE_`** variables in the Amplify console (e.g. `VITE_COMPLETE_ASSESSMENT_URL` after backend deploy), and run backend deploys separately (`ampx pipeline-deploy` / CI) so `amplify_outputs.json` or env overrides match production.

---

## React + Vite (template)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used with [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs) for Fast Refresh

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
