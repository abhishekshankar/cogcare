import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  emptyNetworkOnboardingForm,
  validateNetworkOnboarding,
} from '../lib/networkOnboarding.js'
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

const base = () => ({
  ...emptyNetworkOnboardingForm(),
  name: 'Dr. Pat Kim',
  title: 'Neurologist',
  organization: 'CogCare',
  participationMode: 'passive',
  ventureAssociations: ['cogcare'],
  privateJoinConsent: true,
  publicProfileConsent: false,
  profileVisibility: 'private',
  nameBioConsent: false,
  communicationsConsent: false,
  communicationPreference: 'founding_updates',
  disclosureAcknowledged: true,
})

test('validateNetworkOnboarding returns successful private submission payload', () => {
  const result = validateNetworkOnboarding(base())
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.name, 'Dr. Pat Kim')
    assert.equal(result.value.profileVisibility, 'private')
    assert.equal(result.value.privateJoinConsent, true)
    assert.equal(result.value.communicationPreference, 'none')
    assert.equal(result.value.disclosureAcknowledged, true)
  }
})

test('validateNetworkOnboarding returns successful public submission when consents align', () => {
  const result = validateNetworkOnboarding({
    ...base(),
    publicProfileConsent: true,
    profileVisibility: 'public',
    nameBioConsent: true,
  })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.value.profileVisibility, 'public')
    assert.equal(result.value.nameBioConsent, true)
    assert.equal(result.value.publicProfileConsent, true)
  }
})

test('submitNetworkFeedback succeeds via mailto channel outside dev server', async () => {
  const result = await submitNetworkFeedback({
    message: 'Onboarding flow was clear.',
    memberEmail: 'founder@example.com',
    slug: 'dr-pat-kim',
    context: 'onboarding_success',
  })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.channel, 'mailto')
    assert.equal(result.value.message, 'Onboarding flow was clear.')
  }
})

test('submit-network-feedback handler records successful local submission', async () => {
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
          message: 'Success path works.',
          memberEmail: 'founder@example.com',
          context: 'onboarding_success',
        },
      },
      res,
    )

    assert.equal(responses[0]?.code, 201)
    assert.equal(responses[0]?.data?.ok, true)
    assert.equal(responses[0]?.data?.channel, 'local')

    const recordId = String(responses[0]?.data?.id || '')
    assert.match(recordId, /[0-9a-f-]{36}/)
    const record = readNetworkFeedbackRecordById(storeFile, recordId)
    assert.notEqual(record, null)
    assert.equal(record.message, 'Success path works.')
    assert.equal(record.memberEmail, 'founder@example.com')
    assert.equal(record.context, 'onboarding_success')
  } finally {
    if (previous === undefined) {
      delete process.env.COGCARE_NETWORK_FEEDBACK_STORE_FILE
    } else {
      process.env.COGCARE_NETWORK_FEEDBACK_STORE_FILE = previous
    }
    cleanup()
  }
})

test('appendNetworkFeedbackRecord isolates concurrent submissions by id', () => {
  const first = createTempStoreFile()
  const second = createTempStoreFile()
  try {
    const a = appendNetworkFeedbackRecord(
      { message: 'Success path works.', memberEmail: 'founder@example.com', context: 'onboarding_success' },
      first.storeFile,
    )
    const b = appendNetworkFeedbackRecord(
      { message: 'Saved locally.', memberEmail: 'member@example.com', context: 'onboarding_success' },
      second.storeFile,
    )
    assert.equal(a.ok, true)
    assert.equal(b.ok, true)
    if (!a.ok || !b.ok) return

    const recordA = readNetworkFeedbackRecordById(first.storeFile, a.record.id)
    const recordB = readNetworkFeedbackRecordById(second.storeFile, b.record.id)
    assert.equal(recordA?.message, 'Success path works.')
    assert.equal(recordB?.message, 'Saved locally.')
  } finally {
    first.cleanup()
    second.cleanup()
  }
})
