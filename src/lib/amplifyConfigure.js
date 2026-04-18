import { Amplify } from 'aws-amplify'
import { getMergedAmplifyOutputs } from './amplifyOutputs.js'

let configured = false

/** Call once at startup. Skips when outputs have no Cognito client id (stub or missing backend). */
export function configureAmplify() {
  if (configured) return
  configured = true
  const outputs = getMergedAmplifyOutputs()
  const clientId = outputs?.auth?.user_pool_client_id
  if (clientId) {
    Amplify.configure(outputs)
  }
}

export function isAmplifyConfigured() {
  return Boolean(getMergedAmplifyOutputs()?.auth?.user_pool_client_id)
}
