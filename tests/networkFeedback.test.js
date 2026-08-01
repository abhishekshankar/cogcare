import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  NETWORK_FEEDBACK_EMAIL,
  buildNetworkFeedbackMailto,
  validateNetworkFeedback,
  validateNetworkFeedbackPayload,
} from '../lib/networkFeedback.js'
import {
  appendNetworkFeedbackRecord,
  readNetworkFeedbackRecordById,
} from '../lib/networkFeedbackPersistence.js'
import { submitNetworkFeedback } from '../src/services/networkFeedbackService.js'
import handler from '../api/submit-network-feedback.js'

function createTempStoreFile() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cogcare-feedback-'))
  return {
    storeFile: path.join(tmpDir, 'network-feedback.jsonl'),
    cleanup() {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    },
  }
}

test('validateNetworkFeedback requires a message', () => {
  const result = validateNetworkFeedback('   ')
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /short note/i)
})

test('validateNetworkFeedbackPayload normalizes optional fields', () => {
  const result = validateNetworkFeedbackPayload({
    message: 'Clear consent copy.',
    memberEmail: ' member@example.com ',
    slug: ' dr-alex ',
    context: 'onboarding_success',
  })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.memberEmail, 'member@example.com')
    assert.equal(result.value.slug, 'dr-alex')
    assert.equal(result.value.context, 'onboarding_success')
  }
})

test('validateNetworkFeedback enforces max length', () => {
  const result = validateNetworkFeedback('x'.repeat(501))
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /500/)
})

test('buildNetworkFeedbackMailto targets network feedback email with context', () => {
  const href = buildNetworkFeedbackMailto({
    message: 'Clear consent copy.',
    memberEmail: 'member@example.com',
    slug: 'dr-alex',
  })
  assert.match(href, new RegExp(`^mailto:${NETWORK_FEEDBACK_EMAIL.replace('.', '\\.')}`))
  assert.match(href, /subject=/)
  assert.match(decodeURIComponent(href), /member@example.com/)
  assert.match(decodeURIComponent(href), /dr-alex/)
  assert.match(decodeURIComponent(href), /Clear consent copy/)
})

test('submitNetworkFeedback uses mailto channel outside dev server', async () => {
  const result = await submitNetworkFeedback({
    message: 'Helpful onboarding flow.',
    memberEmail: 'member@example.com',
    slug: 'dr-alex',
    context: 'onboarding_success',
  })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.channel, 'mailto')
    assert.equal(result.value.message, 'Helpful onboarding flow.')
  }
})

test('appendNetworkFeedbackRecord writes isolated store by submission id', () => {
  const { storeFile, cleanup } = createTempStoreFile()
  try {
    const result = appendNetworkFeedbackRecord(
      {
        message: 'Saved locally.',
        memberEmail: 'member@example.com',
        slug: 'dr-alex',
        context: 'onboarding_success',
      },
      storeFile,
    )
    assert.equal(result.ok, true)
    if (!result.ok) return

    const record = readNetworkFeedbackRecordById(storeFile, result.record.id)
    assert.notEqual(record, null)
    assert.equal(record.message, 'Saved locally.')
    assert.equal(record.memberEmail, 'member@example.com')
    assert.equal(record.slug, 'dr-alex')
    assert.equal(record.context, 'onboarding_success')
  } finally {
    cleanup()
  }
})

test('submit-network-feedback dev handler appends jsonl record', async () => {
  const { storeFile, cleanup } = createTempStoreFile()
  const previous = process.env.COGCARE_NETWORK_FEEDBACK_STORE_FILE
  process.env.COGCARE_NETWORK_FEEDBACK_STORE_FILE = storeFile

  try {
    const responses = []
    const res = {
      status(code) {
        return {
          json(data) {
            responses.push({ code, data })
          },
        }
      },
    }

    await handler(
      {
        method: 'POST',
        body: {
          message: 'Saved locally.',
          memberEmail: 'member@example.com',
          slug: 'dr-alex',
          context: 'onboarding_success',
        },
      },
      res,
    )

    assert.equal(responses[0]?.code, 201)
    assert.equal(responses[0]?.data?.channel, 'local')
    const recordId = String(responses[0]?.data?.id || '')
    assert.match(recordId, /[0-9a-f-]{36}/)

    const record = readNetworkFeedbackRecordById(storeFile, recordId)
    assert.notEqual(record, null)
    assert.equal(record.message, 'Saved locally.')
    assert.equal(record.memberEmail, 'member@example.com')
  } finally {
    if (previous === undefined) {
      delete process.env.COGCARE_NETWORK_FEEDBACK_STORE_FILE
    } else {
      process.env.COGCARE_NETWORK_FEEDBACK_STORE_FILE = previous
    }
    cleanup()
  }
})
