import test from 'node:test'
import assert from 'node:assert/strict'
import {
  findMemberConsultantByEmail,
  isNetworkMemberConsultant,
  normalizeMemberEmail,
} from '../src/lib/networkMemberLookup.js'

test('normalizeMemberEmail lowercases and trims', () => {
  assert.equal(normalizeMemberEmail('  Founder@Example.COM '), 'founder@example.com')
})

test('isNetworkMemberConsultant requires network cohort', () => {
  assert.equal(isNetworkMemberConsultant({ networkCohort: 'founding' }), true)
  assert.equal(isNetworkMemberConsultant({ name: 'Dr. A' }), false)
})

test('findMemberConsultantByEmail returns only the signed-in member row', () => {
  const rows = [
    { id: '1', contactEmail: 'founder@example.com', networkCohort: 'founding', profileVisibility: 'private' },
    { id: '2', contactEmail: 'other@example.com', networkCohort: 'founding', profileVisibility: 'public' },
    { id: '3', contactEmail: 'founder@example.com', networkCohort: '', profileVisibility: 'public' },
  ]
  const match = findMemberConsultantByEmail(rows, 'founder@example.com')
  assert.equal(match?.id, '1')
  assert.equal(findMemberConsultantByEmail(rows, 'other@example.com')?.id, '2')
  assert.equal(findMemberConsultantByEmail(rows, 'missing@example.com'), null)
})
