function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** @param {string} raw */
export async function hashNetworkInviteToken(raw) {
  const data = new TextEncoder().encode(raw)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return bytesToHex(new Uint8Array(digest))
}

export function generateNetworkInviteToken() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

/**
 * Resolve invite token from `/network/invite/:token` or `?token=`.
 * Route param wins when both are present.
 * @param {{ routeToken?: string | null, queryToken?: string | null }} sources
 */
export function resolveNetworkInviteToken({ routeToken, queryToken }) {
  const raw = String(routeToken ?? queryToken ?? '').trim()
  if (!raw) return ''
  try {
    return decodeURIComponent(raw).trim()
  } catch {
    return raw
  }
}

/**
 * @param {string} rawToken
 */
export function buildNetworkInvitePath(rawToken) {
  const token = String(rawToken || '').trim()
  if (!token) return '/network/invite'
  return `/network/invite/${encodeURIComponent(token)}`
}

/**
 * @param {string} rawToken
 * @param {string} [baseUrl]
 */
export function buildNetworkInviteUrl(rawToken, baseUrl) {
  const origin =
    baseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://cogcare.org')
  const base = origin.replace(/\/$/, '')
  return `${base}${buildNetworkInvitePath(rawToken)}`
}
