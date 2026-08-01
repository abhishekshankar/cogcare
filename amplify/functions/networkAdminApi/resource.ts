import { defineFunction, secret } from '@aws-amplify/backend'

export const networkAdminApi = defineFunction({
  name: 'network-admin-api',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  environment: {
    BREVO_API_KEY: secret('BREVO_API_KEY'),
    BREVO_SENDER_EMAIL: secret('BREVO_SENDER_EMAIL'),
    BREVO_SENDER_NAME: 'CogCare Cognition Network',
  },
  bundling: { minify: false },
})
