import test from 'node:test'
import assert from 'node:assert/strict'
import {
  NETWORK_PUBLIC_ROUTES,
  consultantProfileRoute,
  networkInviteRoute,
} from '../lib/networkRoutes.js'
import { resolveNetworkInviteToken } from '../src/lib/networkInvitationTokens.js'

test('network public routes match App.jsx paths', () => {
  assert.equal(NETWORK_PUBLIC_ROUTES.founding, '/network')
  assert.equal(NETWORK_PUBLIC_ROUTES.invite, '/network/invite')
  assert.equal(NETWORK_PUBLIC_ROUTES.dashboardNetwork, '/network/admin')
  assert.equal(NETWORK_PUBLIC_ROUTES.dashboardMemberPortal, '/network/member')
  assert.equal(consultantProfileRoute('dr-alex'), '/dr/dr-alex')
  assert.equal(consultantProfileRoute('a/b'), '/dr/a%2Fb')
})

test('networkInviteRoute encodes token in path entry', () => {
  assert.equal(networkInviteRoute(''), '/network/invite')
  assert.equal(networkInviteRoute('abc+def'), '/network/invite/abc%2Bdef')
})

test('resolveNetworkInviteToken returns empty for missing invite token', () => {
  assert.equal(resolveNetworkInviteToken({}), '')
  assert.equal(resolveNetworkInviteToken({ routeToken: null, queryToken: null }), '')
  assert.equal(resolveNetworkInviteToken({ routeToken: '   ', queryToken: 'also-blank' }), '')
})

test('resolveNetworkInviteToken reads query token when route param absent', () => {
  assert.equal(resolveNetworkInviteToken({ queryToken: 'from-query' }), 'from-query')
})
