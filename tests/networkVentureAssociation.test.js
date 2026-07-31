import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canPublishVentureAssociations,
  filterOpportunitiesForVentures,
  memberVentureCards,
  publicVentureAssociationsForConsultant,
  validateVentureAssociations,
} from '../lib/networkVentureAssociation.js'
import { NETWORK_OPPORTUNITIES } from '../lib/networkOpportunities.js'

test('public venture associations require explicit name consent', () => {
  const privateMember = {
    ventureAssociationsJson: '["cogcare","cogtraining"]',
    profileVisibility: 'private',
    publicNameConsentAt: null,
  }
  assert.deepEqual(publicVentureAssociationsForConsultant(privateMember), [])

  const publicMember = {
    ventureAssociationsJson: '["cogcare","nso"]',
    profileVisibility: 'public',
    publicNameConsentAt: '2026-07-01T00:00:00.000Z',
    isActive: true,
  }
  assert.equal(canPublishVentureAssociations(publicMember), true)
  const published = publicVentureAssociationsForConsultant(publicMember)
  assert.equal(published.length, 2)
  assert.equal(published[0].label, 'CogCare')
})

test('member venture cards include portable deep links with returnTo', () => {
  const cards = memberVentureCards(['cogtraining'], {
    memberPortalReturnTo: '/dashboard/cognition-network',
  })
  assert.equal(cards.length, 1)
  const url = new URL(cards[0].entryUrl)
  assert.equal(url.origin, 'https://cogtraining.org')
  assert.equal(url.searchParams.get('returnTo'), '/dashboard/cognition-network')
})

test('opportunities filter to member venture associations', () => {
  const scoped = filterOpportunitiesForVentures(NETWORK_OPPORTUNITIES, ['cogcare'])
  assert.ok(scoped.every((o) => o.brand === 'cogcare'))
  assert.ok(scoped.length >= 1)

  const cross = filterOpportunitiesForVentures(NETWORK_OPPORTUNITIES, [
    'cogcare',
    'cogtraining',
    'nso',
  ])
  assert.equal(cross.length, NETWORK_OPPORTUNITIES.length)
})

test('validateVentureAssociations rejects empty and unknown ids', () => {
  assert.equal(validateVentureAssociations([]).ok, false)
  assert.equal(validateVentureAssociations(['cogcare', 'fake']).ok, false)
  const ok = validateVentureAssociations(['cogcare', 'nso'])
  assert.equal(ok.ok, true)
  if (ok.ok) assert.deepEqual(ok.value, ['cogcare', 'nso'])
})
