import { fetchAuthSession } from 'aws-amplify/auth'
import amplifyOutputs from '../amplify_outputs.json' with { type: 'json' }

export function getNetworkApiUrl(kind) {
  const envName = kind === 'admin' ? 'VITE_NETWORK_ADMIN_API_URL' : 'VITE_NETWORK_MEMBER_API_URL'
  const outputName = kind === 'admin' ? 'networkAdminApiFunctionUrl' : 'networkMemberApiFunctionUrl'
  const fromEnv = typeof import.meta !== 'undefined' ? import.meta.env?.[envName] : ''
  if (typeof fromEnv === 'string' && fromEnv.trim().startsWith('http')) return fromEnv.trim()
  // This module is a browser adapter. Node unit tests and SSR must not call a live
  // member endpoint merely because a generated production output is checked in.
  if (typeof window === 'undefined') return ''
  const generated = amplifyOutputs?.custom?.[outputName]
  return typeof generated === 'string' && generated.trim().startsWith('http') ? generated.trim() : ''
}

export async function callNetworkApi(kind, payload) {
  const url = getNetworkApiUrl(kind)
  if (!url) throw new Error(`Network ${kind} service is not configured.`)
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()
  if (!token) throw new Error('Please sign in again.')
  const response = await fetch(url, { method: 'POST', headers: {
    'content-type': 'application/json', authorization: `Bearer ${token}`,
  }, body: JSON.stringify(payload) })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : `Network service failed (${response.status}).`)
  return body
}
