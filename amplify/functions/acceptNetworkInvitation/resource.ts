import { defineFunction } from '@aws-amplify/backend'

export const acceptNetworkInvitation = defineFunction({
  name: 'accept-network-invitation',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  bundling: {
    minify: false,
  },
})
