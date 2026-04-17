import { defineFunction, secret } from '@aws-amplify/backend'

export const completeAssessment = defineFunction({
  name: 'complete-assessment',
  entry: './handler.ts',
  timeoutSeconds: 60,
  memoryMB: 512,
  environment: {
    BREVO_API_KEY: secret('BREVO_API_KEY'),
    BREVO_SENDER_EMAIL: secret('BREVO_SENDER_EMAIL'),
    BREVO_SENDER_NAME: 'CogCare',
  },
})
