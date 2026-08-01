import base from '../amplify_outputs.json' with { type: 'json' }

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

  if (import.meta.env.VITE_GRAPHQL_API_KEY) {
    o.data.api_key = import.meta.env.VITE_GRAPHQL_API_KEY
    const types = new Set(
      Array.isArray(o.data.authorization_types) ? o.data.authorization_types : [],
    )
    types.add('API_KEY')
    o.data.authorization_types = [...types]
  }

  if (import.meta.env.VITE_S3_BUCKET) {
    o.storage.bucket_name = import.meta.env.VITE_S3_BUCKET
    if (region) o.storage.aws_region = region
  }

  if (import.meta.env.VITE_COMPLETE_ASSESSMENT_URL) {
    o.custom = o.custom || {}
    o.custom.completeAssessmentFunctionUrl = import.meta.env.VITE_COMPLETE_ASSESSMENT_URL.trim()
  }

  if (import.meta.env.VITE_ACCEPT_NETWORK_INVITATION_URL) {
    o.custom = o.custom || {}
    o.custom.acceptNetworkInvitationFunctionUrl =
      import.meta.env.VITE_ACCEPT_NETWORK_INVITATION_URL.trim()
  }

  if (import.meta.env.VITE_UPDATE_NETWORK_MEMBER_PROFILE_URL) {
    o.custom = o.custom || {}
    o.custom.updateNetworkMemberProfileFunctionUrl =
      import.meta.env.VITE_UPDATE_NETWORK_MEMBER_PROFILE_URL.trim()
  }

  if (import.meta.env.VITE_NETWORK_PUBLIC_DATA_URL) {
    o.custom = o.custom || {}
    o.custom.networkPublicDataFunctionUrl = import.meta.env.VITE_NETWORK_PUBLIC_DATA_URL.trim()
  }

  if (import.meta.env.VITE_SEND_NETWORK_INVITATION_URL) {
    o.custom = o.custom || {}
    o.custom.sendNetworkInvitationFunctionUrl = import.meta.env.VITE_SEND_NETWORK_INVITATION_URL.trim()
  }

  if (import.meta.env.VITE_NETWORK_MEMBER_API_URL) {
    o.custom = o.custom || {}
    o.custom.networkMemberApiFunctionUrl = import.meta.env.VITE_NETWORK_MEMBER_API_URL.trim()
  }

  if (import.meta.env.VITE_NETWORK_ADMIN_API_URL) {
    o.custom = o.custom || {}
    o.custom.networkAdminApiFunctionUrl = import.meta.env.VITE_NETWORK_ADMIN_API_URL.trim()
  }

  return o
}
