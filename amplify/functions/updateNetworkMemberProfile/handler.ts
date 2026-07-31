import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import type { Schema } from '../../data/resource'
import { memberProfilePatchFromValidated, validateNetworkMemberProfile } from '../../../lib/networkMemberProfile.js'

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.USER_POOL_CLIENT_ID!,
})

let dataClient: ReturnType<typeof generateClient<Schema>> | null = null
async function getDataClient() {
  if (dataClient) return dataClient
  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    process.env as Parameters<typeof getAmplifyDataClientConfig>[0],
  )
  Amplify.configure(resourceConfig, libraryOptions)
  dataClient = generateClient<Schema>()
  return dataClient
}

const headers = { 'Content-Type': 'application/json' }
const reply = (statusCode: number, body: object) => ({ statusCode, headers, body: JSON.stringify(body) })

export const handler: Handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (event.requestContext?.http?.method !== 'POST') return reply(405, { error: 'Method not allowed.' })

  const authHeader = event.headers?.authorization || event.headers?.Authorization || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  let claims: Record<string, unknown>
  try {
    claims = await verifier.verify(bearer)
  } catch {
    return reply(401, { error: 'Your sign-in session is invalid or expired.' })
  }
  const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : ''
  if (!email) return reply(401, { error: 'Could not read your signed-in email.' })

  let body: { consultantId?: string; form?: Record<string, unknown> }
  try {
    body = event.body ? JSON.parse(event.body) : {}
  } catch {
    return reply(400, { error: 'Invalid JSON body.' })
  }
  const consultantId = typeof body.consultantId === 'string' ? body.consultantId.trim() : ''
  const validation = validateNetworkMemberProfile(body.form || {})
  if (!consultantId || !validation.ok) {
    return reply(400, { error: validation.ok ? 'consultantId is required.' : validation.error })
  }

  const client = await getDataClient()
  const existing = (await client.models.Consultant.get({ id: consultantId })).data
  if (!existing || existing.contactEmail?.trim().toLowerCase() !== email || !existing.networkCohort) {
    return reply(403, { error: 'Could not verify your membership record.' })
  }

  const updated = await client.models.Consultant.update({
    id: consultantId,
    ...memberProfilePatchFromValidated(validation.value),
  })
  if (!updated.data || updated.errors?.length) {
    return reply(500, { error: 'Could not save your profile.' })
  }
  return reply(200, { ok: true, consultant: updated.data })
}
