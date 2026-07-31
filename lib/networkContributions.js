/**
 * Activity and recognition derive only from recorded contributions — never inferred.
 */

/** @typedef {{ id: string, kind: string, title: string, recordedAt: string, recognition?: string }} NetworkContribution */

/**
 * @param {NetworkContribution[] | null | undefined} contributions
 * @returns {NetworkContribution[]}
 */
export function sortContributionsNewestFirst(contributions) {
  if (!Array.isArray(contributions)) return []
  return [...contributions].sort(
    (a, b) => String(b.recordedAt).localeCompare(String(a.recordedAt)),
  )
}

/**
 * @param {NetworkContribution[] | null | undefined} contributions
 * @returns {boolean}
 */
export function hasRecordedContributions(contributions) {
  return sortContributionsNewestFirst(contributions).length > 0
}
