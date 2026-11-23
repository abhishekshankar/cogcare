/**
 * Consultant matcher used by the directory and the booker.
 *
 * Inputs:
 *   consultants    — array of Consultant rows (already filtered for visibility)
 *   ctx            — { residenceState, latestResults, affiliationPreference }
 *
 * Output: same array, sorted highest-score first, each row tagged with
 *   .__matchScore and .__matchReasons (string[]) for debug/UI tooltips.
 *
 * Scoring (additive, cap at 100):
 *   +50  consultant licensed in the patient's residence state
 *   +30  in-house affiliation (CogCare clinical team is anchor supply)
 *   +15  verified-partner affiliation
 *    +0  marketplace
 *   +20  consultant credentials match the top differential's prescribing need
 *   +10  consultant credentials match a secondary differential
 *    -∞  if residenceState is set AND consultant has licensedStates AND not licensed
 *        (returns -Infinity; caller can choose to display them dimmed or drop them)
 *
 * The function never reorders consultants whose licensure can't be evaluated
 * (e.g. coaches with no licensedStates), so non-licensed practitioners stay
 * in the mix at their base score.
 */

const PRESCRIBING_DIFFERENTIALS = new Set([
  'ADHD',
  'Major Depressive Disorder',
  'Generalized Anxiety',
  'Bipolar',
  'OCD',
])

const PRESCRIBER_KEYWORDS = ['MD', 'DO', 'NP', 'PA', 'Psychiatr']

function isPrescriber(consultant) {
  const blob = `${consultant.credentials || ''} ${consultant.title || ''}`
  return PRESCRIBER_KEYWORDS.some((k) => blob.includes(k))
}

function topDifferentials(latestResults, n = 2) {
  const diffs = Array.isArray(latestResults?.differentials)
    ? [...latestResults.differentials]
    : []
  return diffs
    .filter((d) => d?.label && d.label !== 'Normal Aging')
    .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))
    .slice(0, n)
    .map((d) => d.label)
}

export function scoreConsultant(consultant, ctx) {
  const reasons = []
  let score = 0

  const stateCode = ctx?.residenceState?.toUpperCase()
  const licensed = Array.isArray(consultant.licensedStates)
    ? consultant.licensedStates.map((s) => s.toUpperCase())
    : []

  if (stateCode && licensed.length) {
    if (licensed.includes(stateCode)) {
      score += 50
      reasons.push(`Licensed in ${stateCode}`)
    } else {
      // Hard exclusion: prescribed scope of practice rules out telehealth.
      return { score: Number.NEGATIVE_INFINITY, reasons: [`Not licensed in ${stateCode}`] }
    }
  }

  if (consultant.affiliation === 'in_house') {
    score += 30
    reasons.push('CogCare Clinical')
  } else if (consultant.affiliation === 'verified_partner') {
    score += 15
    reasons.push('Verified Partner')
  }

  const tops = topDifferentials(ctx?.latestResults, 2)
  if (tops.length && isPrescriber(consultant)) {
    if (PRESCRIBING_DIFFERENTIALS.has(tops[0])) {
      score += 20
      reasons.push(`Prescriber for ${tops[0]}`)
    } else if (tops[1] && PRESCRIBING_DIFFERENTIALS.has(tops[1])) {
      score += 10
      reasons.push(`Prescriber for ${tops[1]}`)
    }
  }

  return { score: Math.min(100, score), reasons }
}

export function matchConsultants(consultants, ctx) {
  if (!Array.isArray(consultants) || consultants.length === 0) return []
  const enriched = consultants.map((c) => {
    const { score, reasons } = scoreConsultant(c, ctx)
    return { ...c, __matchScore: score, __matchReasons: reasons }
  })
  // Drop hard exclusions so the booker doesn't accidentally schedule a
  // licensure-incompatible session. Directory callers can opt back in by
  // passing keepExcluded:true.
  const usable = enriched.filter((c) => Number.isFinite(c.__matchScore))
  return usable.sort((a, b) => b.__matchScore - a.__matchScore)
}

export function matchConsultantsKeepExcluded(consultants, ctx) {
  if (!Array.isArray(consultants) || consultants.length === 0) return []
  return consultants
    .map((c) => {
      const { score, reasons } = scoreConsultant(c, ctx)
      return { ...c, __matchScore: score, __matchReasons: reasons }
    })
    .sort((a, b) => {
      const av = Number.isFinite(a.__matchScore) ? a.__matchScore : -1
      const bv = Number.isFinite(b.__matchScore) ? b.__matchScore : -1
      return bv - av
    })
}
