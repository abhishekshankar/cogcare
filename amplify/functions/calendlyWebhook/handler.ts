import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { CognitoIdentityProviderClient, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { createHmac, timingSafeEqual } from 'crypto'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import type { Schema } from '../../data/resource'

const cognito = new CognitoIdentityProviderClient({})

/** Lambda injects data env at runtime. */
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

const MAX_SKEW_SEC = 300

function getRawBody(event: { body?: string | null; isBase64Encoded?: boolean }): string {
  const b = event.body ?? ''
  if (event.isBase64Encoded && b) {
    return Buffer.from(b, 'base64').toString('utf8')
  }
  return b
}

function headerMap(event: { headers?: Record<string, string | undefined> }): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(event.headers ?? {})) {
    if (v) out[k.toLowerCase()] = v
  }
  return out
}

/**
 * Calendly signs the webhook with HMAC-SHA256 over `${timestamp}.${rawBody}`.
 * Header: Calendly-Webhook-Signature: t=<unix>,v1=<hex>
 */
function verifyCalendlySignature(rawBody: string, signatureHeader: string | undefined, signingKey: string): boolean {
  if (!signatureHeader || !signingKey) return false
  let t = ''
  let v1 = ''
  for (const part of signatureHeader.split(',')) {
    const [k, ...rest] = part.trim().split('=')
    const val = rest.join('=')
    if (k === 't') t = val
    if (k === 'v1') v1 = val
  }
  if (!t || !v1) return false
  const ts = Number(t)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > MAX_SKEW_SEC) {
    return false
  }
  const signedPayload = `${t}.${rawBody}`
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

