import type { VerifyAuthChallengeResponseTriggerHandler } from 'aws-lambda'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { createHash } from 'crypto'
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

function hashToken(raw: string): string {
  return createHash('sha256').update(raw, 'utf8').digest('hex')
}

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  event.response.answerCorrect = false
  const answer = event.request.challengeAnswer?.trim() ?? ''
  if (!answer) {
    console.warn('[verify-magic-link] missing challengeAnswer')
    return event
  }

  /**
   * In Amplify Gen 2 with `loginWith.email`, the Cognito Username is an auto-generated
   * UUID (matches `sub`), not the email. Always prefer the verified email attribute
   * for comparing against the MagicLinkToken row.
   */
  const emailAttr = event.request.userAttributes?.email ?? ''
  const username = emailAttr.trim().toLowerCase()
  const tokenHash = hashToken(answer)

  try {
    const client = await getDataClient()
    const { data: row, errors } = await client.models.MagicLinkToken.get({ tokenHash })
    if (errors?.length || !row) {
      console.warn('[verify-magic-link] token not found', {
        userName: event.userName,
        emailAttr: username,
        errors: errors?.map((e) => e.message),
      })
      return event
    }

    const email = typeof row.email === 'string' ? row.email.trim().toLowerCase() : ''
    if (!username || email !== username) {
      console.warn('[verify-magic-link] email mismatch', {
        rowEmail: email,
        emailAttr: username,
        userName: event.userName,
      })
      return event
    }
    if (row.used) {
      console.warn('[verify-magic-link] token already used', { email })
      return event
    }
    const exp = row.expiresAt ? new Date(String(row.expiresAt)).getTime() : 0
    if (!exp || Number.isNaN(exp) || Date.now() > exp) {
      console.warn('[verify-magic-link] token expired', { email, expiresAt: row.expiresAt })
      return event
    }

    const { errors: upErr } = await client.models.MagicLinkToken.update({
      tokenHash,
      used: true,
    })
    if (upErr?.length) {
      console.warn('[verify-magic-link] mark-used failed', {
        email,
        errors: upErr.map((e) => e.message),
      })
      return event
    }

    event.response.answerCorrect = true
  } catch (err) {
    console.error('[verify-magic-link] unexpected error', err)
    event.response.answerCorrect = false
  }
  return event
}
