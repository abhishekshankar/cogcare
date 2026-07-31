import { defineFunction } from '@aws-amplify/backend'

export const getNetworkPublicData = defineFunction({
  name: 'get-network-public-data',
  entry: './handler.ts',
  timeoutSeconds: 15,
  memoryMB: 256,
  bundling: { minify: false },
})
