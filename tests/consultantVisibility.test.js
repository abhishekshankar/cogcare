import test from 'node:test'
import assert from 'node:assert/strict'
import {
  hasPublicNameConsent,
  isVisibleTo,
  filterForAudience,
} from '../src/lib/consultantVisibility.js'

const consented = {
  name: 'Dr. Pat Lee',
  isActive: true,
  publicNameConsentAt: '2026-07-01T00:00:00.000Z',
}

test('public surfaces require explicit name consent', () => {
  assert.equal(hasPublicNameConsent({ name: 'No consent' }), false)
  assert.equal(isVisibleTo({ name: 'No consent', isActive: true }, 'profile'), false)
  assert.equal(isVisibleTo(consented, 'profile'), true)
  assert.equal(isVisibleTo(consented, 'admin'), true)
})

test('inactive consultants respect audience-specific visibility', () => {
  const inactive = {
    ...consented,
    isActive: false,
    inactiveReason: 'page_only',
  }
  assert.equal(isVisibleTo(inactive, 'directory'), false)
  assert.equal(isVisibleTo(inactive, 'profile'), true)
  assert.equal(isVisibleTo({ ...inactive, inactiveReason: 'hard_off' }, 'profile'), false)
})

test('filterForAudience drops rows without consent', () => {
  const rows = filterForAudience(
    [{ name: 'Hidden' }, consented, { ...consented, name: 'Inactive', isActive: false }],
    'directory',
  )
  assert.deepEqual(rows.map((r) => r.name), ['Dr. Pat Lee'])
})

test('private profile visibility hides member from public surfaces', () => {
  const privateMember = {
    ...consented,
    profileVisibility: 'private',
  }
  assert.equal(isVisibleTo(privateMember, 'directory'), false)
  assert.equal(isVisibleTo(privateMember, 'admin'), true)
})
