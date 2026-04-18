import type { DefineAuthChallengeTriggerHandler } from 'aws-lambda'

/**
 * CUSTOM_WITHOUT_SRP magic-link flow: first step issues CUSTOM_CHALLENGE,
 * second step issues tokens after verifyAuthChallengeResponse succeeds.
 */
export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  if (event.request.session.length === 0) {
    event.response.issueTokens = false
    event.response.failAuthentication = false
    event.response.challengeName = 'CUSTOM_CHALLENGE'
  } else if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeName === 'CUSTOM_CHALLENGE' &&
    event.request.session[0].challengeResult === true
  ) {
    event.response.issueTokens = true
    event.response.failAuthentication = false
  } else {
    event.response.issueTokens = false
    event.response.failAuthentication = true
  }
  return event
}
