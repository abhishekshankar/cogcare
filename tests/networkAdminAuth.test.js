import test from 'node:test'
import assert from 'node:assert/strict'
import { hasAdminGroup } from '../lib/networkAdminAuth.js'

test('hasAdminGroup true when cognito:groups includes admin', () => {
  assert.equal(hasAdminGroup({ 'cognito:groups': ['admin'] }), true)
})

test('hasAdminGroup false when admin group absent', () => {
  assert.equal(hasAdminGroup({ 'cognito:groups': ['member'] }), false)
})

test('hasAdminGroup false when claims missing groups', () => {
  assert.equal(hasAdminGroup({}), false)
})

test('hasAdminGroup false when groups is not an array', () => {
  assert.equal(hasAdminGroup({ 'cognito:groups': 'admin' }), false)
})

test('hasAdminGroup false for null/undefined claims', () => {
  assert.equal(hasAdminGroup(null), false)
  assert.equal(hasAdminGroup(undefined), false)
})
