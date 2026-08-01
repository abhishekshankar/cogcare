import test from 'node:test'
import assert from 'node:assert/strict'
import {
  VENTURE_REGISTRY,
  VENTURE_IDS,
  buildVentureDeepLink,
  buildCognitionNetworkHubUrl,
  isVentureId,
  ventureLabel,
} from '../lib/ventureRegistry.js'

test('venture registry lists all three ventures', () => {
  assert.equal(VENTURE_REGISTRY.length, 3)
  assert.deepEqual(VENTURE_IDS, ['cogcare', 'cogtraining', 'nso'])
})

test('buildVentureDeepLink adds returnTo without cross-domain state', () => {
  const url = buildVentureDeepLink({
    ventureId: 'cogtraining',
    path: '/cognition-network',
    returnTo: 'https://cogcare.org/network/member',
  })
  const parsed = new URL(url)
  assert.equal(parsed.origin, 'https://cogtraining.org')
  assert.equal(parsed.pathname, '/cognition-network')
  assert.equal(
    parsed.searchParams.get('returnTo'),
    'https://cogcare.org/network/member',
  )
})

test('hub URL points at CogCare network landing', () => {
  const url = buildCognitionNetworkHubUrl('/network/member')
  assert.match(url, /^https:\/\/cogcare\.org\/network/)
  assert.match(url, /returnTo=/)
})

test('unknown venture id is rejected', () => {
  assert.equal(isVentureId('unknown'), false)
  assert.equal(ventureLabel('unknown'), 'unknown')
  assert.equal(buildVentureDeepLink({ ventureId: 'unknown' }), '')
})
