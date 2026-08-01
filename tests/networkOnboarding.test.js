import test from 'node:test'
import assert from 'node:assert/strict'
import {
  emptyNetworkOnboardingForm,
  validateNetworkOnboarding,
} from '../lib/networkOnboarding.js'

const base = () => ({
  ...emptyNetworkOnboardingForm(),
  name: 'Dr. Alex Rivera',
  title: 'Behavioral neurologist',
  organization: 'CogCare',
  participationMode: 'passive',
  ventureAssociations: ['cogcare'],
  privateJoinConsent: true,
  publicProfileConsent: false,
  profileVisibility: 'private',
  nameBioConsent: false,
  communicationsConsent: false,
  communicationPreference: 'founding_updates',
  disclosureAcknowledged: true,
})

test('validateNetworkOnboarding requires core professional fields', () => {
  const missing = validateNetworkOnboarding(emptyNetworkOnboardingForm())
  assert.equal(missing.ok, false)
  if (!missing.ok) assert.match(missing.error, /name/i)
})

test('validateNetworkOnboarding requires private join consent', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    privateJoinConsent: false,
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /join.*privately/i)
})

test('validateNetworkOnboarding requires name and bio consent for public visibility', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    publicProfileConsent: true,
    profileVisibility: 'public',
    nameBioConsent: false,
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /name and biography/i)
})

test('validateNetworkOnboarding accepts private join without public visibility or communications', () => {
  const result = validateNetworkOnboarding(base())
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.profileVisibility, 'private')
    assert.equal(result.value.publicProfileConsent, false)
    assert.equal(result.value.nameBioConsent, false)
    assert.equal(result.value.communicationsConsent, false)
    assert.equal(result.value.communicationPreference, 'none')
  }
})

test('validateNetworkOnboarding requires communication channel when communications consent is given', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    communicationsConsent: true,
    communicationPreference: 'not-valid',
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /communications/i)
})

test('validateNetworkOnboarding rejects invalid professional URL', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    professionalUrl: 'not-a-url',
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /professional url/i)
})

test('validateNetworkOnboarding rejects name bio consent without public profile opt-in', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    nameBioConsent: true,
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /profile visibility/i)
})
