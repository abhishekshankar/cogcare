import type { Handler } from 'aws-lambda'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { buildNetworkInvitationEmailHtml } from '../../../lib/networkInvitationEmailHtml.js'

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.USER_POOL_CLIENT_ID!,
})
const headers = { 'Content-Type': 'application/json' }
const reply = (statusCode: number, body: object) => ({ statusCode, headers, body: JSON.stringify(body) })
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const handler: Handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (event.requestContext?.http?.method !== 'POST') return reply(405, { error: 'Method not allowed.' })

  const authHeader = event.headers?.authorization || event.headers?.Authorization || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  let claims: Record<string, unknown>
  try {
    claims = await verifier.verify(bearer)
  } catch {
    return reply(401, { error: 'Your sign-in session is invalid or expired.' })
  }
  const groups = Array.isArray(claims['cognito:groups']) ? claims['cognito:groups'] : []
  if (!groups.includes('admin')) return reply(403, { error: 'Administrator access required.' })

  let body: Record<string, unknown>
  try {
    body = event.body ? JSON.parse(event.body) : {}
  } catch {
    return reply(400, { error: 'Invalid JSON body.' })
  }
  const to = typeof body.to === 'string' ? body.to.trim().toLowerCase() : ''
  const inviteUrl = typeof body.inviteUrl === 'string' ? body.inviteUrl.trim() : ''
  if (!emailPattern.test(to)) return reply(400, { error: 'A valid recipient email is required.' })
  let parsedUrl: URL
  try {
    parsedUrl = new URL(inviteUrl)
  } catch {
    return reply(400, { error: 'A valid invitation URL is required.' })
  }
  if (parsedUrl.protocol !== 'https:' || !parsedUrl.pathname.startsWith('/network/invite/')) {
    return reply(400, { error: 'Invitation URL is not allowed.' })
  }
  const appOrigin = new URL(process.env.APP_BASE_URL || 'http://localhost:5173').origin
  if (parsedUrl.origin !== appOrigin) return reply(400, { error: 'Invitation URL origin is not allowed.' })

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  if (!apiKey || !senderEmail) return reply(503, { error: 'Invitation email delivery is not configured.' })
  const htmlContent = buildNetworkInvitationEmailHtml({
    inviteUrl,
    inviteeName: typeof body.inviteeName === 'string' ? body.inviteeName : undefined,
    personalNote: typeof body.personalNote === 'string' ? body.personalNote : undefined,
    roleCategory: typeof body.roleCategory === 'string' ? body.roleCategory : undefined,
    brands: Array.isArray(body.brands) ? body.brands.filter((v): v is string => typeof v === 'string') : [],
    invitedByName: typeof body.invitedByName === 'string' ? body.invitedByName : undefined,
  })

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      sender: { name: process.env.BREVO_SENDER_NAME || 'CogCare', email: senderEmail },
      to: [{ email: to }],
      subject: 'CogCare Cognition Network — founding invitation',
      htmlContent,
    }),
  })
  const result = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) {
    console.error(JSON.stringify({
      event: 'network_invitation_email_failed',
      providerStatus: response.status,
      providerCode: result.code,
      providerMessage: result.message,
    }))
    return reply(502, { error: 'Invitation email could not be delivered.' })
  }
  console.log(JSON.stringify({ event: 'network_invitation_email_sent', to, actor: claims.email, messageId: result.messageId }))
  return reply(200, { ok: true, messageId: result.messageId })
}
