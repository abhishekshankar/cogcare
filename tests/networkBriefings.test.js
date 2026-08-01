import test from 'node:test'
import assert from 'node:assert/strict'
import { sortBriefingsNewestFirst, NETWORK_BRIEFINGS } from '../lib/networkBriefings.js'

test('briefings are non-clinical and sorted newest first', () => {
  const sorted = sortBriefingsNewestFirst()
  assert.equal(sorted.length, NETWORK_BRIEFINGS.length)
  assert.ok(
    String(sorted[0].publishedAt).localeCompare(String(sorted[sorted.length - 1].publishedAt)) >= 0,
  )
  for (const briefing of sorted) {
    assert.ok(briefing.title)
    assert.ok(briefing.summary)
    assert.doesNotMatch(briefing.summary, /diagnos/i)
    assert.doesNotMatch(briefing.summary, /PHI/i)
  }
})
