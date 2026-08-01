import type { Handler } from 'aws-lambda'
import { createHash } from 'crypto'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import type { Schema } from '../../data/resource'

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
