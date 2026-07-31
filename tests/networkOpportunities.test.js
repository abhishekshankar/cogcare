import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isKnownOpportunity,
  validateOpportunityResponse,
  NETWORK_OPPORTUNITIES,
} from '../lib/networkOpportunities.js'

test('opportunity responses accept interest or declined only', () => {
  assert.equal(validateOpportunityResponse('interest').ok, true)
  assert.equal(validateOpportunityResponse('declined').ok, true)
  assert.equal(validateOpportunityResponse('maybe').ok, false)
})

test('known opportunities are clearly scoped', () => {
  assert.ok(NETWORK_OPPORTUNITIES.length >= 1)
  for (const opp of NETWORK_OPPORTUNITIES) {
    assert.ok(isKnownOpportunity(opp.id))
    assert.ok(opp.scope)
    assert.doesNotMatch(opp.scope, /diagnos/i)
    assert.doesNotMatch(opp.scope, /PHI/i)
  }
})
