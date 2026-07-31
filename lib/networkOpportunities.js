/**
 * Scoped contribution opportunities — optional, clearly bounded asks.
 */

/** @typedef {'interest' | 'declined'} OpportunityResponseKind */

/** @typedef {{ id: string, title: string, scope: string, timeCommitment: string, brand: string, closesAt?: string }} NetworkOpportunity */

/** @type {NetworkOpportunity[]} */
export const NETWORK_OPPORTUNITIES = [
  {
    id: 'founding-feedback-round',
    title: 'Founding member feedback round',
    scope:
      'Share written feedback on onboarding clarity and consent wording. No patient stories or clinical cases.',
    timeCommitment: '15–20 minutes, async',
    brand: 'cogcare',
    closesAt: '2026-09-30',
  },
  {
    id: 'directory-bio-review',
    title: 'Optional directory biography review',
    scope:
      'If you opted into directory visibility, review your professional biography for accuracy. You may keep your listing private instead.',
    timeCommitment: '10 minutes, async',
    brand: 'cogcare',
  },
  {
    id: 'cccs-curriculum-orientation',
    title: 'CCCS curriculum orientation (Cogtraining)',
    scope:
      'Review a short outline of the Certified Cognitive Care Support credential path and flag clarity issues. Educational content only — not clinical cases.',
    timeCommitment: '20 minutes, async',
    brand: 'cogtraining',
    closesAt: '2026-10-31',
  },
  {
    id: 'nso-panel-protocol-feedback',
    title: 'NSO panel protocol readability review',
    scope:
      'Comment on how families understand the panel-review pathway copy. No case details, patient-identifying information, or medical advice.',
    timeCommitment: '15 minutes, async',
    brand: 'nso',
    closesAt: '2026-10-31',
  },
]

/**
 * @param {string} kind
 * @returns {{ ok: true, value: OpportunityResponseKind } | { ok: false, error: string }}
 */
export function validateOpportunityResponse(kind) {
  if (kind === 'interest' || kind === 'declined') {
    return { ok: true, value: kind }
  }
  return { ok: false, error: 'Choose interest or decline.' }
}

/**
 * @param {string} opportunityId
 * @returns {boolean}
 */
export function isKnownOpportunity(opportunityId) {
  return NETWORK_OPPORTUNITIES.some((o) => o.id === opportunityId)
}
