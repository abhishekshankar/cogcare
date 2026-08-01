import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import type { Schema } from '../../data/resource'
import { findMemberConsultantByEmail } from '../../../src/lib/networkMemberLookup.js'
import { parseVentureAssociations } from '../../../lib/networkVentureAssociation.js'
import { isOwnedByMember } from '../../../lib/networkOwnership.js'
import {
  ATTRIBUTION_STATES,
  NETWORK_RESPONSE_STATES,
  cleanText,
  enumValue,
  hasNetworkCommunicationConsent,
  isPublishedNow,
  matchesNetworkAudience,
  resolveEventRsvpResponse,
  safeJsonBody,
} from '../../../lib/networkApiValidation.js'

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!, tokenUse: 'id', clientId: process.env.USER_POOL_CLIENT_ID!,
})
let dataClient: ReturnType<typeof generateClient<Schema>> | null = null
async function client() {
  if (dataClient) return dataClient
  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    process.env as Parameters<typeof getAmplifyDataClientConfig>[0],
  )
  Amplify.configure(resourceConfig, libraryOptions)
  return (dataClient = generateClient<Schema>())
}
const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
const reply = (statusCode: number, body: object) => ({ statusCode, headers, body: JSON.stringify(body) })

async function identity(event: { headers?: Record<string, string | undefined> }) {
  const auth = event.headers?.authorization || event.headers?.Authorization || ''
  try {
    const claims = await verifier.verify(auth.startsWith('Bearer ') ? auth.slice(7).trim() : '')
    const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : ''
    if (!email) return null
    const db = await client()
    const rows = (await db.models.Consultant.list({ filter: { contactEmail: { eq: email } }, limit: 5 })).data ?? []
    const member = findMemberConsultantByEmail(rows, email)
    return member ? { email, sub: claims.sub, member } : null
  } catch { return null }
}

async function listForMember(model: any, memberId: string) {
  return (await model.list({ filter: { memberId: { eq: memberId } }, limit: 200 })).data ?? []
}

