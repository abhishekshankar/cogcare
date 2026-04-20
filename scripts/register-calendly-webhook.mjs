#!/usr/bin/env node
/**
 * One-time: register Calendly webhook → your Amplify Lambda Function URL.
 *
 * Prerequisites:
 * - Personal access token from Calendly (API & Webhooks)
 * - `custom.calendlyWebhookFunctionUrl` from deployed amplify_outputs.json (HTTPS)
 *
 * Usage:
 *   CALENDLY_PAT="..." WEBHOOK_URL="https://....lambda-url....amazonaws.com/" node scripts/register-calendly-webhook.mjs
 *
 * Optional:
 *   SCOPE=organization   (default) or user
 *
 * If GET /users/me fails with 403 (Insufficient scope): regenerate your PAT in Calendly and enable
 * the **users:read** scope (and any scopes Calendly lists for "Webhooks" / API access).
 *
 * Or skip /users/me by passing URIs you copied from the Calendly API docs / another API response:
 *   CALENDLY_ORG_URI="https://api.calendly.com/organizations/XXXX"   (for SCOPE=organization)
 *   CALENDLY_USER_URI="https://api.calendly.com/users/YYYY"          (for SCOPE=user)
 *
 * After success, copy `signing_key` from the JSON output into Lambda env CALENDLY_WEBHOOK_SIGNING_KEY.
 */

const PAT = process.env.CALENDLY_PAT?.trim()
const WEBHOOK_URL = process.env.WEBHOOK_URL?.trim()
const SCOPE = (process.env.SCOPE || 'organization').toLowerCase()
const ENV_ORG_URI = process.env.CALENDLY_ORG_URI?.trim()
const ENV_USER_URI = process.env.CALENDLY_USER_URI?.trim()

const EVENTS = ['invitee.created', 'invitee.canceled']

function printScopeHelp() {
  console.error(`
Calendly returned 403 Insufficient scope for GET /users/me.

Fix (pick one):
  A) In Calendly Developer / Integrations: create a NEW Personal Access Token and enable scope:
     **users:read** (and webhook-related scopes if offered in the UI).
  B) Skip /users/me by setting env vars with full HTTPS URIs from Calendly:
     Organization webhook:
       CALENDLY_ORG_URI="https://api.calendly.com/organizations/<id>"
     User-scoped webhook:
       SCOPE=user CALENDLY_USER_URI="https://api.calendly.com/users/<uuid>"
`)
}

async function main() {
  if (!PAT) {
    console.error('Missing CALENDLY_PAT')
    process.exit(1)
  }
  if (!WEBHOOK_URL?.startsWith('https://')) {
    console.error('Missing or invalid WEBHOOK_URL (must be https://)')
    process.exit(1)
  }

  const base = { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' }

  let userUri = ENV_USER_URI
  let orgUri = ENV_ORG_URI

  /** Need /users/me unless the right URI was supplied via env for this scope. */
  const needFetch = SCOPE === 'user' ? !userUri : !orgUri

  if (needFetch) {
    const meRes = await fetch('https://api.calendly.com/users/me', { headers: base })
    const meText = await meRes.text()
    if (!meRes.ok) {
      console.error('GET /users/me failed:', meRes.status, meText.slice(0, 800))
      if (meRes.status === 403) printScopeHelp()
      process.exit(1)
    }
    const me = JSON.parse(meText)
    userUri = userUri || me?.resource?.uri
    orgUri = orgUri || me?.resource?.current_organization
  }

  if (SCOPE === 'user') {
    if (!userUri) {
      console.error('Missing user URI. Set CALENDLY_USER_URI or use a PAT with users:read and omit CALENDLY_*_URI.')
      process.exit(1)
    }
  } else {
    if (!orgUri) {
      console.error('Missing organization URI. Set CALENDLY_ORG_URI or use a PAT with users:read.')
      process.exit(1)
    }
  }

  const body = {
    url: WEBHOOK_URL,
    events: EVENTS,
    scope: SCOPE === 'user' ? 'user' : 'organization',
  }
  if (body.scope === 'organization') {
    body.organization = orgUri
  } else {
    body.user = userUri
  }

  const postRes = await fetch('https://api.calendly.com/webhook_subscriptions', {
    method: 'POST',
    headers: base,
    body: JSON.stringify(body),
  })
  const postText = await postRes.text()
  let data
  try {
    data = JSON.parse(postText)
  } catch {
    console.error('Non-JSON response:', postRes.status, postText.slice(0, 800))
    process.exit(1)
  }

  if (!postRes.ok) {
    console.error('POST /webhook_subscriptions failed:', postRes.status, JSON.stringify(data, null, 2))
    process.exit(1)
  }

  console.log('OK — webhook subscription created. Save the signing key to Lambda CALENDLY_WEBHOOK_SIGNING_KEY:\n')
  console.log(JSON.stringify(data, null, 2))

  const key = data?.resource?.signing_key
  if (key) {
    console.log('\n---\nSigning key (same as above if present):\n', key, '\n---')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
