import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveSafeReturnDestination } from '../lib/networkReturnTo.js'

test('resolveSafeReturnDestination allows sibling venture origins', () => {
  const dest = resolveSafeReturnDestination('https://cogtraining.org/cognition-network')
  assert.ok(dest)
  assert.equal(dest.label, 'Cogtraining')
  assert.match(dest.href, /^https:\/\/cogtraining\.org/)
})

test('resolveSafeReturnDestination allows relative CogCare paths', () => {
  const dest = resolveSafeReturnDestination('/dashboard/cognition-network')
  assert.ok(dest)
  assert.equal(dest.href, '/dashboard/cognition-network')
})

test('resolveSafeReturnDestination rejects unknown hosts', () => {
  assert.equal(resolveSafeReturnDestination('https://evil.example/phish'), null)
})
