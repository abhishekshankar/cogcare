import { fetchAuthSession } from 'aws-amplify/auth'

/** @returns {Promise<string | null>} Bearer token for accept-network-invitation Lambda. */
export async function fetchNetworkInviteAuthToken() {
  if (import.meta.env.VITE_E2E_NETWORK_MOCKS === '1') {
    return 'e2e-token'
  }

  try {
    const session = await fetchAuthSession()
    return session.tokens?.idToken?.toString() || null
  } catch {
    return null
  }
}

/** @returns {Promise<string | null>} Lowercase email for the signed-in invitee, if any. */
export async function fetchNetworkInviteSessionEmail() {
  if (import.meta.env.VITE_E2E_NETWORK_MOCKS === '1') {
    return 'founder@example.com'
  }

  try {
    const session = await fetchAuthSession()
    const email = session.tokens?.idToken?.payload?.email
    return typeof email === 'string' ? email.toLowerCase() : null
  } catch {
    return null
  }
}
