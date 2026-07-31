/**
 * Single source of truth for "is this consultant visible to <audience>?".
 *
 * Public surfaces require explicit name/profile consent (`publicNameConsentAt`).
 * Listing never implies endorsement, employment, clinical approval, or participation.
 *
 * The on/off model is two fields:
 *   isActive: true   → fully visible everywhere
 *   isActive: false  → hidden, but inactiveReason refines how aggressively:
 *     "hard_off"   — gone from public surfaces AND profile page 404s
 *     "page_only"  — gone from directory/booker/quiz, profile page still loads
 *     "soft"       — same as page_only on public side; admin UI flags it
 *     (null|other) — treated as "soft" by default
 *
 * Audiences:
 *   "directory" — listed on /dashboard/consultants and /dr/* index
 *   "booking"   — selectable in BookConsultPage and used to compute next slot
 *   "profile"   — /dr/:slug page renders (vs 404)
 *   "admin"     — admin always sees everything
 */

export const NETWORK_PUBLIC_DISCLAIMER =
  'This profile is shared at the member’s request as part of the Cognition Network. It is directory information only — not diagnosis, medical advice, or patient care. Listing does not imply endorsement, employment, clinical approval, or active participation by CogCare, Cogtraining, or Neuro Second Opinion.'

export const NETWORK_PROFILE_BIO_HINT =
  'Share professional background only. Do not include patient information, protected health information (PHI), or medical advice.'

export function hasPublicNameConsent(consultant) {
  return Boolean(consultant?.publicNameConsentAt)
}

export function isVisibleTo(consultant, audience) {
  if (!consultant) return false
  if (audience === 'admin') return true

  const visibility = consultant.profileVisibility || 'public'
  if (visibility === 'private') return false

  if (!hasPublicNameConsent(consultant)) return false

  if (audience === 'profile' && visibility === 'directory') return false

  // Default to active when the field is missing (legacy rows pre-migration).
  const active = consultant.isActive !== false

  if (active) return true

  const reason = consultant.inactiveReason || 'soft'

  if (audience === 'profile') {
    // hard_off is the only state that 404s the profile.
    return reason !== 'hard_off'
  }

  // directory + booking: any inactive state hides them from end-users.
  return false
}

export function filterForAudience(consultants, audience) {
  if (!Array.isArray(consultants)) return []
  return consultants.filter((c) => isVisibleTo(c, audience))
}

export const INACTIVE_REASON_LABELS = {
  hard_off: 'Hard off (profile 404s)',
  page_only: 'Page-only (URL still works, hidden elsewhere)',
  soft: 'Soft hide (admin only)',
}
