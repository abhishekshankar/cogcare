import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import type { Schema } from '../../data/resource'
import { cleanText, enumValue, hasNetworkCommunicationConsent, safeJsonBody } from '../../../lib/networkApiValidation.js'
import { hasAdminGroup } from '../../../lib/networkAdminAuth.js'
import { canTransitionContentStatus } from '../../../lib/networkStateMachines.js'

const verifier = CognitoJwtVerifier.create({ userPoolId: process.env.USER_POOL_ID!, tokenUse: 'id', clientId: process.env.USER_POOL_CLIENT_ID! })
let dataClient: ReturnType<typeof generateClient<Schema>> | null = null
async function client() {
  if (dataClient) return dataClient
  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(process.env as Parameters<typeof getAmplifyDataClientConfig>[0])
  Amplify.configure(resourceConfig, libraryOptions)
  return (dataClient = generateClient<Schema>())
}
const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
const reply = (statusCode: number, body: object) => ({ statusCode, headers, body: JSON.stringify(body) })
async function admin(event: { headers?: Record<string, string | undefined> }) {
  const auth = event.headers?.authorization || event.headers?.Authorization || ''
  try {
    const claims = await verifier.verify(auth.startsWith('Bearer ') ? auth.slice(7).trim() : '')
    return hasAdminGroup(claims) ? { email: String(claims.email || ''), sub: claims.sub } : null
  } catch { return null }
}
const required = (body: Record<string, unknown>, key: string, max = 3000) => cleanText(body[key], { field: key, required: true, max })

