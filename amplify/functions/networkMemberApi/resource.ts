import { defineFunction } from '@aws-amplify/backend'

export const networkMemberApi = defineFunction({
  name: 'network-member-api',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  bundling: { minify: false },
})
