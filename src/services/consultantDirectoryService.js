import { getMergedAmplifyOutputs } from '../lib/amplifyOutputs.js'
import { getDataClient } from '../lib/dataClient.js'
import { filterForAudience } from '../lib/consultantVisibility.js'

export async function fetchConsultantDirectory() {
  const url = getMergedAmplifyOutputs()?.custom?.networkPublicDataFunctionUrl
  if (typeof url === 'string' && url.startsWith('http')) {
    const response = await fetch(`${url}?directory=1`)
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body?.error || 'Could not load the consultant directory.')
    return Array.isArray(body.consultants) ? body.consultants : []
  }

  if (import.meta.env.DEV) {
    const { data } = await getDataClient().models.Consultant.list({ limit: 200 })
    return filterForAudience(data ?? [], 'directory')
  }

  throw new Error('Consultant directory is temporarily unavailable.')
}
