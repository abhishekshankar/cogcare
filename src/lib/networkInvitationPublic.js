import { hashNetworkInviteToken } from './networkInvitationTokens.js'
import { getMergedAmplifyOutputs } from './amplifyOutputs.js'

const E2E_INVITE_TOKEN_HASH =
  '91a44b8a82cac77b67b33b84b440cfb47214e9fa7c4f631445600834f5578b04'

const E2E_MOCK_INVITATION = {
  tokenHash: E2E_INVITE_TOKEN_HASH,
  email: 'founder@example.com',
  inviteeName: 'Dr. Pat Kim',
  cohort: 'founding',
  roleCategory: 'physician',
  brandsJson: '["cogcare"]',
  status: 'pending',
  expiresAt: '2030-01-01T00:00:00.000Z',
  createdAt: '2026-07-31T12:00:00.000Z',
  __typename: 'NetworkInvitation',
}

/**
 * @param {string} rawToken
 */
export async function fetchNetworkInvitationByToken(rawToken) {
  const tokenHash = await hashNetworkInviteToken(rawToken)
  if (import.meta.env.VITE_E2E_NETWORK_MOCKS === '1') {
    return tokenHash === E2E_INVITE_TOKEN_HASH ? E2E_MOCK_INVITATION : null
  }

  const url = getMergedAmplifyOutputs()?.custom?.networkPublicDataFunctionUrl
  if (typeof url !== 'string' || !url.startsWith('http')) throw new Error('Invitation lookup is unavailable.')
  const res = await fetch(`${url}?token=${encodeURIComponent(rawToken)}`)
  if (res.status === 404) return null
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'Could not load invitation.')
  return body.invitation || null
}
