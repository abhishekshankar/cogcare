import test from 'node:test'
import assert from 'node:assert/strict'
import { memberWorkspaceSectionNav } from '../lib/networkMemberWorkspace.js'

test('memberWorkspaceSectionNav includes core sections', () => {
  const sections = memberWorkspaceSectionNav({ hasVentures: false })
  assert.deepEqual(
    sections.map((s) => s.id),
    ['overview', 'briefings', 'profile', 'opportunities', 'activity', 'feedback'],
  )
})

test('memberWorkspaceSectionNav adds ventures only when associations exist', () => {
  const withVentures = memberWorkspaceSectionNav({ hasVentures: true })
  assert.equal(withVentures.some((s) => s.id === 'ventures'), true)
  const without = memberWorkspaceSectionNav({ hasVentures: false })
  assert.equal(without.some((s) => s.id === 'ventures'), false)
})

test('memberWorkspaceSectionNav labels matched opportunities distinctly', () => {
  const sections = memberWorkspaceSectionNav()
  const opportunities = sections.find((s) => s.id === 'opportunities')
  assert.equal(opportunities?.label, 'Matched opportunities')
})
