import { generateClient } from 'aws-amplify/data'

let client

/** Create the Amplify Data client only after the app has configured Amplify. */
export function getDataClient() {
  client ??= generateClient()
  return client
}
