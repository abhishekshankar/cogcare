import { PARTICIPATION_MODES, PUBLIC_VISIBILITY_OPTIONS, COMMUNICATION_PREFERENCES, PROFILE_VISIBILITY_OPTIONS } from './networkOnboarding.js'
import { NETWORK_BRANDS } from './networkConstants.js'

const BIO_MAX = 480

function isValidHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * @param {object | null | undefined} consultant
 * @returns {object}
 */
export function consultantToMemberProfileForm(consultant) {
  let ventureAssociations = ['cogcare']
  try {
    const parsed = JSON.parse(String(consultant?.ventureAssociationsJson || '[]'))
    if (Array.isArray(parsed) && parsed.length) {
      ventureAssociations = parsed.filter((id) => NETWORK_BRANDS.some((b) => b.id === id))
    }
  } catch {
    /* keep default */
  }

  const profileVisibility = consultant?.profileVisibility || 'private'
  const hasPublicConsent = Boolean(consultant?.publicNameConsentAt)
  const publicProfileConsent =
    hasPublicConsent && (profileVisibility === 'public' || profileVisibility === 'directory')

  const commPref = consultant?.communicationPreference || 'none'
  const communicationsConsent = commPref !== 'none' && commPref !== ''

  return {
    name: consultant?.name || '',
    title: consultant?.title || '',
    organization: consultant?.organization || '',
    professionalUrl: consultant?.professionalUrl || consultant?.bookingUrl || '',
    bio: consultant?.bio || '',
    interests: consultant?.interests || '',
    participationMode: consultant?.participationMode || 'passive',
    ventureAssociations: ventureAssociations.length ? ventureAssociations : ['cogcare'],
    publicProfileConsent,
    profileVisibility: publicProfileConsent ? profileVisibility : 'private',
    nameBioConsent: publicProfileConsent && hasPublicConsent,
    communicationsConsent,
    communicationPreference: communicationsConsent ? commPref : 'founding_updates',
  }
}

/**
 * Member settings validation — post-join; no join/disclosure gates.
 * @param {ReturnType<typeof consultantToMemberProfileForm>} form
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
export function validateNetworkMemberProfile(form) {
  const name = form.name?.trim()
  if (!name) return { ok: false, error: 'Please enter your name.' }

  const title = form.title?.trim()
  if (!title) return { ok: false, error: 'Please enter your professional title.' }

  const organization = form.organization?.trim()
  if (!organization) return { ok: false, error: 'Please enter your organization.' }

  const professionalUrl = form.professionalUrl?.trim() || ''
  if (professionalUrl && !isValidHttpUrl(professionalUrl)) {
    return { ok: false, error: 'Professional URL must be a valid http(s) link, or leave blank.' }
  }

  const bio = form.bio?.trim() || ''
  if (bio.length > BIO_MAX) {
    return { ok: false, error: `Biography must be ${BIO_MAX} characters or fewer.` }
  }

  const participationMode = form.participationMode?.trim()
  if (!PARTICIPATION_MODES.some((m) => m.id === participationMode)) {
    return { ok: false, error: 'Please choose a participation mode.' }
  }

  const ventureAssociations = Array.isArray(form.ventureAssociations)
    ? form.ventureAssociations.filter((id) => NETWORK_BRANDS.some((b) => b.id === id))
    : []
  if (!ventureAssociations.length) {
    return { ok: false, error: 'Select at least one venture association.' }
  }

  const profileVisibility = form.publicProfileConsent
    ? form.profileVisibility?.trim()
    : 'private'

  if (form.publicProfileConsent) {
    if (!PUBLIC_VISIBILITY_OPTIONS.some((v) => v.id === profileVisibility)) {
      return { ok: false, error: 'Choose a public visibility level (profile page or directory only).' }
    }
    if (!form.nameBioConsent) {
      return {
        ok: false,
        error: 'Public or directory listing requires consent to use your name and biography.',
      }
    }
  } else if (form.nameBioConsent) {
    return {
      ok: false,
      error: 'Name and biography consent applies only when you opt in to profile visibility.',
    }
  }

  const communicationsConsent = Boolean(form.communicationsConsent)
  let communicationPreference = 'none'
  if (communicationsConsent) {
    const chosen = form.communicationPreference?.trim()
    if (!COMMUNICATION_PREFERENCES.some((c) => c.id === chosen)) {
      return { ok: false, error: 'Choose how you would like to receive network communications.' }
    }
    communicationPreference = chosen
  }

  const interests = form.interests?.trim() || ''

  return {
    ok: true,
    value: {
      name,
      title,
      organization,
      professionalUrl: professionalUrl || undefined,
      bio: bio || undefined,
      participationMode,
      ventureAssociations,
      interests: interests || undefined,
      profileVisibility,
      publicProfileConsent: Boolean(form.publicProfileConsent),
      nameBioConsent: Boolean(form.nameBioConsent),
      communicationsConsent,
      communicationPreference,
    },
  }
}

/**
 * @param {object} validated
 * @returns {object}
 */
export function memberProfilePatchFromValidated(validated) {
  const publishName =
    validated.nameBioConsent &&
    validated.publicProfileConsent &&
    (validated.profileVisibility === 'public' || validated.profileVisibility === 'directory')

  return {
    name: validated.name,
    title: validated.title,
    organization: validated.organization,
    professionalUrl: validated.professionalUrl,
    bookingUrl: validated.professionalUrl,
    bio: validated.bio,
    interests: validated.interests,
    participationMode: validated.participationMode,
    ventureAssociationsJson: JSON.stringify(validated.ventureAssociations),
    profileVisibility: validated.profileVisibility,
    communicationPreference: validated.communicationPreference,
    isActive: validated.profileVisibility !== 'private',
    inactiveReason: validated.profileVisibility === 'directory' ? 'page_only' : undefined,
    publicNameConsentAt: publishName ? new Date().toISOString() : null,
  }
}

export { PARTICIPATION_MODES, PROFILE_VISIBILITY_OPTIONS, PUBLIC_VISIBILITY_OPTIONS, COMMUNICATION_PREFERENCES }
