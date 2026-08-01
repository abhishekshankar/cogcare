import test from 'node:test'
import assert from 'node:assert/strict'
import { parseBrandsJson, brandLabel, roleLabel } from '../lib/networkConstants.js'
import { inviteStatusMessage } from '../lib/networkInvitationStatus.js'

test('parseBrandsJson tolerates invalid input', () => {
  assert.deepEqual(parseBrandsJson('["cogcare","nso"]'), ['cogcare', 'nso'])
  assert.deepEqual(parseBrandsJson('not-json'), [])
  assert.deepEqual(parseBrandsJson(null), [])
})

test('brand and role labels fall back to id', () => {
  assert.equal(brandLabel('cogcare'), 'CogCare')
  assert.equal(brandLabel('unknown'), 'unknown')
  assert.equal(roleLabel('physician'), 'Physician')
})

test('inviteStatusMessage blocks revoked, accepted, and expired invites', () => {
  const now = Date.parse('2026-07-31T12:00:00.000Z')
  assert.match(inviteStatusMessage({ status: 'revoked' }, now), /revoked/i)
  assert.match(inviteStatusMessage({ status: 'accepted' }, now), /already been accepted/i)
  assert.match(
    inviteStatusMessage({ status: 'pending', expiresAt: '2026-07-30T00:00:00.000Z' }, now),
    /expired/i,
  )
  assert.equal(inviteStatusMessage({ status: 'pending', expiresAt: '2026-08-01T00:00:00.000Z' }, now), null)
})
