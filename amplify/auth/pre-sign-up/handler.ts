import type { PreSignUpTriggerHandler } from 'aws-lambda'

/** Auto-confirm email sign-ups from the public /login sign-up form (not used by AdminCreateUser). */
export const handler: PreSignUpTriggerHandler = async (event) => {
  event.response.autoConfirmUser = true
  if (event.request.userAttributes?.email) {
    event.response.autoVerifyEmail = true
  }
  return event
}
