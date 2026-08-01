import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanText, enumValue, safeJsonBody } from '../lib/networkApiValidation.js'
import { hasAdminGroup } from '../lib/networkAdminAuth.js'
import { isOwnedByMember } from '../lib/networkOwnership.js'
import {
  canTransitionAttributionStatus,
  canTransitionContentStatus,
  validateAttributionDecision,
  validateOpportunityResponseKind,
} from '../lib/networkStateMachines.js'
import { validateNetworkFeedbackPayload } from '../lib/networkFeedback.js'

test('UNIT-NET-SEC-05 safeJsonBody rejects arrays and malformed JSON', () => {
  assert.equal(safeJsonBody('{"operation":"workspace"}').ok, true)
  assert.equal(safeJsonBody('[]').ok, false)
  assert.equal(safeJsonBody('not-json').ok, false)
})

test('UNIT-NET-SEC-06 cleanText rejects PHI and overlong values', () => {
  assert.equal(cleanText('Patient name Jane Doe', { required: true }).ok, false)
  assert.equal(cleanText('a'.repeat(3001), { required: true, max: 3000 }).ok, false)
  assert.equal(cleanText('Accessibility review notes', { required: true }).ok, true)
})

test('UNIT-NET-SEC-02 hasAdminGroup requires admin Cognito group', () => {
  assert.equal(hasAdminGroup({ 'cognito:groups': ['admin'] }), true)
  assert.equal(hasAdminGroup({ 'cognito:groups': ['member'] }), false)
  assert.equal(hasAdminGroup({}), false)
})

test('UNIT-NET-SEC-03 isOwnedByMember scopes records to member id', () => {
  assert.equal(isOwnedByMember({ memberId: 'm1' }, 'm1'), true)
  assert.equal(isOwnedByMember({ memberId: 'm1' }, 'm2'), false)
})

test('UNIT-NET-SEC-04 attribution and introduction enums are strict', () => {
  assert.equal(validateAttributionDecision('approved').ok, true)
  assert.equal(validateAttributionDecision('pending').ok, false)
  assert.equal(validateOpportunityResponseKind('withdrawn').ok, true)
  assert.equal(validateOpportunityResponseKind('accepted').ok, false)
  assert.equal(enumValue('bogus', ['attending', 'declined'], 'Response').ok, false)
})

test('UNIT-NET-SEC-05 content status transitions follow institutional lifecycle', () => {
  assert.equal(canTransitionContentStatus('draft', 'published'), true)
  assert.equal(canTransitionContentStatus('archived', 'published'), false)
  assert.equal(canTransitionAttributionStatus('pending', 'approved'), true)
  assert.equal(canTransitionAttributionStatus('approved', 'declined'), false)
})

test('UNIT-NET-SEC-06 feedback validation enforces length and required message', () => {
  assert.equal(validateNetworkFeedbackPayload({ message: '' }).ok, false)
  assert.equal(validateNetworkFeedbackPayload({ message: 'x'.repeat(501) }).ok, false)
  assert.equal(validateNetworkFeedbackPayload({ message: 'Clear onboarding copy.' }).ok, true)
})
