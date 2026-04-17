declare module '$amplify/env/complete-assessment' {
  import type { DataClientEnv } from '@aws-amplify/backend-function/runtime'
  export const env: DataClientEnv & {
    USER_POOL_ID: string
    BREVO_API_KEY: string
    BREVO_SENDER_EMAIL: string
    BREVO_SENDER_NAME?: string
  }
}
