import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canTransitionContentStatus,
  canTransitionAttributionStatus,
  validateAttributionDecision,
  validateOpportunityResponseKind,
} from '../lib/networkStateMachines.js'

test('content status: draft can move to published', () => {
  assert.equal(canTransitionContentStatus('draft', 'published'), true)
})

test('content status: draft can move to archived', () => {
  assert.equal(canTransitionContentStatus('draft', 'archived'), true)
})

test('content status: published can move to archived', () => {
  assert.equal(canTransitionContentStatus('published', 'archived'), true)
})

test('content status: archived is terminal', () => {
  assert.equal(canTransitionContentStatus('archived', 'draft'), false)
  assert.equal(canTransitionContentStatus('archived', 'published'), false)
})

test('content status: published cannot revert to draft', () => {
  assert.equal(canTransitionContentStatus('published', 'draft'), false)
})

test('content status: same-status transition is invalid', () => {
  assert.equal(canTransitionContentStatus('draft', 'draft'), false)
})

test('attribution: pending can move to approved or declined', () => {
  assert.equal(canTransitionAttributionStatus('pending', 'approved'), true)
  assert.equal(canTransitionAttributionStatus('pending', 'declined'), true)
})

test('attribution: approved and declined are terminal', () => {
  assert.equal(canTransitionAttributionStatus('approved', 'declined'), false)
  assert.equal(canTransitionAttributionStatus('declined', 'approved'), false)
})

test('validateAttributionDecision accepts approved/declined only', () => {
  assert.equal(validateAttributionDecision('approved').ok, true)
  assert.equal(validateAttributionDecision('declined').ok, true)
  assert.equal(validateAttributionDecision('pending').ok, false)
  assert.equal(validateAttributionDecision('').ok, false)
})

test('validateOpportunityResponseKind accepts interested/declined/withdrawn only', () => {
  assert.equal(validateOpportunityResponseKind('interested').ok, true)
  assert.equal(validateOpportunityResponseKind('declined').ok, true)
  assert.equal(validateOpportunityResponseKind('withdrawn').ok, true)
  assert.equal(validateOpportunityResponseKind('interest').ok, false)
  assert.equal(validateOpportunityResponseKind('').ok, false)
})
