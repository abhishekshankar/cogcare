import { defineAuth } from '@aws-amplify/backend'

/**
 * Email-as-username; temporary passwords set by admin Lambda (completeAssessment).
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
})
