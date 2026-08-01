import { defineFunction } from '@aws-amplify/backend'

export const networkAdminApi = defineFunction({
  name: 'network-admin-api',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  bundling: { minify: false },
})
