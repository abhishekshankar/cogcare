import type { Handler } from 'aws-lambda'
import { createHash, randomBytes } from 'crypto'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import type { Schema } from '../../data/resource'
import { generateWaitlistCode, validateWaitlistRequest } from '../../../lib/networkWaitlist.js'

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
const hashToken = (raw: string) => createHash('sha256').update(raw, 'utf8').digest('hex')

export const handler: Handler = async (event) => {
  const query = event.queryStringParameters || {}
  const client = await getDataClient()

  if (event.requestContext?.http?.method === 'POST') {
    let input: unknown
    try {
      input = JSON.parse(event.body || '{}')
    } catch {
      return reply(400, { error: 'Invalid request body.' })
    }

    try {
      const request = validateWaitlistRequest(input)
      const emailHash = hashToken(request.email)
      const existing = (await client.models.NetworkWaitlistRequest.get({ emailHash })).data
      if (existing) return reply(200, { waitlistCode: existing.waitlistCode, status: existing.status })

      const now = new Date().toISOString()
      const waitlistCode = generateWaitlistCode(randomBytes(6))
      const { errors } = await client.models.NetworkWaitlistRequest.create({
        emailHash,
        waitlistCode,
        ...request,
        source: typeof (input as { source?: unknown }).source === 'string'
          ? String((input as { source?: string }).source).slice(0, 100)
          : 'network-request-invite',
        status: 'waiting',
        consentAt: now,
        createdAt: now,
      })
      if (errors?.length) throw new Error(errors.map((error) => error.message).join('; '))
      return reply(201, { waitlistCode, status: 'waiting' })
    } catch (error) {
      return reply(400, { error: error instanceof Error ? error.message : 'Could not join the waitlist.' })
    }
  }

  if (query.directory === '1') {
    const rows = (await client.models.Consultant.list({ limit: 200 })).data ?? []
    const consultants = rows
      .filter((c) => {
        const visibility = c.profileVisibility || 'public'
        return c.isActive !== false && visibility !== 'private' && Boolean(c.publicNameConsentAt)
      })
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        title: c.title,
        credentials: c.credentials,
        bio: c.bio,
        photoUrl: c.photoUrl,
        bookingUrl: c.bookingUrl,
        contactEmail: c.bookingUrl ? undefined : 'hello@cogcare.org',
        affiliation: c.affiliation,
        licensedStates: c.licensedStates,
        locationCity: c.locationCity,
        locationState: c.locationState,
        organization: c.organization,
        professionalUrl: c.professionalUrl,
        isActive: c.isActive,
        profileVisibility: c.profileVisibility,
        publicNameConsentAt: c.publicNameConsentAt,
      }))
    return reply(200, { consultants })
  }

  if (typeof query.token === 'string' && query.token.trim()) {
    const invitation = (await client.models.NetworkInvitation.get({ tokenHash: hashToken(query.token.trim()) })).data
    if (!invitation) return reply(404, { error: 'Invitation not found.' })
    // Terminal states never render the onboarding form, so stop returning the invitee's
    // email/name/note once the link can no longer be acted on (revoked/accepted/expired links
    // otherwise disclose PII indefinitely to anyone who still holds the URL).
    const expiredByDate = Boolean(invitation.expiresAt && new Date(invitation.expiresAt) <= new Date())
    if (invitation.status === 'revoked' || invitation.status === 'accepted' || invitation.status === 'expired' || expiredByDate) {
      return reply(200, {
        invitation: { status: expiredByDate ? 'expired' : invitation.status, consultantSlug: invitation.consultantSlug },
      })
    }
    return reply(200, {
      invitation: {
        email: invitation.email,
        inviteeName: invitation.inviteeName,
        cohort: invitation.cohort,
        roleCategory: invitation.roleCategory,
        brandsJson: invitation.brandsJson,
        status: invitation.status,
        personalNote: invitation.personalNote,
        expiresAt: invitation.expiresAt,
        acceptedAt: invitation.acceptedAt,
        consultantSlug: invitation.consultantSlug,
      },
    })
  }

  if (typeof query.slug === 'string' && query.slug.trim()) {
    const rows = (await client.models.Consultant.list({
      filter: { slug: { eq: query.slug.trim() } },
      limit: 1,
    })).data ?? []
    const c = rows[0]
    if (!c || c.isActive === false || c.profileVisibility !== 'public' || !c.publicNameConsentAt) {
      return reply(404, { error: 'Consultant not found.' })
    }
    return reply(200, {
      consultant: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        title: c.title,
        credentials: c.credentials,
        bio: c.bio,
        photoUrl: c.photoUrl,
        bookingUrl: c.bookingUrl,
        affiliation: c.affiliation,
        licensedStates: c.licensedStates,
        locationCity: c.locationCity,
        locationState: c.locationState,
        organization: c.organization,
        professionalUrl: c.professionalUrl,
        networkCohort: c.networkCohort,
        ventureAssociationsJson: c.ventureAssociationsJson,
        profileVisibility: c.profileVisibility,
        publicNameConsentAt: c.publicNameConsentAt,
        isActive: c.isActive,
      },
    })
  }

  return reply(400, { error: 'token, slug, or directory is required.' })
}
