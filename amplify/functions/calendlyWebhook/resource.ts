import { defineFunction } from '@aws-amplify/backend'

/** Set in Amplify Console (branch env) or `ampx sandbox --secret`. If empty, signature verification is skipped (dev only). */
export const calendlyWebhook = defineFunction({
  name: 'calendly-webhook',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  bundling: {
    minify: false,
  },
  environment: {
    CALENDLY_WEBHOOK_SIGNING_KEY: process.env.CALENDLY_WEBHOOK_SIGNING_KEY ?? '',
  },
})
