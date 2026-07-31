export const NETWORK_FEEDBACK_EMAIL = 'hello@cogcare.org'
export const NETWORK_FEEDBACK_MAX = 500

/**
 * @param {import('./networkFeedbackTypes.js').NetworkFeedbackSubmission} payload
 * @returns {{ ok: true, value: import('./networkFeedbackTypes.js').NetworkFeedbackSubmission } | { ok: false, error: string }}
 */
export function validateNetworkFeedbackPayload(payload) {
  const message = payload?.message?.trim() || ''
  if (!message) {
    return { ok: false, error: 'Please share a short note, or use the email link below.' }
  }
  if (message.length > NETWORK_FEEDBACK_MAX) {
    return { ok: false, error: `Feedback must be ${NETWORK_FEEDBACK_MAX} characters or fewer.` }
  }

  const memberEmail = payload?.memberEmail?.trim() || undefined
  const slug = payload?.slug?.trim() || undefined
  const context = payload?.context || undefined

  return {
    ok: true,
    value: {
      message,
      memberEmail,
      slug,
      context,
    },
  }
}

/**
 * @param {string} message
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
export function validateNetworkFeedback(message) {
  return validateNetworkFeedbackPayload({ message })
}

/**
 * @param {{
 *   message?: string
 *   memberEmail?: string
 *   slug?: string
 * }} params
 */
export function buildNetworkFeedbackMailto({ message = '', memberEmail, slug }) {
  const subject = encodeURIComponent('Cognition Network — onboarding feedback')
  const lines = [
    'Cognition Network founding onboarding feedback',
    '',
    memberEmail ? `From: ${memberEmail}` : null,
    slug ? `Profile: /dr/${slug}` : null,
    '',
    message.trim() || '(No message entered — please add your feedback below.)',
  ].filter((line) => line !== null)

  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:${NETWORK_FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
}
