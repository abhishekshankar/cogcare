import test from 'node:test'
import assert from 'node:assert/strict'
import { generateWaitlistCode, normalizeWaitlistEmail, validateWaitlistRequest } from '../lib/networkWaitlist.js'

test('waitlist requests normalize email and return a non-sequential reference code', () => {
  assert.equal(normalizeWaitlistEmail(' Doctor@Example.COM '), 'doctor@example.com')
  assert.match(generateWaitlistCode(Uint8Array.from([0, 1, 2, 3, 4, 5])), /^CN-[23456789A-HJ-NP-Z]{6}$/)
  assert.equal(validateWaitlistRequest({ name: 'Dr Pat Kim', email: 'PAT@example.com', roleCategory: 'Physician', interest: 'I work on practical cognitive-care access and education.', consent: true }).email, 'pat@example.com')
})

test('waitlist validation rejects missing consent and unsafe profile URLs', () => {
  assert.throws(() => validateWaitlistRequest({ name: 'Pat Kim', email: 'pat@example.com', roleCategory: 'Physician', interest: 'I work on practical cognitive-care access and education.', consent: false }), /confirm/)
  assert.throws(() => validateWaitlistRequest({ name: 'Pat Kim', email: 'pat@example.com', roleCategory: 'Physician', professionalUrl: 'javascript:alert(1)', interest: 'I work on practical cognitive-care access and education.', consent: true }), /http/)
})
