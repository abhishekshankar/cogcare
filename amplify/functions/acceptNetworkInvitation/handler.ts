import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { createHash } from 'crypto'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import type { Schema } from '../../data/resource'
import { uniqueSlug, slugify } from '../../../lib/slugify.js'
import { validateNetworkOnboarding } from '../../../lib/networkOnboarding.js'

function getDataClientEnv(): Parameters<typeof getAmplifyDataClientConfig>[0] {
  return process.env as Parameters<typeof getAmplifyDataClientConfig>[0]
}

let dataClient: ReturnType<typeof generateClient<Schema>> | null = null

async function getDataClient() {
  if (dataClient) return dataClient
  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(getDataClientEnv())
  Amplify.configure(resourceConfig, libraryOptions)
  dataClient = generateClient<Schema>()
  return dataClient
}

function responseHeaders() {
  return { 'Content-Type': 'application/json' }
}

function hashToken(raw: string) {
  return createHash('sha256').update(raw, 'utf8').digest('hex')
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.USER_POOL_CLIENT_ID!,
})

function pickStr(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

type AcceptBody = {
  token?: string
  onboarding?: Record<string, unknown>
}

export const handler: Handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: responseHeaders(), body: '' }
  }

  const authHeader =
    event.headers?.authorization || event.headers?.Authorization || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!bearer) {
    return {
      statusCode: 401,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'Sign in required to accept this invitation.' }),
    }
  }

  let jwtPayload: Record<string, unknown>
  try {
    jwtPayload = await verifier.verify(bearer)
  } catch {
    return {
      statusCode: 401,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'Your sign-in session is invalid or expired.' }),
    }
  }
  const sessionEmail = pickStr(jwtPayload?.email)?.toLowerCase()
  if (!sessionEmail) {
    return {
      statusCode: 401,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'Could not read your signed-in email.' }),
    }
  }

  let body: AcceptBody = {}
  try {
    body = event.body ? JSON.parse(event.body) : {}
  } catch {
    return {
      statusCode: 400,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'Invalid JSON body.' }),
    }
  }

  const rawToken = pickStr(body.token)
  if (!rawToken) {
    return {
      statusCode: 400,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'token is required.' }),
    }
  }

  const validation = validateNetworkOnboarding(body.onboarding || {})
  if (!validation.ok) {
    return {
      statusCode: 400,
      headers: responseHeaders(),
      body: JSON.stringify({ error: validation.error }),
    }
  }
  const onboarding = validation.value
  const name = onboarding.name

  const tokenHash = hashToken(rawToken)
  const client = await getDataClient()

  const inviteRes = await client.models.NetworkInvitation.get({ tokenHash })
  const invitation = inviteRes.data
  if (!invitation) {
    return {
      statusCode: 404,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'Invitation not found or link is invalid.' }),
    }
  }

  const inviteEmail = invitation.email?.toLowerCase()
  if (!inviteEmail || inviteEmail !== sessionEmail) {
    return {
      statusCode: 403,
      headers: responseHeaders(),
      body: JSON.stringify({
        error: 'Sign in with the email address this invitation was sent to.',
        invitedEmail: inviteEmail,
      }),
    }
  }

  if (invitation.status === 'revoked') {
    return {
      statusCode: 410,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'This invitation has been revoked.' }),
    }
  }

  if (invitation.status === 'accepted' && invitation.consultantId) {
    return {
      statusCode: 200,
      headers: responseHeaders(),
      body: JSON.stringify({
        ok: true,
        alreadyAccepted: true,
        consultantId: invitation.consultantId,
        slug: invitation.consultantSlug,
      }),
    }
  }

  const expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt) : null
  if (expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
    if (invitation.status !== 'expired') {
      await client.models.NetworkInvitation.update({
        tokenHash,
        status: 'expired',
      })
    }
    return {
      statusCode: 410,
      headers: responseHeaders(),
      body: JSON.stringify({ error: 'This invitation has expired.' }),
    }
  }

  const consultants = await client.models.Consultant.list({ limit: 200 })
  const takenSlugs = new Set(
    (consultants.data ?? [])
      .map((c) => c.slug)
      .filter((s): s is string => Boolean(s)),
  )
  const slug = uniqueSlug(slugify(name) || 'member', takenSlugs)

  const now = new Date().toISOString()
  const publishName =
    onboarding.nameBioConsent &&
    onboarding.publicProfileConsent &&
    (onboarding.profileVisibility === 'public' || onboarding.profileVisibility === 'directory')

  const createRes = await client.models.Consultant.create({
    name,
    slug,
    title: onboarding.title,
    bio: onboarding.bio,
    contactEmail: inviteEmail,
    bookingUrl: onboarding.professionalUrl,
    affiliation: 'verified_partner',
    isActive: onboarding.profileVisibility !== 'private',
    inactiveReason: onboarding.profileVisibility === 'directory' ? 'page_only' : undefined,
    sortOrder: 50,
    networkCohort: invitation.cohort ?? 'founding',
    networkRoleCategory: invitation.roleCategory,
    networkBrandsJson: invitation.brandsJson,
    organization: onboarding.organization,
    professionalUrl: onboarding.professionalUrl,
    participationMode: onboarding.participationMode,
    ventureAssociationsJson: JSON.stringify(onboarding.ventureAssociations),
    interests: onboarding.interests,
    profileVisibility: onboarding.profileVisibility,
    communicationPreference: onboarding.communicationPreference,
    onboardingNote: onboarding.note,
    publicNameConsentAt: publishName ? now : undefined,
    disclosureAcknowledgedAt: now,
  })

  if (createRes.errors?.length || !createRes.data?.id) {
    return {
      statusCode: 500,
      headers: responseHeaders(),
      body: JSON.stringify({
        error: 'Could not create your network profile.',
        details: createRes.errors?.map((e) => e.message).join('; '),
      }),
    }
  }

  await client.models.NetworkInvitation.update({
    tokenHash,
    status: 'accepted',
    acceptedAt: now,
    consultantId: createRes.data.id,
    consultantSlug: slug,
  })

  return {
    statusCode: 200,
    headers: responseHeaders(),
    body: JSON.stringify({
      ok: true,
      consultantId: createRes.data.id,
      slug,
    }),
  }
}