function pickStr(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

type ParsedInvitee = {
  inviteeUri?: string
  inviteeEmail?: string
  inviteeName?: string
  scheduledEventUri?: string
  status?: string
}

function parsePayload(body: Record<string, unknown>): { event: string; payload: ParsedInvitee } | null {
  const event = pickStr(body.event)
  if (!event) return null
  const p = body.payload
  if (!p || typeof p !== 'object') return { event, payload: {} }

  const pl = p as Record<string, unknown>
  const inviteeEmail =
    pickStr(pl.email) ||
    pickStr((pl.invitee as Record<string, unknown> | undefined)?.email) ||
    pickStr(pl.invitee_email)

  const inviteeObj = pl.invitee
  const inviteeUri =
    pickStr(pl.uri) ||
    (typeof inviteeObj === 'string' ? inviteeObj : pickStr((inviteeObj as Record<string, unknown>)?.uri))

  const ev = pl.event
  const scheduledEventUri =
    typeof ev === 'string' ? ev : pickStr((ev as Record<string, unknown> | undefined)?.uri)

  const name =
    pickStr(pl.name) ||
    [pickStr(pl.first_name), pickStr(pl.last_name)].filter(Boolean).join(' ').trim() ||
    undefined

  const status = pickStr(pl.status) || pickStr((pl.invitee as Record<string, unknown> | undefined)?.status)

  return {
    event,
    payload: {
      inviteeUri,
      inviteeEmail,
      inviteeName: name,
      scheduledEventUri,
      status,
    },
  }
}

async function enrichFromCalendlyApi(params: {
  token: string | undefined
  scheduledEventUri?: string
}): Promise<{ startTime?: string; endTime?: string; eventName?: string }> {
  const token = params.token?.trim()
  if (!token || !params.scheduledEventUri) return {}
  try {
    const res = await fetch(params.scheduledEventUri, {
      headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
    })
    if (!res.ok) return {}
    const json = (await res.json()) as { resource?: Record<string, unknown> }
    const r = json.resource
    if (!r) return {}
    return {
      startTime: pickStr(r.start_time),
      endTime: pickStr(r.end_time),
      eventName: pickStr(r.name),
    }
  } catch {
    return {}
  }
}

async function resolveSubByEmail(poolId: string, email: string): Promise<string | null> {
  try {
    const out = await cognito.send(
      new AdminGetUserCommand({
        UserPoolId: poolId,
        Username: email,
      }),
    )
    const sub = out.UserAttributes?.find((a) => a.Name === 'sub')?.Value
    return sub ?? null
  } catch {
    return null
  }
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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY?.trim() ?? ''
  const poolId = process.env.USER_POOL_ID?.trim() ?? ''
  const rawBody = getRawBody(event as { body?: string; isBase64Encoded?: boolean })
  const hdrs = headerMap(event as { headers?: Record<string, string | undefined> })
  const sig =
    hdrs['calendly-webhook-signature'] ||
    hdrs['Calendly-Webhook-Signature'.toLowerCase()]

  if (!verifyCalendlySignature(rawBody, sig, signingKey)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid signature' }),
    }
  }

  if (!poolId) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Server configuration incomplete' }),
    }
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody || '{}') as Record<string, unknown>
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    }
  }

  const parsed = parsePayload(body)
  if (!parsed) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing event' }),
    }
  }

  const { event: eventName, payload: pl } = parsed
  if (eventName !== 'invitee.created' && eventName !== 'invitee.canceled') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, ignored: true, event: eventName }),
    }
  }
  const calendlyToken = process.env.CALENDLY_API_TOKEN?.trim()

  let startTime: string | undefined
  let endTime: string | undefined
  let eventTitle: string | undefined

  if (pl.scheduledEventUri && calendlyToken) {
    const enriched = await enrichFromCalendlyApi({
      token: calendlyToken,
      scheduledEventUri: pl.scheduledEventUri,
    })
    startTime = enriched.startTime
    endTime = enriched.endTime
    eventTitle = enriched.eventName
  }

  const inviteeEmail = pl.inviteeEmail?.toLowerCase()
  const inviteeUri = pl.inviteeUri

  if (!inviteeUri) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, skipped: true, reason: 'missing_invitee_uri' }),
    }
  }

  if (!inviteeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteeEmail)) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        skipped: true,
        reason: 'missing_invitee_email',
        hint: 'Set CALENDLY_API_TOKEN on this function to load invitee via API if Calendly omits email.',
      }),
    }
  }

  const sub = await resolveSubByEmail(poolId, inviteeEmail)
  if (!sub) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, skipped: true, reason: 'no_cognito_user_for_email' }),
    }
  }

  const isCanceled = eventName === 'invitee.canceled'
  const rowStatus = isCanceled ? 'canceled' : 'scheduled'

  const client = await getDataClient()

  const { data: existingRow, errors: getErrors } = await client.models.ConsultAppointment.get({
    calendlyInviteeUri: inviteeUri,
  })
  if (getErrors?.length) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: getErrors.map((e) => e.message).join('; ') }),
    }
  }

  if (existingRow) {
    const nextInviteeName = pl.inviteeName ?? existingRow.inviteeName ?? undefined
    const nextEventUri = pl.scheduledEventUri ?? existingRow.calendlyScheduledEventUri ?? undefined
    const nextEventName = eventTitle ?? existingRow.eventName ?? undefined
    const nextStart = startTime ?? existingRow.startTime ?? undefined
    const nextEnd = endTime ?? existingRow.endTime ?? undefined

    const { errors } = await client.models.ConsultAppointment.update({
      calendlyInviteeUri: inviteeUri,
      status: rowStatus,
      inviteeEmail,
      ...(nextInviteeName ? { inviteeName: nextInviteeName } : {}),
      ...(nextEventUri ? { calendlyScheduledEventUri: nextEventUri } : {}),
      ...(nextEventName ? { eventName: nextEventName } : {}),
      ...(nextStart ? { startTime: nextStart } : {}),
      ...(nextEnd ? { endTime: nextEnd } : {}),
    })
    if (errors?.length) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: errors.map((e) => e.message).join('; ') }),
      }
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, action: 'updated' }),
    }
  }

  const { errors } = await client.models.ConsultAppointment.create({
    owner: sub,
    calendlyInviteeUri: inviteeUri,
    status: rowStatus,
    inviteeEmail,
    ...(pl.scheduledEventUri ? { calendlyScheduledEventUri: pl.scheduledEventUri } : {}),
    ...(pl.inviteeName ? { inviteeName: pl.inviteeName } : {}),
    ...(eventTitle ? { eventName: eventTitle } : {}),
    ...(startTime ? { startTime } : {}),
    ...(endTime ? { endTime } : {}),
  })

  if (errors?.length) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errors.map((e) => e.message).join('; ') }),
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, action: 'created' }),
  }
}
