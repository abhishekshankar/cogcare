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
    return event
  }

  const username = (event.userName || event.request.userAttributes?.email || '').trim().toLowerCase()
  const tokenHash = hashToken(answer)

  try {
    const client = await getDataClient()
    const { data: row, errors } = await client.models.MagicLinkToken.get({ tokenHash })
    if (errors?.length || !row) {
      return event
    }

    const email = typeof row.email === 'string' ? row.email.trim().toLowerCase() : ''
    if (email !== username) {
      return event
    }
    if (row.used) {
      return event
    }
    const exp = row.expiresAt ? new Date(String(row.expiresAt)).getTime() : 0
    if (!exp || Number.isNaN(exp) || Date.now() > exp) {
      return event
    }

    const { errors: upErr } = await client.models.MagicLinkToken.update({
      tokenHash,
      used: true,
    })
    if (upErr?.length) {
      return event
    }

    event.response.answerCorrect = true
  } catch {
    event.response.answerCorrect = false
  }
  return event
}
