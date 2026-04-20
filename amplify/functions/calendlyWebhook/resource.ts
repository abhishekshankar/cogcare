import { defineFunction, secret } from '@aws-amplify/backend'

export const calendlyWebhook = defineFunction({
  name: 'calendly-webhook',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  bundling: {
    minify: false,
  },
  environment: {
    CALENDLY_WEBHOOK_SIGNING_KEY: secret('CALENDLY_WEBHOOK_SIGNING_KEY'),
  },
})
