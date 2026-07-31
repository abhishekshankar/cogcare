/**
 * Resolve the signed-in member's own Consultant row.
 * Never use this to surface another member's private fields in the portal.
 */

/**
 * @param {string | null | undefined} email
 * @returns {string}
 */
export function normalizeMemberEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

/**
 * @param {object | null | undefined} consultant
 * @returns {boolean}
 */
export function isNetworkMemberConsultant(consultant) {
  if (!consultant) return false
  return Boolean(consultant.networkCohort?.trim())
}

/**
 * @param {object[]} consultants
 * @param {string | null | undefined} email
 * @returns {object | null}
 */
export function findMemberConsultantByEmail(consultants, email) {
  const normalized = normalizeMemberEmail(email)
  if (!normalized || !Array.isArray(consultants)) return null

  const match = consultants.find(
    (c) => normalizeMemberEmail(c.contactEmail) === normalized && isNetworkMemberConsultant(c),
  )
  return match ?? null
}
