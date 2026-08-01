import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import type { Schema } from '../../data/resource'
import { memberProfilePatchFromValidated, validateNetworkMemberProfile } from '../../../lib/networkMemberProfile.js'
import { findMemberConsultantByEmail } from '../../../src/lib/networkMemberLookup.js'

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

const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
const reply = (statusCode: number, body: object) => ({ statusCode, headers, body: JSON.stringify(body) })

async function verifySessionEmail(event: { headers?: Record<string, string | undefined> }) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!bearer) return { ok: false as const, status: 401, error: 'Sign in required.' }

  try {
    const claims = await verifier.verify(bearer)
    const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : ''
    if (!email) {
      return { ok: false as const, status: 401, error: 'Could not read your signed-in email.' }
    }
    return { ok: true as const, email }
  } catch {
    return { ok: false as const, status: 401, error: 'Your sign-in session is invalid or expired.' }
  }
}

async function fetchMemberConsultantForEmail(email: string) {
  const client = await getDataClient()
  const rows =
    (
      await client.models.Consultant.list({
        filter: { contactEmail: { eq: email } },
        limit: 5,
      })
    ).data ?? []
  return findMemberConsultantByEmail(rows, email)
}

export const handler: Handler = async (event) => {
  const method = event.requestContext?.http?.method
  if (method === 'OPTIONS') return { statusCode: 204, headers, body: '' }

  const session = await verifySessionEmail(event)
  if (!session.ok) return reply(session.status, { error: session.error })

  if (method === 'GET') {
    const consultant = await fetchMemberConsultantForEmail(session.email)
    if (!consultant) return reply(404, { error: 'No membership record found.' })
    return reply(200, { ok: true, consultant })
  }

  if (method !== 'POST') return reply(405, { error: 'Method not allowed.' })

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
  if (
    !existing ||
    existing.contactEmail?.trim().toLowerCase() !== session.email ||
    !existing.networkCohort
  ) {
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
