import { useState } from 'react'
import { Mail, MessageSquare } from 'lucide-react'
import {
  NETWORK_FEEDBACK_EMAIL,
  NETWORK_FEEDBACK_MAX,
  buildNetworkFeedbackMailto,
} from '../../../lib/networkFeedback.js'
import {
  NETWORK_FEEDBACK_CONTEXT_ONBOARDING,
  submitNetworkFeedback,
} from '../../services/networkFeedbackService.js'
import {
  networkBodySm,
  networkCaption,
  networkInput,
  networkLabel,
  networkPanel,
  networkPrimaryBtn,
  networkSectionTitle,
  networkSuccessPanel,
  networkTextLink,
} from './networkUi'

/**
 * @param {{ memberEmail?: string, slug?: string, feedbackContext?: import('../../../lib/networkFeedbackTypes.js').NetworkFeedbackContext }} props
 */
export default function NetworkOnboardingFeedback({
  memberEmail,
  slug,
  feedbackContext = NETWORK_FEEDBACK_CONTEXT_ONBOARDING,
}) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [savedChannel, setSavedChannel] = useState(null)

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    setSavedChannel(null)
    setSubmitting(true)
    try {
      const result = await submitNetworkFeedback({
        message,
        memberEmail,
        slug,
        context: feedbackContext,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }

      if (result.channel === 'local') {
        setSavedChannel('local')
        setMessage('')
        return
      }

      const href = buildNetworkFeedbackMailto({
        message: result.value.message,
        memberEmail,
        slug,
      })
      window.location.href = href
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  const directHref = buildNetworkFeedbackMailto({ memberEmail, slug })

  return (
    <section className={`${networkPanel} p-6 sm:p-8`} aria-labelledby="network-feedback-title">
      <div className="flex items-start gap-4">
        <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 id="network-feedback-title" className={networkSectionTitle}>
            Share feedback
          </h3>
          <p className={`mt-2 ${networkBodySm}`}>
            Tell us what worked, what was confusing, or what you&apos;d like next. No PHI, please.
          </p>
        </div>
      </div>

      {savedChannel === 'local' ? (
        <div
          className={`mt-6 ${networkSuccessPanel} px-4 py-3 ${networkBodySm}`}
          role="status"
          aria-live="polite"
        >
          Thanks — your feedback was saved for review.
        </div>
      ) : (
        <form onSubmit={handleSend} className="mt-6 space-y-4">
          {error ? (
            <p
              className="rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <label className="block" htmlFor="network-feedback-message">
            <span className={networkLabel}>Your note</span>
            <textarea
              id="network-feedback-message"
              name="message"
              rows={3}
              maxLength={NETWORK_FEEDBACK_MAX}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={networkInput}
              placeholder="e.g. onboarding clarity, consent wording, or what you’d like next."
              aria-describedby="network-feedback-hint"
              disabled={submitting}
            />
            <p id="network-feedback-hint" className={`mt-2 ${networkCaption}`}>
              {message.length}/{NETWORK_FEEDBACK_MAX} characters
            </p>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={submitting} aria-busy={submitting} className={networkPrimaryBtn}>
              <Mail className="h-4 w-4" aria-hidden />
              Send feedback
            </button>
            <a href={directHref} className={networkTextLink}>
              Or email {NETWORK_FEEDBACK_EMAIL}
            </a>
          </div>
        </form>
      )}
    </section>
  )
}
