import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('networkMemberService production read uses membership endpoint GET', () => {
  const src = readFileSync(new URL('../src/services/networkMemberService.js', import.meta.url), 'utf8')
  assert.match(src, /fetchMemberConsultantViaMembershipEndpoint/)
  assert.match(src, /authorization:\s*`Bearer \$\{idToken\}`/)
  assert.doesNotMatch(src, /models\.Consultant/)
})

test('updateNetworkMemberProfile handler supports GET membership read', () => {
  const src = readFileSync(
    new URL('../amplify/functions/updateNetworkMemberProfile/handler.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /method === 'GET'/)
  assert.match(src, /filter:\s*\{\s*contactEmail/)
  assert.match(src, /findMemberConsultantByEmail/)
})
