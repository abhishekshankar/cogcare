import test from 'node:test'
import assert from 'node:assert/strict'
import { hasBlockingNetworkInvitation } from '../lib/networkAccountEligibility.js'

test('pending and accepted Network invitations block an end-user profile', () => {
  const rows = [
    { email: 'Doctor@Example.com', status: 'pending' },
    { email: 'accepted@example.com', status: 'accepted' },
  ]
  assert.equal(hasBlockingNetworkInvitation(rows, ' doctor@example.com '), true)
  assert.equal(hasBlockingNetworkInvitation(rows, 'ACCEPTED@example.com'), true)
})

test('revoked and expired invitations do not block an end-user profile', () => {
  const rows = [
    { email: 'person@example.com', status: 'revoked' },
    { email: 'person@example.com', status: 'expired' },
  ]
  assert.equal(hasBlockingNetworkInvitation(rows, 'person@example.com'), false)
})
