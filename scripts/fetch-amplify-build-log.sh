#!/usr/bin/env bash
# Fetch Amplify Hosting build logs into a Markdown file (uses AWS CLI + presigned log URLs).
#
# Usage:
#   export AMPLIFY_APP_ID='dxxxxxxxxxxxx'   # from Amplify console URL .../apps/<id>/...
#   export AMPLIFY_BRANCH='main'            # or your feature branch name
#   optional: export AMPLIFY_JOB_ID='12'  # default: latest failed job, else latest job
#   optional: export AMPLIFY_LOG_OUT='docs/amplify-build-export.md'
#
# Or put the same variables in repo-root `.env.amplify-fetch` (gitignored; KEY=value lines).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env.amplify-fetch" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ROOT/.env.amplify-fetch"
  set +a
fi

APP_ID="${AMPLIFY_APP_ID:-}"
BRANCH="${AMPLIFY_BRANCH:-}"
JOB_ID="${AMPLIFY_JOB_ID:-}"
OUT="${AMPLIFY_LOG_OUT:-$ROOT/docs/amplify-build-export.md}"

if [[ -z "$APP_ID" || -z "$BRANCH" ]]; then
  echo "Missing AMPLIFY_APP_ID or AMPLIFY_BRANCH." >&2
  echo "Set them in the environment or in $ROOT/.env.amplify-fetch" >&2
  echo "See docs/amplify-build-logs.md" >&2
  exit 1
fi

if ! command -v aws >/dev/null || ! command -v jq >/dev/null || ! command -v curl >/dev/null; then
  echo "Requires aws CLI, jq, and curl on PATH." >&2
  exit 1
fi

if [[ -z "$JOB_ID" ]]; then
  jobs_json="$(aws amplify list-jobs --app-id "$APP_ID" --branch-name "$BRANCH" --max-results 25 --output json)"
  failed="$(echo "$jobs_json" | jq -r '[.jobSummaries[] | select(.status == "FAILED")] | first | .jobId // empty')"
  if [[ -n "$failed" ]]; then
    JOB_ID="$failed"
  else
    JOB_ID="$(echo "$jobs_json" | jq -r '.jobSummaries[0].jobId // empty')"
  fi
fi

if [[ -z "$JOB_ID" || "$JOB_ID" == "null" ]]; then
  echo "No jobs found for app $APP_ID branch $BRANCH." >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
tmp="$(mktemp)"
trap 'rm -f "$tmp" "${tmp}.steps.json"' EXIT

{
  echo "# Amplify build log export"
  echo ""
  echo "| Field | Value |"
  echo "|-------|-------|"
  echo "| App ID | \`$APP_ID\` |"
  echo "| Branch | \`$BRANCH\` |"
  echo "| Job ID | \`$JOB_ID\` |"
  echo "| Exported (UTC) | $(date -u +%Y-%m-%dT%H:%M:%SZ) |"
  echo ""
  echo "## Job summary"
  echo ""
  echo '```json'
  aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" \
    --query 'job.summary' --output json
  echo '```'
  echo ""

  steps_json="${tmp}.steps.json"
  aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" \
    --query 'job.steps' --output json >"$steps_json"

  n="$(jq 'length' "$steps_json")"
  for i in $(seq 0 $((n - 1))); do
    name="$(jq -r ".[$i].stepName // \"step-$i\"" "$steps_json")"
    status="$(jq -r ".[$i].status // \"unknown\"" "$steps_json")"
    log_url="$(jq -r ".[$i].logUrl // empty" "$steps_json")"
    echo "## Step: ${name} (${status})"
    echo ""
    if [[ -n "$log_url" && "$log_url" != "null" ]]; then
      echo '```text'
      if curl -fsSL "$log_url"; then
        :
      else
        echo "(curl failed for step logUrl — URL may have expired; re-run get-job and script immediately.)"
      fi
      echo '```'
    else
      echo "_(No logUrl for this step.)_"
    fi
    echo ""
  done
} >"$tmp"

mv "$tmp" "$OUT"
trap - EXIT
echo "Wrote $OUT"
