import test from 'node:test'
import assert from 'node:assert/strict'
import {
  cleanText,
  isPublishedNow,
  matchesNetworkAudience,
  resolveEventRsvpResponse,
} from '../lib/networkApiValidation.js'
import { inviteStatusMessage } from '../lib/networkInvitationStatus.js'
import { findMemberConsultantByEmail } from '../src/lib/networkMemberLookup.js'
import { validateNetworkMemberProfile } from '../lib/networkMemberProfile.js'

const PHYSICIAN = {
  networkRoleCategory: 'physician',
  participationMode: 'passive',
  ventureAssociationsJson: '["cogcare"]',
}

test('PHYS-UNIT-INV-01 invite status blocks revoked, accepted, and expired invitations', () => {
  assert.match(inviteStatusMessage({ status: 'revoked' }), /revoked/i)
  assert.match(inviteStatusMessage({ status: 'accepted' }), /already been accepted/i)
  assert.match(inviteStatusMessage({ status: 'expired' }), /expired/i)
  assert.match(
    inviteStatusMessage({ status: 'pending', expiresAt: '2020-01-01T00:00:00.000Z' }),
    /expired/i,
  )
  assert.equal(inviteStatusMessage({ status: 'pending', expiresAt: '2030-01-01T00:00:00.000Z' }), null)
})

test('PHYS-UNIT-SEC-01 PHI patterns reject patient cases; professional language passes', () => {
  assert.equal(cleanText('Patient name Jane Doe', { required: true }).ok, false)
  assert.equal(cleanText('Recommend starting donepezil for this case.', { required: true }).ok, true)
  assert.equal(
    cleanText('Clinician-facing glossary for cognitive care navigation.', { required: true }).ok,
    true,
  )
})

test('PHYS-UNIT-AUD-01 physician audience targeting excludes researcher-only and venture-only content', () => {
  assert.equal(matchesNetworkAudience({ audienceJson: '["physician"]' }, PHYSICIAN), true)
  assert.equal(matchesNetworkAudience({ audienceJson: '["researcher"]' }, PHYSICIAN), false)
  assert.equal(matchesNetworkAudience({ audienceJson: '["nso"]' }, PHYSICIAN), false)
})

test('PHYS-UNIT-OPP-01 opportunity windows hide draft, future, and closed publishes', () => {
  const now = new Date('2026-08-01T12:00:00Z')
  assert.equal(isPublishedNow({ status: 'draft' }, now), false)
  assert.equal(isPublishedNow({ status: 'published', opensAt: '2099-01-01T00:00:00.000Z' }, now), false)
  assert.equal(isPublishedNow({ status: 'published', closesAt: '2026-01-01T00:00:00.000Z' }, now), false)
  assert.equal(isPublishedNow({ status: 'published' }, now), true)
})

test('PHYS-UNIT-MEM-01 duplicate consultant rows resolve to cohort membership only', () => {
  const rows = [
    { id: 'network', contactEmail: 'founder@example.com', networkCohort: 'founding' },
    { id: 'care-only', contactEmail: 'founder@example.com', networkCohort: '' },
  ]
  assert.equal(findMemberConsultantByEmail(rows, 'founder@example.com')?.id, 'network')
})

test('PHYS-UNIT-EVENT-01 event RSVP downgrades to waitlist once capacity is met', () => {
  assert.equal(resolveEventRsvpResponse({ capacity: 2 }, 'attending', 1), 'attending')
  assert.equal(resolveEventRsvpResponse({ capacity: 2 }, 'attending', 2), 'waitlist')
  assert.equal(resolveEventRsvpResponse({ capacity: 1 }, 'declined', 5), 'declined')
  assert.equal(resolveEventRsvpResponse({}, 'attending', 999), 'attending')
})

test('PHYS-UNIT-PROF-01 professional profile validation rejects invalid URLs and overlong bio', () => {
  const base = {
    name: 'Dr. Pat Kim',
    title: 'Behavioral neurologist',
    organization: 'CogCare',
    professionalUrl: 'not-a-url',
    bio: '',
    participationMode: 'passive',
    ventureAssociations: ['cogcare'],
    publicProfileConsent: false,
    profileVisibility: 'private',
    nameBioConsent: false,
    communicationsConsent: false,
    communicationPreference: 'founding_updates',
  }
  assert.equal(validateNetworkMemberProfile(base).ok, false)
  assert.equal(
    validateNetworkMemberProfile({ ...base, professionalUrl: 'https://example.org/dr-kim' }).ok,
    true,
  )
  assert.equal(
    validateNetworkMemberProfile({ ...base, professionalUrl: '', bio: 'x'.repeat(481) }).ok,
    false,
  )
})
