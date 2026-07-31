import {
  generateNetworkInviteToken,
  hashNetworkInviteToken,
  buildNetworkInviteUrl,
} from './networkInvitationTokens.js'
import { fetchNetworkInvitationByToken } from './networkInvitationPublic.js'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getMergedAmplifyOutputs } from './amplifyOutputs.js'
import { getDataClient } from './dataClient.js'

export { fetchNetworkInvitationByToken }

/**
 * @param {{
 *   email: string
 *   inviteeName?: string
 *   cohort?: string
 *   roleCategory?: string
 *   brands?: string[]
 *   personalNote?: string
 *   invitedByEmail?: string
 *   expiresInDays?: number
 * }} input
 */
export async function createNetworkInvitation(input) {
  const adminClient = getDataClient()
  const rawToken = generateNetworkInviteToken()
  const tokenHash = await hashNetworkInviteToken(rawToken)
  const now = new Date()
  const expiresInDays = input.expiresInDays ?? 30
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()

  const { data, errors } = await adminClient.models.NetworkInvitation.create({
    tokenHash,
    email: input.email.trim().toLowerCase(),
    inviteeName: input.inviteeName?.trim() || undefined,
    cohort: input.cohort || 'founding',
    roleCategory: input.roleCategory || undefined,
    brandsJson: JSON.stringify(input.brands?.length ? input.brands : ['cogcare']),
    status: 'pending',
    invitedByEmail: input.invitedByEmail?.trim() || undefined,
    personalNote: input.personalNote?.trim() || undefined,
    expiresAt,
    createdAt: now.toISOString(),
  })

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }

  return {
    invitation: data,
    rawToken,
    inviteUrl: buildNetworkInviteUrl(rawToken),
  }
}

export async function listNetworkInvitations() {
  const adminClient = getDataClient()
  const { data, errors } = await adminClient.models.NetworkInvitation.list({ limit: 200 })
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }
  return data ?? []
}

/**
 * @param {string} tokenHash
 */
export async function revokeNetworkInvitation(tokenHash) {
  const adminClient = getDataClient()
  const { data, errors } = await adminClient.models.NetworkInvitation.update({
    tokenHash,
    status: 'revoked',
  })
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }
  return data
}

export async function sendNetworkInvitationEmail(input) {
  const url = getMergedAmplifyOutputs()?.custom?.sendNetworkInvitationFunctionUrl
  if (typeof url !== 'string' || !url.startsWith('http')) throw new Error('Invitation email delivery is unavailable.')
  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()
  if (!idToken) throw new Error('Please sign in again.')
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${idToken}` },
    body: JSON.stringify(input),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body?.error || 'Invitation email could not be delivered.')
  return body
}
