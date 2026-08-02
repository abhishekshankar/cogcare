const WAITLIST_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

export function normalizeWaitlistEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function validateWaitlistRequest(input) {
  const name = String(input?.name || '').trim()
  const email = normalizeWaitlistEmail(input?.email)
  const roleCategory = String(input?.roleCategory || '').trim()
  const organization = String(input?.organization || '').trim()
  const location = String(input?.location || '').trim()
  const professionalUrl = String(input?.professionalUrl || '').trim()
  const interest = String(input?.interest || '').trim()

  if (name.length < 2 || name.length > 120) throw new Error('Please enter your full name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error('Please enter a valid email address.')
  }
  if (roleCategory.length < 2 || roleCategory.length > 80) throw new Error('Please select your role.')
  if (organization.length > 160 || location.length > 120 || professionalUrl.length > 300) {
    throw new Error('One or more fields are too long.')
  }
  if (professionalUrl && !/^https?:\/\//i.test(professionalUrl)) {
    throw new Error('Professional profile must begin with http:// or https://.')
  }
  if (interest.length < 20 || interest.length > 1200) {
    throw new Error('Please tell us briefly why the Network is relevant to you (20–1,200 characters).')
  }
  if (input?.consent !== true) throw new Error('Please confirm that CogCare may contact you about this request.')

  return { name, email, roleCategory, organization, location, professionalUrl, interest }
}

export function generateWaitlistCode(bytes) {
  const source = Array.from(bytes || [])
  if (source.length < 6) throw new Error('Waitlist code requires six random bytes.')
  return `CN-${source.slice(0, 6).map((value) => WAITLIST_ALPHABET[value % WAITLIST_ALPHABET.length]).join('')}`
}
