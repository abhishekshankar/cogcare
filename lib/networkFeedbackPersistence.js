import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateNetworkFeedbackPayload } from './networkFeedback.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_STORE_FILE = path.join(__dirname, '..', '.local', 'network-feedback.jsonl')

/**
 * @returns {string}
 */
export function resolveNetworkFeedbackStoreFile() {
  const override = globalThis.process?.env?.COGCARE_NETWORK_FEEDBACK_STORE_FILE
  if (typeof override === 'string' && override.trim()) {
    return path.resolve(override.trim())
  }
  return DEFAULT_STORE_FILE
}

/**
 * @param {import('./networkFeedbackTypes.js').NetworkFeedbackSubmission} payload
 * @param {string} [storeFile]
 * @returns {{ ok: true, record: object } | { ok: false, error: string, detail?: string }}
 */
export function appendNetworkFeedbackRecord(payload, storeFile = resolveNetworkFeedbackStoreFile()) {
  const validation = validateNetworkFeedbackPayload(payload)
  if (!validation.ok) {
    return validation
  }

  const record = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    channel: 'local',
    ...validation.value,
  }

  try {
    fs.mkdirSync(path.dirname(storeFile), { recursive: true })
    fs.appendFileSync(storeFile, `${JSON.stringify(record)}\n`, 'utf8')
  } catch (err) {
    return {
      ok: false,
      error: 'Could not save feedback locally.',
      detail: err instanceof Error ? err.message : String(err),
    }
  }

  return { ok: true, record }
}

/**
 * @param {string} storeFile
 * @param {string} id
 * @returns {object | null}
 */
export function readNetworkFeedbackRecordById(storeFile, id) {
  if (!fs.existsSync(storeFile)) return null
  const lines = fs.readFileSync(storeFile, 'utf8').trim().split('\n').filter(Boolean)
  for (const line of lines) {
    const record = JSON.parse(line)
    if (record.id === id) return record
  }
  return null
}
