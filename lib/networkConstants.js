import { VENTURE_REGISTRY } from './ventureRegistry.js'

/** @deprecated prefer VENTURE_REGISTRY — kept for Phase 1–2 call sites */
export const NETWORK_BRANDS = VENTURE_REGISTRY.map((v) => ({ id: v.id, label: v.label }))

export const NETWORK_ROLE_CATEGORIES = [
  { id: 'physician', label: 'Physician' },
  { id: 'researcher', label: 'Researcher' },
  { id: 'educator', label: 'Educator' },
  { id: 'care_leader', label: 'Care leader' },
  { id: 'technologist', label: 'Technologist' },
  { id: 'public_health', label: 'Public health' },
]

export const NETWORK_COHORTS = [
  { id: 'founding', label: 'Founding cohort' },
]

export const NETWORK_INVITE_STATUSES = {
  pending: 'Pending',
  accepted: 'Accepted',
  revoked: 'Revoked',
  expired: 'Expired',
}

/** @param {string} id */
export function brandLabel(id) {
  return NETWORK_BRANDS.find((b) => b.id === id)?.label ?? id
}

/** @param {string} id */
export function roleLabel(id) {
  return NETWORK_ROLE_CATEGORIES.find((r) => r.id === id)?.label ?? id
}

/** @param {unknown} brandsJson */
export function parseBrandsJson(brandsJson) {
  if (!brandsJson) return []
  try {
    const parsed = JSON.parse(String(brandsJson))
    return Array.isArray(parsed) ? parsed.filter((b) => typeof b === 'string') : []
  } catch {
    return []
  }
}