export const handler: Handler = async (event) => {
  const method = event.requestContext?.http?.method
  if (method === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (method !== 'POST') return reply(405, { error: 'Method not allowed.' })
  const actor = await identity(event)
  if (!actor) return reply(401, { error: 'A valid Cognition Network member session is required.' })
  const parsed = safeJsonBody(event.body)
  if (!parsed.ok) return reply(400, { error: parsed.error })
  const body = parsed.value as Record<string, unknown>
  const operation = typeof body.operation === 'string' ? body.operation : ''
  const db = await client()
  const memberId = actor.member.id

  if (operation === 'workspace') {
    const [briefings, opportunities, responses, feedback, contributions, impacts, attributions,
      consentEvents, initiatives, proposals, events, eventResponses, preferences, introductions] = await Promise.all([
      db.models.NetworkBriefing.list({ filter: { status: { eq: 'published' } }, limit: 100 }),
      db.models.NetworkOpportunity.list({ filter: { status: { eq: 'published' } }, limit: 100 }),
      listForMember(db.models.NetworkOpportunityResponse, memberId),
      listForMember(db.models.NetworkFeedback, memberId),
      listForMember(db.models.NetworkContribution, memberId),
      listForMember(db.models.NetworkImpact, memberId),
      listForMember(db.models.AttributionApproval, memberId),
      listForMember(db.models.NetworkConsentEvent, memberId),
      db.models.NetworkInitiative.list({ filter: { status: { eq: 'published' } }, limit: 100 }),
      listForMember(db.models.NetworkProposal, memberId),
      db.models.NetworkEvent.list({ filter: { status: { eq: 'published' } }, limit: 100 }),
      listForMember(db.models.NetworkEventResponse, memberId),
      listForMember(db.models.NetworkMemberPreference, memberId),
      db.models.NetworkIntroduction.list({ filter: { requesterMemberId: { eq: memberId } }, limit: 100 }),
    ])
    const receivedIntroductions = (await db.models.NetworkIntroduction.list({
      filter: { recipientMemberId: { eq: memberId } }, limit: 100,
    })).data ?? []
    const memberVentures = new Set(parseVentureAssociations(actor.member.ventureAssociationsJson))
    const scopedOpportunities = (opportunities.data ?? [])
      .filter((item) => isPublishedNow(item))
      .filter((item) => matchesNetworkAudience(item, actor.member))
      .filter((item) => !item.venture || memberVentures.has(item.venture))
    return reply(200, { ok: true, workspace: {
      briefings: (briefings.data ?? []).filter((item) => matchesNetworkAudience(item, actor.member)), opportunities: scopedOpportunities,
      responses, feedback, contributions, impacts, attributions, consentEvents,
      initiatives: initiatives.data ?? [], proposals,
      events: (events.data ?? []).filter((item) => matchesNetworkAudience(item, actor.member)), eventResponses,
      preferences: preferences[0] ?? null, introductions: [...(introductions.data ?? []), ...receivedIntroductions],
    } })
  }

  if (operation === 'respondOpportunity') {
    const opportunityId = cleanText(body.opportunityId, { field: 'Opportunity', required: true, max: 128, rejectPhi: false })
    const response = enumValue(body.response, NETWORK_RESPONSE_STATES, 'Response')
    const note = cleanText(body.note, { field: 'Note', max: 1000 })
    if (!opportunityId.ok || !response.ok || !note.ok) return reply(400, { error: (!opportunityId.ok ? opportunityId : !response.ok ? response : note).error })
    const opportunity = (await db.models.NetworkOpportunity.get({ id: opportunityId.value })).data
    if (!opportunity || !isPublishedNow(opportunity)) return reply(404, { error: 'This opportunity is not currently available.' })
    const existing = (await db.models.NetworkOpportunityResponse.list({
      filter: { and: [{ memberId: { eq: memberId } }, { opportunityId: { eq: opportunityId.value } }] }, limit: 2,
    })).data?.[0]
    const payload = { memberId, memberEmail: actor.email, opportunityId: opportunityId.value,
      response: response.value, note: note.value || undefined, respondedAt: new Date().toISOString() }
    const result = existing
      ? await db.models.NetworkOpportunityResponse.update({ id: existing.id, ...payload })
      : await db.models.NetworkOpportunityResponse.create(payload)
    return result.data ? reply(200, { ok: true, response: result.data }) : reply(500, { error: 'Could not save your response.' })
  }

  if (operation === 'submitFeedback') {
    const message = cleanText(body.message, { field: 'Feedback', required: true, max: 3000 })
    const category = cleanText(body.category, { field: 'Category', max: 80, rejectPhi: false })
    if (!message.ok || !category.ok) return reply(400, { error: (!message.ok ? message : category).error })
    const result = await db.models.NetworkFeedback.create({ memberId, memberEmail: actor.email,
      context: 'member_portal', category: category.value || undefined, message: message.value,
      createdAt: new Date().toISOString(), status: 'new' })
    return result.data ? reply(201, { ok: true, feedback: result.data }) : reply(500, { error: 'Could not submit feedback.' })
  }

  if (operation === 'decideAttribution') {
    const id = cleanText(body.id, { field: 'Attribution request', required: true, max: 128, rejectPhi: false })
    const decision = enumValue(body.decision, ATTRIBUTION_STATES, 'Decision')
    if (!id.ok || !decision.ok) return reply(400, { error: (!id.ok ? id : decision).error })
    const item = (await db.models.AttributionApproval.get({ id: id.value })).data
    if (!item || !isOwnedByMember(item, memberId) || item.status !== 'pending') return reply(404, { error: 'Pending attribution request not found.' })
    const result = await db.models.AttributionApproval.update({ id: item.id, status: decision.value, decidedAt: new Date().toISOString() })
    return result.data ? reply(200, { ok: true, attribution: result.data }) : reply(500, { error: 'Could not save your decision.' })
  }

  if (operation === 'submitProposal') {
    const title = cleanText(body.title, { field: 'Title', required: true, max: 160 })
    const summary = cleanText(body.summary, { field: 'Summary', required: true, max: 3000 })
    const topic = cleanText(body.topic, { field: 'Topic', max: 100, rejectPhi: false })
    if (!title.ok || !summary.ok || !topic.ok) return reply(400, { error: (!title.ok ? title : !summary.ok ? summary : topic).error })
    const result = await db.models.NetworkProposal.create({ memberId, title: title.value, summary: summary.value,
      topic: topic.value || undefined, status: 'submitted', submittedAt: new Date().toISOString() })
    return result.data ? reply(201, { ok: true, proposal: result.data }) : reply(500, { error: 'Could not submit proposal.' })
  }

  if (operation === 'respondEvent') {
    const eventId = cleanText(body.eventId, { field: 'Event', required: true, max: 128, rejectPhi: false })
    const response = enumValue(body.response, ['attending', 'declined', 'waitlist', 'withdrawn'], 'Response')
    if (!eventId.ok || !response.ok) return reply(400, { error: (!eventId.ok ? eventId : response).error })
    const networkEvent = (await db.models.NetworkEvent.get({ id: eventId.value })).data
    if (!networkEvent || networkEvent.status !== 'published') return reply(404, { error: 'Event not found.' })
    const prior = (await db.models.NetworkEventResponse.list({ filter: { and: [{ memberId: { eq: memberId } }, { eventId: { eq: eventId.value } }] }, limit: 2 })).data?.[0]
    let resolvedResponse = response.value
    if (resolvedResponse === 'attending' && typeof networkEvent.capacity === 'number') {
      const attending = (await db.models.NetworkEventResponse.list({
        filter: { and: [{ eventId: { eq: eventId.value } }, { response: { eq: 'attending' } }] }, limit: 500,
      })).data ?? []
      const attendingExcludingSelf = attending.filter((x) => x.memberId !== memberId).length
      resolvedResponse = resolveEventRsvpResponse(networkEvent, response.value, attendingExcludingSelf)
    }
    const values = { memberId, eventId: eventId.value, response: resolvedResponse, respondedAt: new Date().toISOString() }
    const result = prior ? await db.models.NetworkEventResponse.update({ id: prior.id, ...values }) : await db.models.NetworkEventResponse.create(values)
    return result.data ? reply(200, { ok: true, eventResponse: result.data }) : reply(500, { error: 'Could not save your response.' })
  }

  if (operation === 'savePreferences') {
    const topics = Array.isArray(body.topics) ? [...new Set(body.topics.filter((v): v is string => typeof v === 'string').map((v) => v.trim()).filter(Boolean))].slice(0, 30) : []
    const cadence = enumValue(body.notificationCadence, ['none', 'monthly', 'important_only'], 'Notification cadence')
    if (!cadence.ok) return reply(400, { error: cadence.error })
    if (cadence.value !== 'none' && !hasNetworkCommunicationConsent(actor.member)) return reply(409, { error: 'Enable network communications in Profile & consent before selecting notifications.' })
    const prior = (await db.models.NetworkMemberPreference.list({ filter: { memberId: { eq: memberId } }, limit: 2 })).data?.[0]
    const values = { memberId, topicsJson: JSON.stringify(topics), notificationCadence: cadence.value, updatedAt: new Date().toISOString() }
    const result = prior ? await db.models.NetworkMemberPreference.update({ id: prior.id, ...values }) : await db.models.NetworkMemberPreference.create(values)
    return result.data ? reply(200, { ok: true, preferences: result.data }) : reply(500, { error: 'Could not save preferences.' })
  }

  if (operation === 'decideIntroduction') {
    const id = cleanText(body.id, { field: 'Introduction', required: true, max: 128, rejectPhi: false })
    const decision = enumValue(body.decision, ['accepted', 'declined'], 'Decision')
    if (!id.ok || !decision.ok) return reply(400, { error: (!id.ok ? id : decision).error })
    const intro = (await db.models.NetworkIntroduction.get({ id: id.value })).data
    if (!intro || ![intro.requesterMemberId, intro.recipientMemberId].includes(memberId) || intro.status !== 'pending') return reply(404, { error: 'Pending introduction not found.' })
    const ownField = intro.requesterMemberId === memberId ? 'requesterConsent' : 'recipientConsent'
    if (intro[ownField] !== 'pending') return reply(409, { error: 'You have already responded to this introduction.' })
    const patch: Record<string, unknown> = { id: intro.id, [ownField]: decision.value }
    const other = ownField === 'requesterConsent' ? intro.recipientConsent : intro.requesterConsent
    if (decision.value === 'declined') Object.assign(patch, { status: 'declined', resolvedAt: new Date().toISOString() })
    else if (other === 'accepted') Object.assign(patch, { status: 'consented', resolvedAt: new Date().toISOString() })
    const result = await db.models.NetworkIntroduction.update(patch as never)
    return result.data ? reply(200, { ok: true, introduction: result.data }) : reply(500, { error: 'Could not save your decision.' })
  }

  return reply(400, { error: 'Unknown operation.' })
}
