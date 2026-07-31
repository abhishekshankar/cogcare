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

test('consent controls are independent: private join does not require public visibility', () => {
  const result = validateNetworkOnboarding(base())
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.publicProfileConsent, false)
    assert.equal(result.value.profileVisibility, 'private')
  }
})

test('consent controls are independent: communications opt-in does not require public profile', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    communicationsConsent: true,
    communicationPreference: 'email',
    publicProfileConsent: false,
    nameBioConsent: false,
  })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.communicationsConsent, true)
    assert.equal(result.value.communicationPreference, 'email')
    assert.equal(result.value.publicProfileConsent, false)
    assert.equal(result.value.profileVisibility, 'private')
  }
})

test('consent controls are independent: public profile does not require communications', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    publicProfileConsent: true,
    profileVisibility: 'directory',
    nameBioConsent: true,
    communicationsConsent: false,
  })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.profileVisibility, 'directory')
    assert.equal(result.value.communicationsConsent, false)
    assert.equal(result.value.communicationPreference, 'none')
  }
})

test('public visibility still requires separate name and biography consent', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    publicProfileConsent: true,
    profileVisibility: 'public',
    nameBioConsent: false,
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /name and biography/i)
})

test('name and biography consent cannot be set without public profile opt-in', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    nameBioConsent: true,
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /profile visibility/i)
})

test('joining privately is required even when other consents are selected', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    privateJoinConsent: false,
    communicationsConsent: true,
    communicationPreference: 'email',
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /join.*privately/i)
})
