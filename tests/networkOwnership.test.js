import test from 'node:test'
import assert from 'node:assert/strict'
import { isOwnedByMember } from '../lib/networkOwnership.js'

test('isOwnedByMember true when record.memberId matches', () => {
  assert.equal(isOwnedByMember({ memberId: 'c1' }, 'c1'), true)
})

test('isOwnedByMember false when memberId differs', () => {
  assert.equal(isOwnedByMember({ memberId: 'c1' }, 'c2'), false)
})

test('isOwnedByConsultant false when record is missing', () => {
  assert.equal(isOwnedByMember(null, 'c1'), false)
})

test('isOwnedByConsultant false when consultantId is empty', () => {
  assert.equal(isOwnedByMember({ memberId: 'c1' }, ''), false)
})
