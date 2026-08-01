import test from 'node:test'
import assert from 'node:assert/strict'
import { slugify, uniqueSlug } from '../lib/slugify.js'

test('slugify normalizes display names', () => {
  assert.equal(slugify('Dr. Alex Rivera, MD'), 'dr-alex-rivera-md')
  assert.equal(slugify('  '), '')
})

test('uniqueSlug avoids collisions', () => {
  const taken = new Set(['dr-alex-rivera-md'])
  assert.equal(uniqueSlug('Dr. Alex Rivera, MD', taken), 'dr-alex-rivera-md-2')
})
