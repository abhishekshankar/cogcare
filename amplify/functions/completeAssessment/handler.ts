import type { Handler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { randomBytes } from 'crypto'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import type { Schema } from '../../data/resource'
import { buildBhiReportEmailHtml, escapeHtml } from '../../../lib/bhiReportEmailHtml.js'
import { computeBrainCreditFromResults } from '../../../lib/brainCredit.js'

const cognito = new CognitoIdentityProviderClient({})

/** Lambda injects data env at runtime; avoid `$amplify/env/*` (virtual import) so CDK/esbuild can bundle. */
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

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    // Match Function URL CORS in amplify/backend.ts (preflight may request these headers).
    'Access-Control-Allow-Headers': 'content-type, authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }
}

function generateTempPassword() {
  return randomBytes(12).toString('base64url').slice(0, 16) + 'Aa1!'
}

async function sendBrevoEmail(params: {
  apiKey: string
  senderEmail: string
  senderName: string
  to: string
  subject: string
  html: string
}) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': params.apiKey,
    },
    body: JSON.stringify({
      sender: { name: params.senderName, email: params.senderEmail },
      to: [{ email: params.to }],
      subject: params.subject,
      htmlContent: params.html,
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Brevo error: ${res.status} ${t.slice(0, 200)}`)
  }
}

function getSubFromAttributes(attrs?: Array<{ Name?: string; Value?: string }>) {
  return attrs?.find((a) => a.Name === 'sub')?.Value ?? ''
}

async function resolveSub(
  poolId: string,
  username: string,
  userFromCreate?: { Attributes?: Array<{ Name?: string; Value?: string }> },
): Promise<string> {
  let sub = getSubFromAttributes(userFromCreate?.Attributes)
  if (sub) return sub
  const out = await cognito.send(
    new AdminGetUserCommand({
      UserPoolId: poolId,
      Username: username,
    }),
  )
  sub = getSubFromAttributes(out.UserAttributes)
  return sub
}

const DAILY_CAP = 3

/** Data client from `getDataClient()` — avoid explicit Schema generic here (TS stack depth). */
async function recordOnboardingHit(
  client: { models: { OnboardingAttempt: { update: (input: unknown) => Promise<unknown>; create: (input: unknown) => Promise<unknown> } } },
  attemptRow: { slotKey: string; hitCount?: number | null } | null,
  slotKey: string,
) {
  const nextHits = (attemptRow?.hitCount ?? 0) + 1
  if (attemptRow) {
    const { errors: upErr } = await client.models.OnboardingAttempt.update({
      slotKey,
      hitCount: nextHits,
    })
    if (upErr?.length) {
      throw new Error(upErr.map((e) => e.message).join('; '))
    }
  } else {
    const { errors: crErr } = await client.models.OnboardingAttempt.create({
      slotKey,
      hitCount: 1,
    })
    if (crErr?.length) {
      throw new Error(crErr.map((e) => e.message).join('; '))
    }
  }
}

export const handler: Handler = async (event) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
  const headers = corsHeaders(allowedOrigin)

  const method =
    (event as { requestContext?: { http?: { method?: string } } }).requestContext
      ?.http?.method || (event as { httpMethod?: string }).httpMethod || ''

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

  const poolId = process.env.USER_POOL_ID
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'CogCare'

  if (!poolId || !apiKey || !senderEmail) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Server configuration incomplete' }),
    }
  }

  let body: {
    email?: string
    results?: Record<string, unknown>
    answers?: Record<string, number>
  }
  try {
    const raw = (event as { body?: string }).body
    body = typeof raw === 'string' ? JSON.parse(raw || '{}') : {}
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    }
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const results = body.results ?? null
  const answers = body.answers && typeof body.answers === 'object' ? body.answers : {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid email' }),
    }
  }

  const slotKey = `${email}#${new Date().toISOString().slice(0, 10)}`
  const client = await getDataClient()
  const { data: attemptRow } = await client.models.OnboardingAttempt.get({ slotKey })
  if (attemptRow && (attemptRow.hitCount ?? 0) >= DAILY_CAP) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: 'Too many attempts for this email today. Try again tomorrow or sign in.',
        code: 'RATE_LIMIT',
      }),
    }
  }

  const tempPassword = generateTempPassword()
  const reportHtml = buildBhiReportEmailHtml(results, { footerSource: 'CogCare' })
  const credit = computeBrainCreditFromResults(results, { completedAssessmentCount: 1 })

  let createdUsername: string | null = null

  try {
    const createOut = await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: poolId,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
        TemporaryPassword: tempPassword,
        MessageAction: 'SUPPRESS',
      }),
    )
    createdUsername = email
    const sub = await resolveSub(poolId, email, createOut.User ?? undefined)
    if (!sub) {
      throw new Error('Missing Cognito sub after user creation')
    }

    const completedAt = new Date().toISOString()
    const createdAt = completedAt

    const { errors: profileErrors } = await client.models.UserProfile.create({
      displayName: email.split('@')[0] || 'Member',
      brainCreditScore: credit,
      createdAt,
      owner: sub,
    })
    if (profileErrors?.length) {
      throw new Error(profileErrors.map((e) => e.message).join('; '))
    }

    const { errors: assessmentErrors } = await client.models.Assessment.create({
      type: 'BHI',
      answersJson: JSON.stringify(answers),
      resultsJson: JSON.stringify(results ?? {}),
      completedAt,
      owner: sub,
    })
    if (assessmentErrors?.length) {
      throw new Error(assessmentErrors.map((e) => e.message).join('; '))
    }

    await sendBrevoEmail({
      apiKey,
      senderEmail,
      senderName,
      to: email,
      subject: 'Your Brain Health Index results',
      html: reportHtml,
    })

    await sendBrevoEmail({
      apiKey,
      senderEmail,
      senderName,
      to: email,
      subject: 'Your CogCare dashboard login',
      html: `
<!DOCTYPE html>
<html><body style="font-family:sans-serif;color:#1A1A1A;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#3D4B3E;">Welcome to CogCare</h1>
  <p>Use these credentials to sign in and view your dashboard:</p>
  <p><strong>Username (email):</strong> ${escapeHtml(email)}</p>
  <p><strong>Temporary password:</strong> ${escapeHtml(tempPassword)}</p>
  <p>You will be asked to create a new password after you sign in.</p>
  <p style="color:#666;font-size:14px;">If you did not request this, you can ignore this email.</p>
</body></html>`,
    })

    await recordOnboardingHit(client, attemptRow, slotKey)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, scenario: 'new_user', nextStep: 'SIGN_IN' }),
    }
  } catch (e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'name' in e &&
      (e as { name: string }).name === 'UsernameExistsException'
    ) {
      try {
        const sub = await resolveSub(poolId, email)
        if (!sub) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Could not resolve account for this email.' }),
          }
        }

        const { data: existingAssessments, errors: assessListErr } =
          await client.models.Assessment.list({
            filter: { owner: { eq: sub } },
          })
        if (assessListErr?.length) {
          throw new Error(assessListErr.map((x) => x.message).join('; '))
        }
        const priorCount = existingAssessments?.length ?? 0
        const nextCount = priorCount + 1
        const newCredit = computeBrainCreditFromResults(results, {
          completedAssessmentCount: nextCount,
        })
        const completedAt = new Date().toISOString()

        const { data: profiles, errors: profileListErr } = await client.models.UserProfile.list({
          filter: { owner: { eq: sub } },
          limit: 1,
        })
        if (profileListErr?.length) {
          throw new Error(profileListErr.map((x) => x.message).join('; '))
        }
        const profileRow = profiles?.[0]
        if (profileRow?.id) {
          const { errors: upProfErr } = await client.models.UserProfile.update({
            id: profileRow.id,
            brainCreditScore: newCredit,
          })
          if (upProfErr?.length) {
            throw new Error(upProfErr.map((x) => x.message).join('; '))
          }
        } else {
          const { errors: createProfErr } = await client.models.UserProfile.create({
            displayName: email.split('@')[0] || 'Member',
            brainCreditScore: newCredit,
            createdAt: completedAt,
            owner: sub,
          })
          if (createProfErr?.length) {
            throw new Error(createProfErr.map((x) => x.message).join('; '))
          }
        }

        const { errors: assessmentErrors } = await client.models.Assessment.create({
          type: 'BHI',
          answersJson: JSON.stringify(answers),
          resultsJson: JSON.stringify(results ?? {}),
          completedAt,
          owner: sub,
        })
        if (assessmentErrors?.length) {
          throw new Error(assessmentErrors.map((x) => x.message).join('; '))
        }

        await sendBrevoEmail({
          apiKey,
          senderEmail,
          senderName,
          to: email,
          subject: 'Your Brain Health Index results',
          html: reportHtml,
        })

        await recordOnboardingHit(client, attemptRow, slotKey)

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ ok: true, scenario: 'existing_user', nextStep: 'SIGN_IN' }),
        }
      } catch (inner: unknown) {
        const message = inner instanceof Error ? inner.message : 'Unexpected error'
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: message }),
        }
      }
    }

    if (createdUsername) {
      try {
        await cognito.send(
          new AdminDeleteUserCommand({
            UserPoolId: poolId,
            Username: createdUsername,
          }),
        )
      } catch {
        /* best-effort rollback */
      }
    }

    const message = e instanceof Error ? e.message : 'Unexpected error'
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: message }),
    }
  }
}
