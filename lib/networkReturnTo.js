/**
 * Resolve a safe external return link from ?returnTo= query param.
 *
 * @param {string | null | undefined} returnTo
 * @returns {{ href: string, label: string } | null}
 */
export function resolveSafeReturnDestination(returnTo) {
  if (!returnTo || typeof returnTo !== 'string') return null
  const trimmed = returnTo.trim()
  if (!trimmed) return null

  try {
    const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, 'https://placeholder.invalid')
    if (trimmed.startsWith('http')) {
      const allowed = ['cogcare.org', 'cogtraining.org', 'neurosecondopinion.org']
      const host = url.hostname.replace(/^www\./, '')
      if (!allowed.some((h) => host === h || host.endsWith('.' + h))) return null
      return { href: url.toString(), label: labelForHost(host) }
    }
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return { href: trimmed, label: 'CogCare dashboard' }
    }
  } catch {
    return null
  }
  return null
}

/** @param {string} host */
function labelForHost(host) {
  if (host.includes('cogtraining')) return 'Cogtraining'
  if (host.includes('neurosecondopinion')) return 'Neuro Second Opinion'
  if (host.includes('cogcare')) return 'CogCare'
  return 'previous page'
}