export const handler: Handler = async (event) => {
  const method = event.requestContext?.http?.method
  if (method === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (method !== 'POST') return reply(405, { error: 'Method not allowed.' })
  const actor = await admin(event)
  if (!actor) return reply(403, { error: 'Administrator access required.' })
  const parsed = safeJsonBody(event.body)
  if (!parsed.ok) return reply(400, { error: parsed.error })
  const body = parsed.value as Record<string, unknown>
  const operation = typeof body.operation === 'string' ? body.operation : ''
  const db = await client()
  const now = new Date().toISOString()

  if (operation === 'dashboard') {
    const [briefings, opportunities, responses, feedback, contributions, impacts, attributions,
      initiatives, proposals, events, introductions, notifications, metrics] = await Promise.all([
      db.models.NetworkBriefing.list({ limit: 200 }), db.models.NetworkOpportunity.list({ limit: 200 }),
      db.models.NetworkOpportunityResponse.list({ limit: 500 }), db.models.NetworkFeedback.list({ limit: 500 }),
      db.models.NetworkContribution.list({ limit: 500 }), db.models.NetworkImpact.list({ limit: 500 }),
      db.models.AttributionApproval.list({ limit: 500 }), db.models.NetworkInitiative.list({ limit: 200 }),
      db.models.NetworkProposal.list({ limit: 500 }), db.models.NetworkEvent.list({ limit: 200 }),
      db.models.NetworkIntroduction.list({ limit: 500 }), db.models.NetworkNotification.list({ limit: 500 }),
      db.models.NetworkMetric.list({ limit: 500 }),
    ])
    const scrubFeedback = (feedback.data ?? []).map(({ memberEmail: _email, ...item }) => item)
    return reply(200, { ok: true, dashboard: { briefings: briefings.data ?? [], opportunities: opportunities.data ?? [],
      responses: (responses.data ?? []).map(({ memberEmail: _email, note: _note, ...item }) => item), feedback: scrubFeedback,
      contributions: contributions.data ?? [], impacts: impacts.data ?? [], attributions: attributions.data ?? [],
      initiatives: initiatives.data ?? [], proposals: proposals.data ?? [], events: events.data ?? [],
      introductions: introductions.data ?? [], notifications: notifications.data ?? [], metrics: metrics.data ?? [] } })
  }

  if (operation === 'saveBriefing') {
    const title = required(body, 'title', 180), summary = required(body, 'summary', 1000)
    const content = cleanText(body.body, { field: 'body', max: 12000 })
    const status = enumValue(body.status, ['draft', 'published', 'archived'], 'Status')
    if (!title.ok || !summary.ok || !content.ok || !status.ok) return reply(400, { error: (!title.ok ? title : !summary.ok ? summary : !content.ok ? content : status).error })
    const values = { title: title.value, summary: summary.value, body: content.value || undefined,
      topic: typeof body.topic === 'string' ? body.topic.trim().slice(0, 100) : undefined,
      audienceJson: JSON.stringify(Array.isArray(body.audience) ? body.audience.slice(0, 30) : []), status: status.value,
      publishedAt: status.value === 'published' ? now : undefined, archivedAt: status.value === 'archived' ? now : undefined, createdBy: actor.email }
    const id = typeof body.id === 'string' ? body.id : ''
    if (id) {
      const existing = (await db.models.NetworkBriefing.get({ id })).data
      if (!existing) return reply(404, { error: 'Briefing not found.' })
      if (existing.status !== status.value && !canTransitionContentStatus(existing.status, status.value)) return reply(409, { error: `Briefing cannot move from ${existing.status} to ${status.value}.` })
    }
    const result = id ? await db.models.NetworkBriefing.update({ id, ...values }) : await db.models.NetworkBriefing.create(values)
    return result.data ? reply(200, { ok: true, briefing: result.data }) : reply(500, { error: 'Could not save briefing.' })
  }

  if (operation === 'saveOpportunity') {
    const title = required(body, 'title', 180), summary = required(body, 'summary', 1200), rationale = required(body, 'rationale', 1200)
    const status = enumValue(body.status, ['draft', 'published', 'closed', 'archived'], 'Status')
    if (!title.ok || !summary.ok || !rationale.ok || !status.ok) return reply(400, { error: (!title.ok ? title : !summary.ok ? summary : !rationale.ok ? rationale : status).error })
    const values = { title: title.value, summary: summary.value, rationale: rationale.value,
      scope: typeof body.scope === 'string' ? body.scope.trim().slice(0, 1500) : undefined,
      timeCommitment: typeof body.timeCommitment === 'string' ? body.timeCommitment.trim().slice(0, 160) : undefined,
      topic: typeof body.topic === 'string' ? body.topic.trim().slice(0, 100) : undefined,
      audienceJson: JSON.stringify(Array.isArray(body.audience) ? body.audience.slice(0, 30) : []),
      venture: typeof body.venture === 'string' ? body.venture.trim().slice(0, 80) : undefined, status: status.value,
      opensAt: typeof body.opensAt === 'string' ? body.opensAt : undefined, closesAt: typeof body.closesAt === 'string' ? body.closesAt : undefined,
      publishedAt: status.value === 'published' ? now : undefined, archivedAt: status.value === 'archived' ? now : undefined, createdBy: actor.email }
    const id = typeof body.id === 'string' ? body.id : ''
    if (id) {
      const existing = (await db.models.NetworkOpportunity.get({ id })).data
      if (!existing) return reply(404, { error: 'Opportunity not found.' })
      if (existing.status !== status.value && !canTransitionContentStatus(existing.status, status.value)) return reply(409, { error: `Opportunity cannot move from ${existing.status} to ${status.value}.` })
    }
    const result = id ? await db.models.NetworkOpportunity.update({ id, ...values }) : await db.models.NetworkOpportunity.create(values)
    return result.data ? reply(200, { ok: true, opportunity: result.data }) : reply(500, { error: 'Could not save opportunity.' })
  }

  if (operation === 'recordContribution' || operation === 'recordImpact') {
    const memberId = required(body, 'memberId', 128), title = required(body, 'title', 180), description = required(body, 'description', 3000)
    if (!memberId.ok || !title.ok || !description.ok) return reply(400, { error: (!memberId.ok ? memberId : !title.ok ? title : description).error })
    if (operation === 'recordContribution') {
      const result = await db.models.NetworkContribution.create({ memberId: memberId.value, title: title.value, description: description.value,
        venture: typeof body.venture === 'string' ? body.venture.trim().slice(0, 80) : undefined, status: 'verified',
        occurredAt: typeof body.occurredAt === 'string' ? body.occurredAt : undefined, verifiedAt: now, verifiedBy: actor.email })
      return result.data ? reply(201, { ok: true, contribution: result.data }) : reply(500, { error: 'Could not record contribution.' })
    }
    const result = await db.models.NetworkImpact.create({ memberId: memberId.value,
      contributionId: typeof body.contributionId === 'string' ? body.contributionId : undefined,
      title: title.value, description: description.value, evidenceUrl: typeof body.evidenceUrl === 'string' ? body.evidenceUrl.trim().slice(0, 1000) : undefined,
      status: 'verified', verifiedAt: now, verifiedBy: actor.email })
    return result.data ? reply(201, { ok: true, impact: result.data }) : reply(500, { error: 'Could not record impact.' })
  }

  if (operation === 'requestAttribution') {
    const memberId = required(body, 'memberId', 128), itemId = required(body, 'itemId', 128), text = required(body, 'proposedText', 1000)
    const itemType = enumValue(body.itemType, ['contribution', 'impact', 'briefing', 'initiative'], 'Item type')
    if (!memberId.ok || !itemId.ok || !text.ok || !itemType.ok) return reply(400, { error: (!memberId.ok ? memberId : !itemId.ok ? itemId : !text.ok ? text : itemType).error })
    const result = await db.models.AttributionApproval.create({ memberId: memberId.value, itemType: itemType.value,
      itemId: itemId.value, proposedText: text.value, status: 'pending', requestedAt: now, requestedBy: actor.email })
    return result.data ? reply(201, { ok: true, attribution: result.data }) : reply(500, { error: 'Could not request attribution approval.' })
  }

  if (operation === 'createIntroduction') {
    const requester = required(body, 'requesterMemberId', 128), recipient = required(body, 'recipientMemberId', 128), purpose = required(body, 'purpose', 1000)
    if (!requester.ok || !recipient.ok || !purpose.ok || requester.value === recipient.value) return reply(400, { error: requester.value === recipient.value ? 'Introduction requires two different members.' : (!requester.ok ? requester : !recipient.ok ? recipient : purpose).error })
    const result = await db.models.NetworkIntroduction.create({ requesterMemberId: requester.value, recipientMemberId: recipient.value,
      purpose: purpose.value, requesterConsent: 'pending', recipientConsent: 'pending', status: 'pending', createdAt: now })
    return result.data ? reply(201, { ok: true, introduction: result.data }) : reply(500, { error: 'Could not create introduction request.' })
  }

  if (operation === 'saveInitiative' || operation === 'saveEvent') {
    const title = required(body, 'title', 180), description = required(body, operation === 'saveEvent' ? 'description' : 'summary', 3000)
    const status = enumValue(body.status, ['draft', 'published', 'closed', 'archived'], 'Status')
    if (!title.ok || !description.ok || !status.ok) return reply(400, { error: (!title.ok ? title : !description.ok ? description : status).error })
    const id = typeof body.id === 'string' ? body.id : ''
    if (operation === 'saveInitiative') {
      const values = { title: title.value, summary: description.value, topic: typeof body.topic === 'string' ? body.topic.slice(0, 100) : undefined,
        venture: typeof body.venture === 'string' ? body.venture.slice(0, 80) : undefined, status: status.value, createdBy: actor.email,
        publishedAt: status.value === 'published' ? now : undefined }
      const result = id ? await db.models.NetworkInitiative.update({ id, ...values }) : await db.models.NetworkInitiative.create(values)
      return result.data ? reply(200, { ok: true, initiative: result.data }) : reply(500, { error: 'Could not save initiative.' })
    }
    if (typeof body.startsAt !== 'string') return reply(400, { error: 'startsAt is required.' })
    const values = { title: title.value, description: description.value, topic: typeof body.topic === 'string' ? body.topic.slice(0, 100) : undefined,
      startsAt: body.startsAt, endsAt: typeof body.endsAt === 'string' ? body.endsAt : undefined,
      capacity: typeof body.capacity === 'number' ? Math.max(1, Math.floor(body.capacity)) : undefined, status: status.value,
      audienceJson: JSON.stringify(Array.isArray(body.audience) ? body.audience.slice(0, 30) : []), createdBy: actor.email }
    const result = id ? await db.models.NetworkEvent.update({ id, ...values }) : await db.models.NetworkEvent.create(values)
    return result.data ? reply(200, { ok: true, event: result.data }) : reply(500, { error: 'Could not save event.' })
  }

  if (operation === 'reviewProposal') {
    const id = required(body, 'id', 128), status = enumValue(body.status, ['under_review', 'accepted', 'declined'], 'Status')
    if (!id.ok || !status.ok) return reply(400, { error: (!id.ok ? id : status).error })
    const result = await db.models.NetworkProposal.update({ id: id.value, status: status.value, reviewedAt: now })
    return result.data ? reply(200, { ok: true, proposal: result.data }) : reply(500, { error: 'Could not review proposal.' })
  }

  if (operation === 'queueNotification') {
    const memberId = required(body, 'memberId', 128), kind = required(body, 'kind', 80)
    const subject = required(body, 'subject', 180), message = required(body, 'message', 3000)
    if (!memberId.ok || !kind.ok || !subject.ok || !message.ok) return reply(400, { error: (!memberId.ok ? memberId : !kind.ok ? kind : !subject.ok ? subject : message).error })
    const member = (await db.models.Consultant.get({ id: memberId.value })).data
    if (!member || !hasNetworkCommunicationConsent(member)) return reply(409, { error: 'Member has not consented to network communications.' })
    const result = await db.models.NetworkNotification.create({ memberId: memberId.value, kind: kind.value, subject: subject.value, message: message.value,
      subjectId: typeof body.subjectId === 'string' ? body.subjectId.slice(0, 128) : undefined,
      status: 'queued', consentCheckedAt: now, createdAt: now })
    return result.data ? reply(201, { ok: true, notification: result.data }) : reply(500, { error: 'Could not queue notification.' })
  }

  if (operation === 'dispatchNotification') {
    const id = required(body, 'id', 128)
    if (!id.ok) return reply(400, { error: id.error })
    const notification = (await db.models.NetworkNotification.get({ id: id.value })).data
    if (!notification || notification.status !== 'queued') return reply(404, { error: 'Queued notification not found.' })
    const member = (await db.models.Consultant.get({ id: notification.memberId })).data
    if (!member || !member.contactEmail || !hasNetworkCommunicationConsent(member)) {
      await db.models.NetworkNotification.update({ id: notification.id, status: 'cancelled_no_consent', consentCheckedAt: now })
      return reply(409, { error: 'Delivery cancelled because current communication consent is absent.' })
    }
    const apiKey = process.env.BREVO_API_KEY, senderEmail = process.env.BREVO_SENDER_EMAIL
    if (!apiKey || !senderEmail) return reply(503, { error: 'Network email delivery is not configured.' })
    const response = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({ sender: { name: process.env.BREVO_SENDER_NAME || 'Cognition Network', email: senderEmail },
        to: [{ email: member.contactEmail, name: member.name }], subject: notification.subject,
        textContent: `${notification.message}\n\nOpen your private Network workspace: ${(process.env.APP_BASE_URL || 'https://cogcare.org').replace(/\/$/, '')}/network/member\n\nYou receive this only because Network communications are enabled. You can turn them off in Profile & consent.` }) })
    if (!response.ok) return reply(502, { error: 'Notification delivery failed; it remains queued.' })
    const updated = await db.models.NetworkNotification.update({ id: notification.id, status: 'sent', consentCheckedAt: now, sentAt: now })
    return updated.data ? reply(200, { ok: true, notification: updated.data }) : reply(500, { error: 'Delivery succeeded but the delivery ledger could not be updated.' })
  }

  if (operation === 'recomputeMetrics') {
    const period = now.slice(0, 7)
    const [responses, feedback, contributions, impacts, proposals, eventResponses, attributions, introductions] = await Promise.all([
      db.models.NetworkOpportunityResponse.list({ limit: 1000 }), db.models.NetworkFeedback.list({ limit: 1000 }),
      db.models.NetworkContribution.list({ limit: 1000 }), db.models.NetworkImpact.list({ limit: 1000 }),
      db.models.NetworkProposal.list({ limit: 1000 }), db.models.NetworkEventResponse.list({ limit: 1000 }),
      db.models.AttributionApproval.list({ limit: 1000 }), db.models.NetworkIntroduction.list({ limit: 1000 }),
    ])
    const entries = [
      ['opportunity_responses', responses.data?.length ?? 0], ['feedback_submissions', feedback.data?.length ?? 0],
      ['verified_contributions', contributions.data?.filter((x) => x.status === 'verified').length ?? 0],
      ['verified_impacts', impacts.data?.filter((x) => x.status === 'verified').length ?? 0],
      ['member_proposals', proposals.data?.length ?? 0], ['event_responses', eventResponses.data?.length ?? 0],
      ['approved_attributions', attributions.data?.filter((x) => x.status === 'approved').length ?? 0],
      ['consented_introductions', introductions.data?.filter((x) => x.status === 'consented').length ?? 0],
    ] as const
    const saved = []
    for (const [metric, value] of entries) {
      const prior = (await db.models.NetworkMetric.list({ filter: { and: [{ period: { eq: period } }, { metric: { eq: metric } }] }, limit: 2 })).data?.[0]
      const result = prior
        ? await db.models.NetworkMetric.update({ id: prior.id, value, computedAt: now })
        : await db.models.NetworkMetric.create({ period, metric, value, computedAt: now })
      if (result.data) saved.push(result.data)
    }
    return reply(200, { ok: true, metrics: saved })
  }

  return reply(400, { error: 'Unknown operation.' })
}
