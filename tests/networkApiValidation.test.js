import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanText, consentChanges, enumValue, hasNetworkCommunicationConsent, isPublishedNow, matchesNetworkAudience, safeJsonBody } from '../lib/networkApiValidation.js'

test('rejects PHI and diagnostic language in professional free text', () => {
  assert.equal(cleanText('Patient name Jane Doe', { required: true }).ok, false)
  assert.equal(cleanText('This patient was diagnosed yesterday', { required: true }).ok, false)
  assert.equal(cleanText('Review accessibility of the training module', { required: true }).ok, true)
})

test('strictly validates state transitions', () => {
  assert.deepEqual(enumValue('declined', ['interested', 'declined'], 'Response'), { ok: true, value: 'declined' })
  assert.equal(enumValue('accepted', ['interested', 'declined'], 'Response').ok, false)
})

test('consent history records only changed independent consent fields', () => {
  const changes = consentChanges(
    { profileVisibility: 'private', communicationPreference: 'none', title: 'Dr' },
    { profileVisibility: 'directory', communicationPreference: 'none', title: 'Professor' },
  )
  assert.deepEqual(changes, { profileVisibility: { before: 'private', after: 'directory' } })
})

test('published opportunity respects opening and closing times', () => {
  const now = new Date('2026-08-01T12:00:00Z')
  assert.equal(isPublishedNow({ status: 'draft' }, now), false)
  assert.equal(isPublishedNow({ status: 'published', opensAt: '2026-08-01T11:00:00Z', closesAt: '2026-08-01T13:00:00Z' }, now), true)
  assert.equal(isPublishedNow({ status: 'published', closesAt: '2026-08-01T11:00:00Z' }, now), false)
})

test('hasNetworkCommunicationConsent treats any non-none preference as consent', () => {
  assert.equal(hasNetworkCommunicationConsent({ communicationPreference: 'founding_updates' }), true)
  assert.equal(hasNetworkCommunicationConsent({ communicationPreference: 'email' }), true)
  assert.equal(hasNetworkCommunicationConsent({ communicationPreference: 'none' }), false)
  assert.equal(hasNetworkCommunicationConsent({}), false)
})

test('JSON API accepts objects only', () => {
  assert.equal(safeJsonBody('{"operation":"workspace"}').ok, true)
  assert.equal(safeJsonBody('[]').ok, false)
  assert.equal(safeJsonBody('{').ok, false)
})

test('audience targeting matches role, mode, or venture and empty means all members', () => {
  const member = { networkRoleCategory: 'physician', participationMode: 'passive', ventureAssociationsJson: '["cogcare"]' }
  assert.equal(matchesNetworkAudience({ audienceJson: '[]' }, member), true)
  assert.equal(matchesNetworkAudience({ audienceJson: '["physician"]' }, member), true)
  assert.equal(matchesNetworkAudience({ audienceJson: '["cogtraining"]' }, member), false)
  assert.equal(matchesNetworkAudience({ audienceJson: '{bad' }, member), false)
})
