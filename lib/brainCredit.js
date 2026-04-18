/**
 * Engagement bonus points (capped) from number of completed assessments — keep in sync with Lambda.
 * @param {number} completedAssessmentCount
 */
export function engagementBonusFromCount(completedAssessmentCount) {
  const n = Math.max(1, Number(completedAssessmentCount) || 1)
  return Math.min(25, (n - 1) * 5)
}

/**
 * Normal Aging probability (0–100) from quiz results, if present.
 * @param {object|null|undefined} results
 */
export function normalAgingPercentFromResults(results) {
  if (!results || typeof results !== 'object') return null
  const differentials = Array.isArray(results.differentials) ? results.differentials : []
  const normal = differentials.find((d) => d.label === 'Normal Aging')?.probability
  return typeof normal === 'number' && !Number.isNaN(normal) ? normal : null
}

/**
 * Historical brain credit per saved assessment (oldest → newest). Score at each row uses
 * completedAssessmentCount = index + 1 (assessments completed through that point).
 *
 * @param {Array<{ id?: string, completedAt?: string, resultsJson?: string | null }>} assessments
 * @returns {Array<{ id?: string, completedAt: string, score: number }>}
 */
export function computeBrainCreditHistory(assessments) {
  const sorted = [...(assessments || [])].sort(
    (a, b) => new Date(a.completedAt || 0) - new Date(b.completedAt || 0),
  )
  return sorted.map((a, idx) => {
    let results = null
    try {
      results = JSON.parse(a.resultsJson || '{}')
    } catch {
      results = null
    }
    const count = idx + 1
    const score = computeBrainCreditFromResults(results, { completedAssessmentCount: count })
    return {
      id: a.id,
      completedAt: a.completedAt || '',
      score,
    }
  })
}

/**
 * v1 Brain Credit: map "Normal Aging" differential % to a 300–850-style score (higher = better),
 * plus a small capped bonus for multiple completed assessments (engagement).
 * Shared by the SPA (dashboard) and completeAssessment Lambda — keep in sync.
 *
 * @param {object|null|undefined} results
 * @param {{ completedAssessmentCount?: number }} [options]
 */
export function computeBrainCreditFromResults(results, options = {}) {
  const n = Math.max(1, Number(options.completedAssessmentCount) || 1)
  const bonus = engagementBonusFromCount(n)

  if (!results || typeof results !== 'object') {
    return Math.min(850, 575 + bonus)
  }

  const differentials = Array.isArray(results.differentials) ? results.differentials : []
  const normal = differentials.find((d) => d.label === 'Normal Aging')?.probability ?? 50
  const base = Math.round(300 + (normal / 100) * 550)
  return Math.min(850, base + bonus)
}
