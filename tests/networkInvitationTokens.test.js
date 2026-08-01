import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildNetworkInviteUrl,
  buildNetworkInvitePath,
  hashNetworkInviteToken,
  resolveNetworkInviteToken,
} from '../src/lib/networkInvitationTokens.js'

test('resolveNetworkInviteToken prefers route param over query', () => {
  assert.equal(
    resolveNetworkInviteToken({ routeToken: 'route-token', queryToken: 'query-token' }),
    'route-token',
  )
  assert.equal(resolveNetworkInviteToken({ queryToken: 'query-token' }), 'query-token')
  assert.equal(resolveNetworkInviteToken({}), '')
})

test('buildNetworkInvitePath and URL encode token for route entry', () => {
  assert.equal(buildNetworkInvitePath('abc+def/ghi'), '/network/invite/abc%2Bdef%2Fghi')
  assert.equal(
    buildNetworkInviteUrl('abc+def/ghi', 'https://cogcare.org'),
    'https://cogcare.org/network/invite/abc%2Bdef%2Fghi',
  )
})

test('hashNetworkInviteToken is stable sha256 hex', async () => {
  const hash = await hashNetworkInviteToken('test-token')
  assert.equal(hash.length, 64)
  assert.equal(hash, await hashNetworkInviteToken('test-token'))
})
