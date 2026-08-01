const PHI_PATTERN = /\b(diagnos(?:is|ed)|patient\s+(?:name|record)|medical\s+record|mrn|social\s+security|date\s+of\s+birth|dob)\b/i

export const NETWORK_RESPONSE_STATES = Object.freeze(['interested', 'declined', 'withdrawn'])
export const ATTRIBUTION_STATES = Object.freeze(['approved', 'declined'])

export function cleanText(value, { field = 'Text', required = false, max = 2000, rejectPhi = true } = {}) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (required && !text) return { ok: false, error: `${field} is required.` }
  if (text.length > max) return { ok: false, error: `${field} must be ${max} characters or fewer.` }
  if (rejectPhi && PHI_PATTERN.test(text)) {
    return { ok: false, error: `${field} must not contain patient or diagnostic information.` }
  }
  return { ok: true, value: text }
}

export function enumValue(value, allowed, field) {
  return allowed.includes(value)
    ? { ok: true, value }
    : { ok: false, error: `${field} is invalid.` }
}

export function safeJsonBody(raw) {
  try {
    const value = raw ? JSON.parse(raw) : {}
    return value && typeof value === 'object' && !Array.isArray(value)
      ? { ok: true, value }
      : { ok: false, error: 'JSON body must be an object.' }
  } catch {
    return { ok: false, error: 'Invalid JSON body.' }
  }
}

export function consentChanges(before, after) {
  const fields = ['profileVisibility', 'publicNameConsentAt', 'communicationPreference', 'disclosureAcknowledgedAt']
  return fields.reduce((changes, field) => {
    const previous = before?.[field] ?? null
    const next = after?.[field] ?? null
    if (previous !== next) changes[field] = { before: previous, after: next }
    return changes
  }, {})
}

/** Downgrade an 'attending' RSVP to 'waitlist' once the event's capacity is already met. */
export function resolveEventRsvpResponse(event, requestedResponse, attendingCountExcludingSelf) {
  const capacity = event?.capacity
  if (requestedResponse === 'attending' && typeof capacity === 'number' && attendingCountExcludingSelf >= capacity) {
    return 'waitlist'
  }
  return requestedResponse
}

export function isPublishedNow(item, now = new Date()) {
  if (item?.status !== 'published') return false
  const opens = item.opensAt ? new Date(item.opensAt) : null
  const closes = item.closesAt ? new Date(item.closesAt) : null
  return (!opens || opens <= now) && (!closes || closes >= now)
}

/** Any non-empty preference other than explicit opt-out counts as communication consent. */
export function hasNetworkCommunicationConsent(consultant) {
  const preference = consultant?.communicationPreference
  return Boolean(preference && preference !== 'none')
}

/** Empty audience means all members; otherwise match role, participation mode, or venture. */
export function matchesNetworkAudience(item, consultant) {
  let audience
  try { audience = JSON.parse(item?.audienceJson || '[]') } catch { return false }
  if (!Array.isArray(audience)) return false
  if (!audience.length) return true
  let ventures = []
  try { ventures = JSON.parse(consultant?.ventureAssociationsJson || '[]') } catch { ventures = [] }
  const dimensions = new Set([
    consultant?.networkRoleCategory,
    consultant?.participationMode,
    ...ventures,
  ].filter(Boolean))
  return audience.some((value) => typeof value === 'string' && dimensions.has(value))
}
