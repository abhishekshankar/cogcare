import { NETWORK_BRANDS } from './networkConstants.js'

export const PARTICIPATION_MODES = [
  { id: 'passive', label: 'Passive', description: 'Stay on the roster quietly — no posting or outreach expected.' },
  { id: 'active', label: 'Active', description: 'Open to introductions, collaborations, and periodic network touchpoints.' },
  { id: 'selective', label: 'Selective', description: 'Participate when a specific topic or venture is a fit.' },
]

export const PROFILE_VISIBILITY_OPTIONS = [
  {
    id: 'public',
    label: 'Public profile',
    description: 'Name and directory details may appear on your public network profile.',
  },
  {
    id: 'directory',
    label: 'Directory only',
    description: 'Listed internally for members — no public profile page.',
  },
  {
    id: 'private',
    label: 'Private',
    description: 'Accepted membership with no public listing. Passive participation is valid.',
  },
]

export const COMMUNICATION_PREFERENCES = [
  { id: 'founding_updates', label: 'Founding cohort updates' },
  { id: 'email', label: 'Direct email for network matters' },
]

export const PUBLIC_VISIBILITY_OPTIONS = PROFILE_VISIBILITY_OPTIONS.filter((v) => v.id !== 'private')

const BIO_MAX = 480
const NOTE_MAX = 280

function isValidHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * @param {{
 *   inviteeName?: string
 *   inviteBrands?: string[]
 * }} [seed]
 */
export function emptyNetworkOnboardingForm(seed = {}) {
  return {
    name: seed.inviteeName || '',
    title: '',
    organization: '',
    professionalUrl: '',
    bio: '',
    participationMode: 'passive',
    ventureAssociations: seed.inviteBrands?.length ? [...seed.inviteBrands] : ['cogcare'],
    interests: '',
    privateJoinConsent: false,
    publicProfileConsent: false,
    profileVisibility: 'public',
    nameBioConsent: false,
    communicationsConsent: false,
    communicationPreference: 'founding_updates',
    disclosureAcknowledged: false,
    note: '',
  }
}

/**
 * Manual validation matching repo pattern (see AddProfileOnlyDialog).
 * @param {ReturnType<typeof emptyNetworkOnboardingForm>} form
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
export function validateNetworkOnboarding(form) {
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

  if (!form.privateJoinConsent) {
    return { ok: false, error: 'Please confirm you accept joining the network privately.' }
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

  if (!form.disclosureAcknowledged) {
    return { ok: false, error: 'Please acknowledge the network disclosure.' }
  }

  const note = form.note?.trim() || ''
  if (note.length > NOTE_MAX) {
    return { ok: false, error: `Optional note must be ${NOTE_MAX} characters or fewer.` }
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
      privateJoinConsent: true,
      publicProfileConsent: Boolean(form.publicProfileConsent),
      nameBioConsent: Boolean(form.nameBioConsent),
      communicationsConsent,
      communicationPreference,
      disclosureAcknowledged: true,
      note: note || undefined,
    },
  }
}
