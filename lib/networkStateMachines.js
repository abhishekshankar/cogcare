/** Publishing lifecycle shared by NetworkBriefing and NetworkOpportunity. */
export const CONTENT_STATUSES = ['draft', 'published', 'closed', 'archived']

const CONTENT_TRANSITIONS = {
  draft: ['published', 'archived'],
  published: ['closed', 'archived'],
  closed: ['archived'],
  archived: [],
}

/**
 * @param {string} from
 * @param {string} to
 * @returns {boolean}
 */
export function canTransitionContentStatus(from, to) {
  return Boolean(CONTENT_TRANSITIONS[from]?.includes(to))
}

export const ATTRIBUTION_STATUSES = ['pending', 'approved', 'declined']
const ATTRIBUTION_DECISIONS = ['approved', 'declined']

/**
 * @param {string} from
 * @param {string} to
 * @returns {boolean}
 */
export function canTransitionAttributionStatus(from, to) {
  return from === 'pending' && ATTRIBUTION_DECISIONS.includes(to)
}

/**
 * @param {string} decision
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
export function validateAttributionDecision(decision) {
  if (ATTRIBUTION_DECISIONS.includes(decision)) return { ok: true, value: decision }
  return { ok: false, error: 'Decision must be approved or declined.' }
}

export const OPPORTUNITY_RESPONSE_KINDS = ['interested', 'declined', 'withdrawn']

/**
 * @param {string} kind
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
export function validateOpportunityResponseKind(kind) {
  if (OPPORTUNITY_RESPONSE_KINDS.includes(kind)) return { ok: true, value: kind }
  return { ok: false, error: 'Response must be interested, declined, or withdrawn.' }
}
