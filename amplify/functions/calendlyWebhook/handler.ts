import type { Handler } from 'aws-lambda'
import { createHmac, timingSafeEqual } from 'crypto'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import type { Schema } from '../../data/resource'

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

/**
 * Calendly webhook signatures: header `Calendly-Webhook-Signature` = `t=<unix>,v1=<hex>`.
 * Signed payload = `${t}.${rawBody}` HMAC-SHA256 with signing key, hex digest.
 */
function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string | undefined,
  signingKey: string,
): boolean {
  if (!signatureHeader || !signingKey) return false
  const parts = signatureHeader.split(',').map((p) => p.trim())
  let timestamp = ''
  let v1 = ''
  for (const p of parts) {
    if (p.startsWith('t=')) timestamp = p.slice(2)
    if (p.startsWith('v1=')) v1 = p.slice(3)
  }
  if (!timestamp || !v1) return false
  const signedPayload = `${timestamp}.${rawBody}`
  const expected = createHmac('sha256', signingKey).update(signedPayload, 'utf8').digest('hex')
  try {
    const a = Buffer.from(v1, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

function parseQuestionsPayload(questions: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!Array.isArray(questions)) return out
  for (const q of questions) {
    if (q && typeof q === 'object' && 'name' in q && 'answer' in q) {
      const name = String((q as { name: string }).name || '')
      const answer = String((q as { answer: string }).answer || '')
      if (name && answer) out[name] = answer
    }
  }
  return out
}

export const handler: Handler = async (event) => {
  const headers = responseHeaders()
  const method =
    (event as { requestContext?: { http?: { method?: string } } }).requestContext?.http?.method ||
    (event as { httpMethod?: string }).httpMethod ||
    ''

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (method !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const rawBody = typeof (event as { body?: string }).body === 'string' ? (event as { body: string }).body : ''
  const signingKey = (process.env.CALENDLY_WEBHOOK_SIGNING_KEY || '').trim()
  const sigHeader =
    (event as { headers?: Record<string, string> }).headers?.['Calendly-Webhook-Signature'] ||
    (event as { headers?: Record<string, string> }).headers?.['calendly-webhook-signature']

  if (signingKey) {
    if (!verifyCalendlySignature(rawBody, sigHeader, signingKey)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid signature' }) }
    }
  }

  let parsed: { event?: string; payload?: Record<string, unknown> }
  try {
    parsed = rawBody ? JSON.parse(rawBody) : {}
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const eventName = typeof parsed.event === 'string' ? parsed.event : ''
  const payload = parsed.payload && typeof parsed.payload === 'object' ? parsed.payload : {}

  const scheduledEvent = payload.scheduled_event as Record<string, unknown> | undefined
  const inviteeObj = payload.invitee as Record<string, unknown> | string | undefined
  const invitee =
    typeof inviteeObj === 'object' && inviteeObj != null ? inviteeObj : undefined

  const questionsRaw =
    (payload as { questions_and_answers?: unknown }).questions_and_answers ??
    (scheduledEvent?.event_memberships as Array<{ questions_and_answers?: unknown }> | undefined)?.[0]
      ?.questions_and_answers

  const qa = parseQuestionsPayload(questionsRaw)
  const subjectId = qa['Subject ID'] || qa['a1'] || qa['subjectId'] || ''
  const assessmentId = qa['Assessment ID'] || qa['a2'] || qa['assessmentId'] || ''
  const ownerSub = qa['Owner'] || qa['a3'] || qa['ownerSub'] || ''

  const inviteeUri =
    typeof invitee?.uri === 'string'
      ? invitee.uri
      : typeof inviteeObj === 'string'
        ? inviteeObj
        : typeof (payload as { uri?: string }).uri === 'string'
          ? (payload as { uri: string }).uri
          : ''

  const eventUri =
    typeof scheduledEvent?.uri === 'string'
      ? (scheduledEvent.uri as string)
      : typeof (payload as { event?: string }).event === 'string'
        ? (payload as { event: string }).event
        : ''

  const startTime =
    typeof scheduledEvent?.start_time === 'string' ? scheduledEvent.start_time : null
  const endTime = typeof scheduledEvent?.end_time === 'string' ? scheduledEvent.end_time : null
  const eventTitle =
    typeof scheduledEvent?.name === 'string'
      ? scheduledEvent.name
      : typeof (scheduledEvent as { event_type?: { name?: string } })?.event_type?.name === 'string'
        ? (scheduledEvent as { event_type: { name: string } }).event_type.name
        : 'Consultation'

  const cancelUrl =
    typeof (payload as { cancel_url?: string }).cancel_url === 'string'
      ? (payload as { cancel_url: string }).cancel_url
      : ''
  const rescheduleUrl =
    typeof (payload as { reschedule_url?: string }).reschedule_url === 'string'
      ? (payload as { reschedule_url: string }).reschedule_url
      : ''

  const isCanceled =
    eventName.includes('canceled') ||
    eventName.includes('cancelled') ||
    eventName === 'invitee.canceled'

  const status = isCanceled ? 'canceled' : 'scheduled'

  if (!subjectId || !ownerSub) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, skipped: true, reason: 'missing_subject_or_owner' }),
    }
  }

  const client = await getDataClient()
  const now = new Date().toISOString()

  let row: { id?: string | null } | undefined
  if (inviteeUri) {
    const { data: owned } = await client.models.ConsultAppointment.list({
      filter: { owner: { eq: ownerSub } },
      limit: 100,
    })
    row = owned?.find((r) => r.calendlyInviteeUri === inviteeUri)
  }
  if (!row && assessmentId) {
    const { data: owned } = await client.models.ConsultAppointment.list({
      filter: { owner: { eq: ownerSub } },
      limit: 100,
    })
    row = owned
      ?.filter((r) => r.subjectId === subjectId)
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return tb - ta
      })
      .find((r) => r.status === 'pending' || !r.calendlyInviteeUri)
  }

  const patch = {
    owner: ownerSub,
    subjectId,
    assessmentId: assessmentId || undefined,
    eventName: eventTitle,
    startTime: startTime || undefined,
    endTime: endTime || undefined,
    status,
    calendlyInviteeUri: inviteeUri || undefined,
    calendlyEventUri: eventUri || undefined,
    cancelUrl: cancelUrl || undefined,
    rescheduleUrl: rescheduleUrl || undefined,
  }

  if (row?.id) {
    const { errors } = await client.models.ConsultAppointment.update({
      id: row.id,
      ...patch,
    })
    if (errors?.length) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: errors.map((e) => e.message).join('; ') }),
      }
    }
  } else {
    const { errors } = await client.models.ConsultAppointment.create({
      ...patch,
      createdAt: now,
    })
    if (errors?.length) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: errors.map((e) => e.message).join('; ') }),
      }
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true, event: eventName }) }
}
