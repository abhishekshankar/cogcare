import type { CreateAuthChallengeTriggerHandler } from 'aws-lambda'

/** Magic-link token is validated in verifyAuthChallengeResponse against MagicLinkToken. */
export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
    event.response.challengeMetadata = 'MAGIC_LINK'
    event.response.publicChallengeParameters = { flow: 'magic_link' }
    event.response.privateChallengeParameters = {}
  }
  return event
}
