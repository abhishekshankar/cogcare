/**
 * @typedef {'onboarding_success' | 'member_portal'} NetworkFeedbackContext
 */

/**
 * @typedef {Object} NetworkFeedbackSubmission
 * @property {string} message
 * @property {NetworkFeedbackContext} [context]
 * @property {string} [memberEmail]
 * @property {string} [slug]
 */

/**
 * @typedef {Object} NetworkFeedbackSubmitSuccess
 * @property {true} ok
 * @property {'local' | 'mailto'} channel
 * @property {NetworkFeedbackSubmission} value
 * @property {string} [id]
 */

/**
 * @typedef {Object} NetworkFeedbackSubmitFailure
 * @property {false} ok
 * @property {string} error
 */

/** @typedef {NetworkFeedbackSubmitSuccess | NetworkFeedbackSubmitFailure} NetworkFeedbackSubmitResult */

export const NETWORK_FEEDBACK_CONTEXT_ONBOARDING = 'onboarding_success'
export const NETWORK_FEEDBACK_CONTEXT_MEMBER_PORTAL = 'member_portal'
