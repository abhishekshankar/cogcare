import { defineAuth } from '@aws-amplify/backend'
import { createAuthChallenge } from './create-auth-challenge/resource'
import { defineAuthChallenge } from './define-auth-challenge/resource'
import { preSignUp } from './pre-sign-up/resource'
import { verifyAuthChallengeResponse } from './verify-auth-challenge-response/resource'

/**
 * Email-as-username. Quiz onboarding uses magic links (CUSTOM_WITHOUT_SRP + Lambda triggers).
 * Legacy temp-password users may still complete NEW_PASSWORD_REQUIRED on the dashboard.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    createAuthChallenge,
    defineAuthChallenge,
    preSignUp,
    verifyAuthChallengeResponse,
  },
})
