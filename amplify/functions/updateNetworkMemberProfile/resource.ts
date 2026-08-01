import { defineFunction } from '@aws-amplify/backend'

export const updateNetworkMemberProfile = defineFunction({
  name: 'update-network-member-profile',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  bundling: { minify: false },
})
