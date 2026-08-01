import { hasPublicNameConsent, isVisibleTo } from '../src/lib/consultantVisibility.js'
import { NETWORK_BRANDS, parseBrandsJson } from './networkConstants.js'
import { isVentureId, ventureById, ventureLabel } from './ventureRegistry.js'

/**
 * Parse member venture associations from stored JSON.
 *
 * @param {unknown} ventureAssociationsJson
 * @returns {string[]}
 */
export function parseVentureAssociations(ventureAssociationsJson) {
  if (!ventureAssociationsJson) return []
  try {
    const parsed = JSON.parse(String(ventureAssociationsJson))
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id) => isVentureId(id))
  } catch {
    return []
  }
}

/**
 * Whether a member's venture association may appear on public surfaces.
 * Requires explicit public profile consent — association alone is never public.
 *
 * @param {object | null | undefined} consultant
 * @returns {boolean}
 */
export function canPublishVentureAssociations(consultant) {
  if (!consultant) return false
  if (!hasPublicNameConsent(consultant)) return false
  return isVisibleTo(consultant, 'profile') || isVisibleTo(consultant, 'directory')
}

/**
 * Venture labels safe to render on a public profile. Empty when consent is missing.
 *
 * @param {object | null | undefined} consultant
 * @returns {{ id: string, label: string }[]}
 */
export function publicVentureAssociationsForConsultant(consultant) {
  if (!canPublishVentureAssociations(consultant)) return []
  const ids = parseVentureAssociations(consultant?.ventureAssociationsJson)
  return ids.map((id) => ({ id, label: ventureLabel(id) }))
}

/**
 * Member portal venture cards — always scoped to the signed-in member's selections.
 *
 * @param {string[]} ventureAssociations
 * @returns {{ id: string, label: string, tagline: string, entryUrl: string }[]}
 */
export function memberVentureCards(ventureAssociations, { memberPortalReturnTo = '/network/member' } = {}) {
  const ids = (ventureAssociations ?? []).filter((id) => isVentureId(id))
  return ids.map((id) => {
    const venture = ventureById(id)
    return {
      id,
      label: venture?.label ?? ventureLabel(id),
      tagline: venture?.tagline ?? '',
      entryUrl: venture
        ? new URL(
            venture.networkEntryPath +
              (memberPortalReturnTo
                ? `?returnTo=${encodeURIComponent(memberPortalReturnTo)}`
                : ''),
            venture.origin,
          ).toString()
        : '',
    }
  })
}

/**
 * Filter contribution opportunities to ventures the member associated with.
 *
 * @param {import('./networkOpportunities.js').NetworkOpportunity[]} opportunities
 * @param {string[]} ventureAssociations
 */
export function filterOpportunitiesForVentures(opportunities, ventureAssociations) {
  const allowed = new Set((ventureAssociations ?? []).filter((id) => isVentureId(id)))
  if (!allowed.size) return []
  return opportunities.filter((opp) => allowed.has(opp.brand))
}

/**
 * Validate venture association selections against the canonical registry.
 *
 * @param {unknown} associations
 * @returns {{ ok: true, value: string[] } | { ok: false, error: string }}
 */
export function validateVentureAssociations(associations) {
  const list = Array.isArray(associations)
    ? associations.filter((id) => typeof id === 'string' && isVentureId(id))
    : []
  if (!list.length) {
    return { ok: false, error: 'Select at least one venture association.' }
  }
  const unknown = (associations ?? []).filter((id) => typeof id === 'string' && !isVentureId(id))
  if (unknown.length) {
    return { ok: false, error: 'One or more venture associations are not recognized.' }
  }
  return { ok: true, value: [...new Set(list)] }
}

/** @deprecated use ventureLabel — kept for NETWORK_BRANDS compat */
export function brandLabelFromRegistry(id) {
  return ventureLabel(id)
}

export { NETWORK_BRANDS, parseBrandsJson }
