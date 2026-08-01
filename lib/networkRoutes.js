import { buildNetworkInvitePath } from '../src/lib/networkInvitationTokens.js'

/** Public Cognition Network routes wired in `src/App.jsx`. */
export const NETWORK_PUBLIC_ROUTES = {
  founding: '/network',
  invite: '/network/invite',
  consultantProfile: (slug) => `/dr/${encodeURIComponent(String(slug || '').trim())}`,
  dashboardNetwork: '/network/admin',
  dashboardMemberPortal: '/network/member',
  understand: '/network#network-intro-title',
}

/**
 * @param {string} [token]
 */
export function networkInviteRoute(token) {
  return buildNetworkInvitePath(token)
}

/**
 * @param {string} slug
 */
export function consultantProfileRoute(slug) {
  return NETWORK_PUBLIC_ROUTES.consultantProfile(slug)
}
