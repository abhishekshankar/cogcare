import { sortBriefingsNewestFirst } from '../../lib/networkBriefings.js'
import {
  isKnownOpportunity,
  NETWORK_OPPORTUNITIES,
  validateOpportunityResponse,
} from '../../lib/networkOpportunities.js'
import { sortContributionsNewestFirst } from '../../lib/networkContributions.js'
import { filterOpportunitiesForVentures } from '../../lib/networkVentureAssociation.js'
import { isE2eNetworkMocksEnabled } from '../lib/e2eNetworkMocks.js'
import { callNetworkApi, getNetworkApiUrl } from './networkApiClient.js'

/** @type {Map<string, { opportunityId: string, kind: string, respondedAt: string }[]>} */
const e2eOpportunityResponses = new Map()

/** @type {Map<string, import('../../lib/networkContributions.js').NetworkContribution[]>} */
const e2eContributions = new Map()

function isE2eMemberApiConfigured() {
  const url = getNetworkApiUrl('member')
  return Boolean(url && url.includes('/__e2e__/network-member-api'))
}

export async function fetchMemberWorkspace() {
  const url = getNetworkApiUrl('member')
  if (!url) return null
  if (isE2eNetworkMocksEnabled() && !isE2eMemberApiConfigured()) return null
  const body = await callNetworkApi('member', { operation: 'workspace' })
  return body.workspace ?? null
}

/**
 * @param {string} email
 * @returns {import('../../lib/networkBriefings.js').NetworkBriefing[]}
 */
export function fetchMemberBriefings(email) {
  void email
  return sortBriefingsNewestFirst()
}

/**
 * @param {string} email
 * @param {string[]} [ventureAssociations]
 * @returns {import('../../lib/networkOpportunities.js').NetworkOpportunity[]}
 */
export function fetchMemberOpportunities(email, ventureAssociations = ['cogcare']) {
  void email
  return filterOpportunitiesForVentures(NETWORK_OPPORTUNITIES, ventureAssociations)
}

/**
 * @param {string} email
 * @returns {Promise<import('../../lib/networkContributions.js').NetworkContribution[]>}
 */
export async function fetchMemberContributions(email) {
  if (isE2eNetworkMocksEnabled()) {
    return sortContributionsNewestFirst(e2eContributions.get(email) ?? [])
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    try {
      const res = await fetch(`/api/network-member-contributions?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const body = await res.json()
        return sortContributionsNewestFirst(body?.contributions)
      }
    } catch {
      /* fall through */
    }
  }

  return []
}

/**
 * @param {string} email
 * @returns {Promise<{ opportunityId: string, kind: string, respondedAt: string }[]>}
 */
export async function fetchOpportunityResponses(email) {
  if (isE2eNetworkMocksEnabled()) {
    return e2eOpportunityResponses.get(email) ?? []
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    try {
      const res = await fetch(
        `/api/network-member-opportunity-response?email=${encodeURIComponent(email)}`,
      )
      if (res.ok) {
        const body = await res.json()
        return Array.isArray(body?.responses) ? body.responses : []
      }
    } catch {
      /* fall through */
    }
  }

  return []
}

/**
 * @param {string} email
 * @param {string} opportunityId
 * @param {string} kind
 * @returns {Promise<{ ok: true, response: object } | { ok: false, error: string }>}
 */
export async function submitOpportunityResponse(email, opportunityId, kind) {
  const memberApiUrl = getNetworkApiUrl('member')
  const useRealApi = memberApiUrl && (!isE2eNetworkMocksEnabled() || isE2eMemberApiConfigured())
  if (useRealApi) {
    const response = kind === 'interest' ? 'interested' : kind
    try {
      const body = await callNetworkApi('member', { operation: 'respondOpportunity', opportunityId, response })
      return { ok: true, response: { ...body.response, kind: body.response?.response === 'interested' ? 'interest' : body.response?.response } }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Could not save your response.' }
    }
  }
  const validation = validateOpportunityResponse(kind)
  if (!validation.ok) return validation

  if (!isKnownOpportunity(opportunityId)) {
    return { ok: false, error: 'This opportunity is no longer available.' }
  }

  const response = {
    opportunityId,
    kind: validation.value,
    respondedAt: new Date().toISOString(),
  }

  if (isE2eNetworkMocksEnabled()) {
    const existing = e2eOpportunityResponses.get(email) ?? []
    const next = [...existing.filter((r) => r.opportunityId !== opportunityId), response]
    e2eOpportunityResponses.set(email, next)
    return { ok: true, response }
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    const res = await fetch('/api/network-member-opportunity-response', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, ...response }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = typeof body?.error === 'string' ? body.error : 'Could not save your response.'
      return { ok: false, error: msg }
    }
    return { ok: true, response: body.response ?? response }
  }

  return { ok: true, response }
}

/** @internal E2E test helper */
export function __seedE2eContribution(email, contribution) {
  const list = e2eContributions.get(email) ?? []
  e2eContributions.set(email, [...list, contribution])
}

/** @internal E2E test reset */
export function __resetE2eMemberContent() {
  e2eOpportunityResponses.clear()
  e2eContributions.clear()
}
