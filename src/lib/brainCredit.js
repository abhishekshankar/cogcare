/**
 * v1 Brain Credit: map "Normal Aging" differential % to a 300–850-style score (higher = better),
 * plus a small capped bonus for multiple completed assessments (engagement).
 * Keep in sync with [amplify/functions/completeAssessment/handler.ts](amplify/functions/completeAssessment/handler.ts) usage at signup (count=1).
 *
 * @param {object|null|undefined} results
 * @param {{ completedAssessmentCount?: number }} [options]
 */
export function computeBrainCreditFromResults(results, options = {}) {
  const n = Math.max(1, Number(options.completedAssessmentCount) || 1)
  const bonus = Math.min(25, (n - 1) * 5)

  if (!results || typeof results !== 'object') {
    return Math.min(850, 575 + bonus)
  }

  const differentials = Array.isArray(results.differentials) ? results.differentials : []
  const normal = differentials.find((d) => d.label === 'Normal Aging')?.probability ?? 50
  const base = Math.round(300 + (normal / 100) * 550)
  return Math.min(850, base + bonus)
}
