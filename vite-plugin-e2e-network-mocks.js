/**
 * Playwright-only mocks for Cognition Network invite + accept flows.
 * Enabled when COGCARE_E2E_MOCKS=1 (see playwright.config.js).
 */

import { createHash } from 'node:crypto'
import {
  memberProfilePatchFromValidated,
  validateNetworkMemberProfile,
} from './lib/networkMemberProfile.js'

const E2E_INVITE_TOKEN = 'e2e-founders-token'
const E2E_INVITE_TOKEN_HASH = createHash('sha256').update(E2E_INVITE_TOKEN, 'utf8').digest('hex')

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res, code, data) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(data))
}

const MOCK_MEMBER_CONSULTANT = {
  id: 'e2e-consultant-1',
  name: 'Dr. Pat Kim',
  slug: 'dr-pat-kim',
  title: 'Behavioral neurologist',
  organization: 'CogCare',
  contactEmail: 'founder@example.com',
  networkCohort: 'founding',
  networkRoleCategory: 'physician',
  networkBrandsJson: '["cogcare"]',
  participationMode: 'passive',
  profileVisibility: 'private',
  ventureAssociationsJson: '["cogcare"]',
  communicationPreference: 'none',
  isActive: false,
  __typename: 'Consultant',
}

/** @type {typeof MOCK_MEMBER_CONSULTANT} */
let e2eMemberConsultant = { ...MOCK_MEMBER_CONSULTANT }

/** @type {Record<string, { opportunityId: string, kind: string, respondedAt: string }[]>} */
const e2eOpportunityResponses = {}

function getE2eEmailFromBody(body) {
  return typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
}

const MOCK_INVITATION = {
  tokenHash: E2E_INVITE_TOKEN_HASH,
  email: 'founder@example.com',
  inviteeName: 'Dr. Pat Kim',
  cohort: 'founding',
  roleCategory: 'physician',
  brandsJson: '["cogcare"]',
  status: 'pending',
  expiresAt: '2030-01-01T00:00:00.000Z',
  createdAt: '2026-07-31T12:00:00.000Z',
  __typename: 'NetworkInvitation',
}

export function e2eNetworkMocksPlugin() {
  const enabled = process.env.COGCARE_E2E_MOCKS === '1'
  return {
    name: 'cogcare-e2e-network-mocks',
    configureServer(server) {
      if (!enabled) return

      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || '').split('?')[0]

        if (pathname === '/__e2e__/graphql' && req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Headers', 'content-type,x-api-key,authorization')
          res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
          res.statusCode = 204
          return res.end()
        }

        if (pathname === '/__e2e__/graphql' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }

          const query = String(body.query || '')
          const variables = body.variables && typeof body.variables === 'object' ? body.variables : {}
          if (query.includes('listConsultant')) {
            return sendJson(res, 200, {
              data: { listConsultants: { items: [e2eMemberConsultant], nextToken: null } },
            })
          }
          if (query.includes('NetworkInvitation')) {
            const tokenHash = String(variables.tokenHash || '')
            if (tokenHash !== E2E_INVITE_TOKEN_HASH) {
              return sendJson(res, 200, { data: { getNetworkInvitation: null } })
            }
            return sendJson(res, 200, { data: { getNetworkInvitation: MOCK_INVITATION } })
          }

          return sendJson(res, 200, { data: {} })
        }

        if (pathname === '/__e2e__/accept-network-invitation' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          if (!body.token || !body.onboarding) {
            return sendJson(res, 400, { error: 'token and onboarding are required.' })
          }
          return sendJson(res, 200, {
            ok: true,
            consultantId: 'e2e-consultant-1',
            slug: 'dr-pat-kim',
          })
        }

        if (pathname === '/__e2e__/network-public-data' && req.method === 'GET') {
          const url = new URL(req.url || '', 'http://localhost')
          if (url.searchParams.get('directory') === '1') {
            return sendJson(res, 200, {
              consultants: [
                {
                  id: e2eMemberConsultant.id,
                  name: e2eMemberConsultant.name,
                  title: e2eMemberConsultant.title,
                  bio: e2eMemberConsultant.bio,
                  bookingUrl: e2eMemberConsultant.bookingUrl,
                  isActive: true,
                  profileVisibility: 'public',
                  publicNameConsentAt: '2026-07-01T00:00:00.000Z',
                },
              ],
            })
          }
          if (url.searchParams.get('token') === E2E_INVITE_TOKEN) {
            return sendJson(res, 200, { invitation: MOCK_INVITATION })
          }
          return sendJson(res, 404, { error: 'Not found.' })
        }

        if (pathname === '/__e2e__/update-network-member-profile' && req.method === 'GET') {
          return sendJson(res, 200, { ok: true, consultant: e2eMemberConsultant })
        }

        if (
          pathname === '/__e2e__/update-network-member-profile' &&
          req.method === 'POST'
        ) {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          const validation = validateNetworkMemberProfile(body.form || {})
          if (!validation.ok) {
            return sendJson(res, 400, { error: validation.error })
          }
          const patch = memberProfilePatchFromValidated(validation.value)
          e2eMemberConsultant = {
            ...e2eMemberConsultant,
            ...patch,
            contactEmail: e2eMemberConsultant.contactEmail,
          }
          return sendJson(res, 200, { ok: true, consultant: e2eMemberConsultant })
        }

        if (pathname === '/api/network-member-profile' && req.method === 'GET') {
          const url = new URL(req.url || '', 'http://localhost')
          const email = (url.searchParams.get('email') || '').trim().toLowerCase()
          if (!email) {
            return sendJson(res, 400, { error: 'email query parameter is required.' })
          }
          if (email !== e2eMemberConsultant.contactEmail?.toLowerCase()) {
            return sendJson(res, 404, { error: 'No membership record found.' })
          }
          return sendJson(res, 200, { ok: true, consultant: e2eMemberConsultant })
        }

        if (pathname === '/api/network-member-profile' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          const email = getE2eEmailFromBody(body)
          const validation = validateNetworkMemberProfile(body.form || {})
          if (!validation.ok) {
            return sendJson(res, 400, { error: validation.error })
          }
          const patch = memberProfilePatchFromValidated(validation.value)
          e2eMemberConsultant = { ...e2eMemberConsultant, ...patch, contactEmail: email || e2eMemberConsultant.contactEmail }
          return sendJson(res, 200, { ok: true, consultant: e2eMemberConsultant })
        }

        if (
          pathname === '/api/network-member-opportunity-response' &&
          (req.method === 'POST' || req.method === 'GET')
        ) {
          if (req.method === 'GET') {
            const url = new URL(req.url || '', 'http://localhost')
            const email = (url.searchParams.get('email') || '').trim().toLowerCase()
            return sendJson(res, 200, { ok: true, responses: e2eOpportunityResponses[email] ?? [] })
          }
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          const email = getE2eEmailFromBody(body)
          const response = {
            opportunityId: body.opportunityId,
            kind: body.kind,
            respondedAt: new Date().toISOString(),
          }
          const existing = e2eOpportunityResponses[email] ?? []
          e2eOpportunityResponses[email] = [
            ...existing.filter((r) => r.opportunityId !== response.opportunityId),
            response,
          ]
          return sendJson(res, 200, { ok: true, response })
        }

        if (pathname === '/api/network-member-contributions' && req.method === 'GET') {
          return sendJson(res, 200, { ok: true, contributions: [] })
        }

        return next()
      })
    },
  }
}
