/** Labels that should not appear as separate “loved one” profiles in the dashboard. */
const GENERIC_LOVED_ONE_NORMALIZED = new Set([
  'your loved one',
  'my loved one',
  'loved one',
])

/**
 * True if this display name is a generic placeholder (not a real named person).
 * @param {string | null | undefined} displayName
 */
export function isGenericLovedOneDisplayName(displayName) {
  const n = (displayName ?? '').trim().toLowerCase()
  if (!n) return true
  return GENERIC_LOVED_ONE_NORMALIZED.has(n)
}
