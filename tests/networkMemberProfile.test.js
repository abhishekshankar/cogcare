import test from 'node:test'
import assert from 'node:assert/strict'
import {
  consultantToMemberProfileForm,
  validateNetworkMemberProfile,
} from '../lib/networkMemberProfile.js'

const privateConsultant = {
  name: 'Dr. Pat Kim',
  title: 'Behavioral neurologist',
  organization: 'CogCare',
  participationMode: 'passive',
  profileVisibility: 'private',
  ventureAssociationsJson: '["cogcare"]',
  communicationPreference: 'none',
}

test('consultantToMemberProfileForm defaults to private with no communications', () => {
  const form = consultantToMemberProfileForm(privateConsultant)
  assert.equal(form.publicProfileConsent, false)
  assert.equal(form.profileVisibility, 'private')
  assert.equal(form.communicationsConsent, false)
  assert.equal(form.participationMode, 'passive')
})

test('validateNetworkMemberProfile keeps independent consent controls', () => {
  const form = {
    ...consultantToMemberProfileForm(privateConsultant),
    communicationsConsent: true,
    communicationPreference: 'email',
    publicProfileConsent: false,
    nameBioConsent: false,
  }
  const result = validateNetworkMemberProfile(form)
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.profileVisibility, 'private')
    assert.equal(result.value.communicationsConsent, true)
  }
})

test('validateNetworkMemberProfile requires name/bio consent when public visibility is on', () => {
  const form = {
    ...consultantToMemberProfileForm(privateConsultant),
    publicProfileConsent: true,
    profileVisibility: 'public',
    nameBioConsent: false,
  }
  const result = validateNetworkMemberProfile(form)
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /name and biography/i)
})
