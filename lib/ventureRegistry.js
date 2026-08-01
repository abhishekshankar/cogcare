/**
 * Canonical Cognition Network venture registry — shared contract across CogCare,
 * Cogtraining, and Neuro Second Opinion. No cross-domain cookies or shared auth.
 */

/** @typedef {'cogcare' | 'cogtraining' | 'nso'} VentureId */

export const VENTURE_INDEPENDENCE_DISCLAIMER =
  'Ventures in the Cognition Network are independently operated. Association is directory context only — not employment, clinical endorsement, referral obligation, or proof of active participation.'

/** @type {readonly VentureId[]} */
export const VENTURE_IDS = ['cogcare', 'cogtraining', 'nso']

/**
 * @typedef {{
 *   id: VentureId
 *   label: string
 *   shortLabel: string
 *   origin: string
 *   networkEntryPath: string
 *   memberPortalPath?: string
 *   tagline: string
 * }} VentureRecord
 */

/** @type {readonly VentureRecord[]} */
export const VENTURE_REGISTRY = [
  {
    id: 'cogcare',
    label: 'CogCare',
    shortLabel: 'CogCare',
    origin: 'https://cogcare.org',
    networkEntryPath: '/network',
    memberPortalPath: '/network/member',
    tagline: 'Brain health education and the Brain Health Index.',
  },
  {
    id: 'cogtraining',
    label: 'Cogtraining',
    shortLabel: 'Cogtraining',
    origin: 'https://cogtraining.org',
    networkEntryPath: '/cognition-network',
    tagline: 'Cognitive-care training and verifiable credentials.',
  },
  {
    id: 'nso',
    label: 'Neuro Second Opinion',
    shortLabel: 'NSO',
    origin: 'https://neurosecondopinion.org',
    networkEntryPath: '/cognition-network.html',
    tagline: 'Specialist-panel second opinions in cognitive neurology.',
  },
]

/** @param {string} id */
export function isVentureId(id) {
  return VENTURE_IDS.includes(id)
}

/** @param {string} id */
export function ventureById(id) {
  return VENTURE_REGISTRY.find((v) => v.id === id) ?? null
}

/** @param {string} id */
export function ventureLabel(id) {
  return ventureById(id)?.label ?? id
}

/**
 * Portable deep link with explicit return destination. No SSO, cookies, or shared credentials.
 *
 * @param {{ ventureId: string, path?: string, returnTo?: string }} input
 * @returns {string}
 */
export function buildVentureDeepLink({ ventureId, path, returnTo }) {
  const venture = ventureById(ventureId)
  if (!venture) return ''

  const base = new URL(path || venture.networkEntryPath, venture.origin)
  if (returnTo && typeof returnTo === 'string' && returnTo.trim()) {
    base.searchParams.set('returnTo', returnTo.trim())
  }
  return base.toString()
}

/**
 * @param {string} [returnTo] — absolute or site-relative return path for the hub
 * @returns {string}
 */
export function buildCognitionNetworkHubUrl(returnTo) {
  return buildVentureDeepLink({
    ventureId: 'cogcare',
    path: '/network',
    returnTo,
  })
}
