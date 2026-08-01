import test from 'node:test'
import assert from 'node:assert/strict'
import {
  NETWORK_CORE_PROMISE,
  NETWORK_HERO_SUPPORT,
  NETWORK_ETHICAL_SCARCITY,
  NETWORK_PASSIVE_PRIVATE,
  NETWORK_PRIVACY_DEFAULT,
  NETWORK_PRIMARY_ACTION,
  NETWORK_SECONDARY_ACTION,
  NETWORK_INTRO_TITLE,
  NETWORK_IS,
  NETWORK_IS_NOT,
  NETWORK_PARTICIPATION_POINTS,
} from '../lib/networkIntro.js'

test('network intro covers invitation, passive participation, flexibility, and consent', () => {
  assert.equal(NETWORK_CORE_PROMISE, 'A trusted circle advancing better cognitive care.')
  assert.match(NETWORK_HERO_SUPPORT, /invitation-only, no-fee network/i)
  assert.equal(NETWORK_PRIMARY_ACTION, 'Review your invitation.')
  assert.match(NETWORK_ETHICAL_SCARCITY, /considered welcome/i)
  assert.match(NETWORK_ETHICAL_SCARCITY, /never a countdown/i)
  assert.ok(NETWORK_IS_NOT.some((line) => /manufactured urgency/i.test(line)))
  assert.match(NETWORK_HERO_SUPPORT, /Cogcare cognition ecosystem/i)
  assert.match(NETWORK_INTRO_TITLE, /is — and is not/i)
  assert.ok(NETWORK_IS.some((line) => /personally invited/i.test(line)))
  assert.ok(NETWORK_IS.some((line) => /free/i.test(line)))
  assert.ok(NETWORK_IS_NOT.some((line) => /open enrollment/i.test(line)))
  assert.equal(NETWORK_SECONDARY_ACTION, 'Understand the Network.')
  assert.ok(NETWORK_IS_NOT.some((line) => /automatic publicity/i.test(line)))
  assert.match(NETWORK_PASSIVE_PRIVATE, /Passive private association/i)
  assert.match(NETWORK_PRIVACY_DEFAULT, /separate, recorded approval/i)
  assert.ok(NETWORK_PARTICIPATION_POINTS.some((p) => /considered welcome/i.test(p.title)))
  assert.ok(NETWORK_PARTICIPATION_POINTS.some((p) => /passive private/i.test(p.title)))
  assert.ok(NETWORK_PARTICIPATION_POINTS.some((p) => /change anytime/i.test(p.title)))
  assert.ok(NETWORK_PARTICIPATION_POINTS.some((p) => /approval/i.test(p.title)))
})
