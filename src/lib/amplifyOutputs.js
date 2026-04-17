import base from '../amplify_outputs.json'

/**
 * Merged Amplify client config: committed `amplify_outputs.json` plus optional
 * `VITE_*` overrides (Amplify Hosting env vars) for auth, data, storage, and
 * the completeAssessment function URL.
 */
export function getMergedAmplifyOutputs() {
  const o = structuredClone(base)
  const region = import.meta.env.VITE_AWS_REGION

  if (import.meta.env.VITE_USER_POOL_CLIENT_ID) {
    o.auth.user_pool_client_id = import.meta.env.VITE_USER_POOL_CLIENT_ID
    if (import.meta.env.VITE_USER_POOL_ID) o.auth.user_pool_id = import.meta.env.VITE_USER_POOL_ID
    if (import.meta.env.VITE_IDENTITY_POOL_ID) o.auth.identity_pool_id = import.meta.env.VITE_IDENTITY_POOL_ID
    if (region) o.auth.aws_region = region
  }

  if (import.meta.env.VITE_GRAPHQL_URL) {
    o.data.url = import.meta.env.VITE_GRAPHQL_URL
    if (region) o.data.aws_region = region
  }

  if (import.meta.env.VITE_S3_BUCKET) {
    o.storage.bucket_name = import.meta.env.VITE_S3_BUCKET
    if (region) o.storage.aws_region = region
  }

  if (import.meta.env.VITE_COMPLETE_ASSESSMENT_URL) {
    o.custom = o.custom || {}
    o.custom.completeAssessmentFunctionUrl = import.meta.env.VITE_COMPLETE_ASSESSMENT_URL.trim()
  }

  return o
}
