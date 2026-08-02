import { getMergedAmplifyOutputs } from './amplifyOutputs.js'
import { getDataClient } from './dataClient.js'

export async function requestNetworkInvite(input) {
  const url = getMergedAmplifyOutputs()?.custom?.networkPublicDataFunctionUrl
  if (typeof url !== 'string' || !url.startsWith('http')) throw new Error('Invite requests are temporarily unavailable.')
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body?.error || 'Could not join the waitlist.')
  return body
}

export async function listNetworkWaitlistRequests() {
  const { data, errors } = await getDataClient().models.NetworkWaitlistRequest.list({ limit: 500 })
  if (errors?.length) throw new Error(errors.map((error) => error.message).join('; '))
  return data ?? []
}
