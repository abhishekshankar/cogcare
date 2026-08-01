import {
  NETWORK_FEEDBACK_CONTEXT_ONBOARDING,
} from '../../lib/networkFeedbackTypes.js'
import { validateNetworkFeedbackPayload } from '../../lib/networkFeedback.js'
import { callNetworkApi, getNetworkApiUrl } from './networkApiClient.js'

/**
 * Dev-only: POST to Vite middleware `/api/network-feedback`.
 *
 * @param {import('../../lib/networkFeedbackTypes.js').NetworkFeedbackSubmission} payload
 * @returns {Promise<import('../../lib/networkFeedbackTypes.js').NetworkFeedbackSubmitResult>}
 */
async function submitNetworkFeedbackDev(payload) {
  const res = await fetch('/api/network-feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      typeof body?.error === 'string'
        ? body.error
        : `Could not save feedback locally (${res.status}).`
    return { ok: false, error: msg }
  }

  return {
    ok: true,
    channel: 'local',
    value: payload,
    id: typeof body?.id === 'string' ? body.id : undefined,
  }
}

/**
 * Production adapter entry — no Amplify writer is wired in Phase 1.
 *
 * @param {import('../../lib/networkFeedbackTypes.js').NetworkFeedbackSubmission} payload
 * @returns {Promise<import('../../lib/networkFeedbackTypes.js').NetworkFeedbackSubmitResult>}
 */
async function submitNetworkFeedbackProduction(payload) {
  if (getNetworkApiUrl('member')) {
    try {
      const body = await callNetworkApi('member', { operation: 'submitFeedback', message: payload.message, category: payload.context })
      return { ok: true, channel: 'local', value: payload, id: body.feedback?.id }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Could not save feedback.' }
    }
  }

  return { ok: true, channel: 'mailto', value: payload }
}

/**
 * Typed adapter boundary for Cognition Network feedback submissions.
 *
 * @param {import('../../lib/networkFeedbackTypes.js').NetworkFeedbackSubmission} input
 * @returns {Promise<import('../../lib/networkFeedbackTypes.js').NetworkFeedbackSubmitResult>}
 */
export async function submitNetworkFeedback(input) {
  const validation = validateNetworkFeedbackPayload(input)
  if (!validation.ok) {
    return validation
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return submitNetworkFeedbackDev(validation.value)
  }

  return submitNetworkFeedbackProduction(validation.value)
}

export { NETWORK_FEEDBACK_CONTEXT_ONBOARDING }
