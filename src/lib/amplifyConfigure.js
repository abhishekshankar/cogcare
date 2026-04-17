import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'

let configured = false

/** Call once at startup. Skips when sandbox outputs are not deployed (empty user pool client). */
export function configureAmplify() {
  if (configured) return
  configured = true
  const clientId = outputs?.auth?.user_pool_client_id
  if (clientId) {
    Amplify.configure(outputs)
  }
}

export function isAmplifyConfigured() {
  return Boolean(outputs?.auth?.user_pool_client_id)
}
