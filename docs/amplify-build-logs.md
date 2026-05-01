# Amplify Hosting: get build failure logs

Use this when a **branch build** fails in **AWS Amplify Hosting** (including Gen 2: `ampx pipeline-deploy`, `ampx generate outputs`, `npm run build` from `amplify.yml`).

---

## 0. One-command Markdown export (repo script)

From the repo root, with AWS CLI configured for the **account that owns the CogCare Amplify app**:

1. Copy **`.env.amplify-fetch.example`** → **`.env.amplify-fetch`** (gitignored) and set `AMPLIFY_APP_ID` (from the console URL `.../apps/<id>/...`) and `AMPLIFY_BRANCH`.
2. Run:

```bash
chmod +x scripts/fetch-amplify-build-log.sh
./scripts/fetch-amplify-build-log.sh
```

By default this **overwrites** **`docs/amplify-build-export.md`** with the latest **FAILED** job on that branch (or the latest job if none failed). Override with `AMPLIFY_JOB_ID` or `AMPLIFY_LOG_OUT` (see comments in `scripts/fetch-amplify-build-log.sh`).

---

## 1. AWS Console (fastest)

1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/) and select the **same region** as the app.
2. Open your **app** → **Hosting** → select the **branch** that failed.
3. In **Deployments** (build history), open the **failed** deployment.
4. Expand each **step** (e.g. `PROVISION`, `BUILD`, `DEPLOY`) and read the log, or use **Download logs** if the UI offers it.
5. If the failure is **backend / CDK** (`ampx pipeline-deploy`), note the **CloudFormation** error in the log, then open **CloudFormation** in that region → find the stack for this deployment → **Events** for the failing resource.

---

## 2. AWS CLI: list jobs and inspect a job

Replace `APP_ID`, `BRANCH`, and optionally `JOB_ID`.

```bash
# Find app id (short id in Amplify URL: .../apps/<APP_ID>/...)
aws amplify list-apps --query 'apps[*].[name,appId]' --output table

# Recent jobs on a branch (newest first; job ids are numeric strings)
aws amplify list-jobs --app-id APP_ID --branch-name BRANCH --max-results 10

# Full detail for one job (per-step status, context, presigned log URLs)
aws amplify get-job --app-id APP_ID --branch-name BRANCH --job-id JOB_ID
```

`get-job` returns `job.steps[]` with fields like `stepName`, `status`, `logUrl` (when available). **Log URLs are presigned and expire** (often ~1 hour); fetch them soon after calling `get-job`.

---

## 3. Download all step logs into one Markdown file

Use **`scripts/fetch-amplify-build-log.sh`** (see §0). It wraps `list-jobs` / `get-job`, curls each step `logUrl`, and writes a single Markdown file.

Commit **`docs/amplify-build-export.md`** only if you intend to share a sanitized failure with the team; otherwise keep it local (logs may contain paths or hints about your environment).

---

## 4. Repo-specific reminders

- Build spec: root **`amplify.yml`** (see `docs/deploy-instructions-for-llm.md`).
- **Secrets** (e.g. Brevo) are backend/Lambda secrets — missing or wrong names show up in the **backend** phase of the build log.
- **Gen 2 CDK bootstrap** errors appear in `ampx pipeline-deploy` output; fix with `npx aws-cdk bootstrap aws://ACCOUNT/REGION` in the **same region** as the Amplify app.

---

## 5. Paste manual capture here (optional template)

If you only have console text, paste it below when filing an issue or asking for help:

```markdown
### Amplify failure summary
- App:
- Region:
- Branch:
- Job ID (if known):
- Failed step name (e.g. BUILD):

### Last ~50 lines of the failed step log
(paste)

### CloudFormation resource / event (if any)
(paste)
```
