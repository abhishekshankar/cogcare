import { getMergedAmplifyOutputs } from './amplifyOutputs.js'
import { fetchNetworkInviteAuthToken } from './networkInviteSession.js'

function syncResolveUrl() {
  const fromEnv = import.meta.env.VITE_ACCEPT_NETWORK_INVITATION_URL
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim()

  const outputs = getMergedAmplifyOutputs()
  const custom = outputs?.custom && typeof outputs.custom === 'object' ? outputs.custom : {}
  const candidates = [
    custom.acceptNetworkInvitationFunctionUrl,
    outputs?.acceptNetworkInvitationFunctionUrl,
    custom.accept_network_invitation_function_url,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().startsWith('http')) return c.trim()
  }
  return ''
}

/** @returns {string} */
export function getAcceptNetworkInvitationUrl() {
  return syncResolveUrl()
}

/**
 * @param {{ token: string, onboarding: Record<string, unknown> }} params
 */
export async function postAcceptNetworkInvitation(params) {
  const url = getAcceptNetworkInvitationUrl()
  if (!url) {
    throw new Error(
      'Network invitation acceptance is not configured. Deploy the Amplify backend or run sandbox locally.',
    )
  }

  const idToken = await fetchNetworkInviteAuthToken()
  if (!idToken) {
    throw new Error('Sign in required to accept this invitation.')
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(params),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      typeof body?.error === 'string'
        ? body.error
        : `Could not accept invitation (${res.status}).`
    const err = new Error(msg)
    err.status = res.status
    err.details = body
    throw err
  }
  return body
}
