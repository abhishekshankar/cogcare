import test from 'node:test'
import assert from 'node:assert/strict'
import { computeNetworkIntelligence, NETWORK_COHORT_TARGETS } from '../lib/networkIntelligence.js'

test('computeNetworkIntelligence returns aggregate non-PHI metrics', () => {
  const intel = computeNetworkIntelligence({
    invitations: [
      { status: 'pending', brandsJson: '["cogcare"]' },
      { status: 'accepted', brandsJson: '["cogcare","cogtraining"]' },
      { status: 'revoked', brandsJson: '["nso"]' },
    ],
    consultants: [
      {
        networkCohort: 'founding',
        participationMode: 'passive',
        profileVisibility: 'private',
        ventureAssociationsJson: '["cogcare"]',
        communicationPreference: 'none',
      },
      {
        networkCohort: 'founding',
        participationMode: 'active',
        profileVisibility: 'public',
        publicNameConsentAt: '2026-07-01T00:00:00.000Z',
        ventureAssociationsJson: '["cogcare","cogtraining"]',
        communicationPreference: 'email',
      },
    ],
  })

  assert.equal(intel.summary.memberCount, 2)
  assert.equal(intel.summary.pendingInvites, 1)
  assert.equal(intel.summary.acceptedInvites, 1)
  assert.equal(intel.cohortProgress.length, NETWORK_COHORT_TARGETS.length)
  assert.equal(intel.consentCoverage.publicNameConsent, 1)
  assert.equal(intel.participationModes.passive, 1)
  assert.equal(intel.participationModes.active, 1)
  assert.ok(intel.engagementHealth.score >= 0)
  assert.ok(!('email' in intel.summary))
})
