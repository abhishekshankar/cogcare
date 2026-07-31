import {
  memberProfilePatchFromValidated,
  validateNetworkMemberProfile,
} from '../../lib/networkMemberProfile.js'
import { findMemberConsultantByEmail } from '../lib/networkMemberLookup.js'
import { isE2eDashboardAuthBypass } from '../lib/e2eNetworkMocks.js'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getMergedAmplifyOutputs } from '../lib/amplifyOutputs.js'
import { getDataClient } from '../lib/dataClient.js'

async function fetchConsultantsViaE2eGraphql() {
  const url = import.meta.env.VITE_GRAPHQL_URL
  if (!url) return []

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': import.meta.env.VITE_GRAPHQL_API_KEY || '',
    },
    body: JSON.stringify({
      query: 'query { listConsultants { items { id name slug title organization bio interests contactEmail networkCohort networkRoleCategory networkBrandsJson participationMode profileVisibility ventureAssociationsJson communicationPreference publicNameConsentAt professionalUrl bookingUrl isActive } } }',
    }),
  })
  const body = await res.json().catch(() => ({}))
  return body?.data?.listConsultants?.items ?? []
}

/**
 * @returns {string}
 */
function getMemberProfileUpdateUrl() {
  const fromEnv = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_UPDATE_NETWORK_MEMBER_PROFILE_URL : ''
  if (typeof fromEnv === 'string' && fromEnv.trim().startsWith('http')) {
    return fromEnv.trim()
  }
  const generated = getMergedAmplifyOutputs()?.custom?.updateNetworkMemberProfileFunctionUrl
  if (typeof generated === 'string' && generated.trim().startsWith('http')) return generated.trim()
  return ''
}

/**
 * @param {string} email
 * @returns {Promise<object | null>}
 */
export async function fetchMemberConsultantByEmail(email) {
  if (isE2eDashboardAuthBypass()) {
    const items = await fetchConsultantsViaE2eGraphql()
    return findMemberConsultantByEmail(items, email)
  }

  const { data } = await getDataClient().models.Consultant.list({ limit: 200 })
  return findMemberConsultantByEmail(data ?? [], email)
}

/**
 * @param {string} email
 * @param {object} form
 * @param {string} consultantId
 * @returns {Promise<{ ok: true, consultant: object } | { ok: false, error: string }>}
 */
async function updateMemberProfileDev(email, form, consultantId) {
  const res = await fetch('/api/network-member-profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, consultantId, form }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = typeof body?.error === 'string' ? body.error : `Could not save profile (${res.status}).`
    return { ok: false, error: msg }
  }
  return { ok: true, consultant: body.consultant }
}

/**
 * Production adapter — no authenticated Lambda writer yet.
 *
 * @param {string} email
 * @param {object} form
 * @param {string} consultantId
 * @returns {Promise<{ ok: true, consultant: object } | { ok: false, error: string }>}
 */
async function updateMemberProfileProduction(email, form, consultantId) {
  const configuredUrl = getMemberProfileUpdateUrl()
  const validation = validateNetworkMemberProfile(form)
  if (!validation.ok) return validation
  if (!configuredUrl) {
    return { ok: false, error: 'Profile updates are temporarily unavailable.' }
  }

  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()
  if (!idToken) return { ok: false, error: 'Please sign in again to update your profile.' }

  const res = await fetch(configuredUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ consultantId, form: validation.value }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: body?.error || `Could not save profile (${res.status}).` }
  }
  return { ok: true, consultant: body.consultant }
}

/**
 * @param {string} email
 * @param {object} form
 * @param {string} consultantId
 * @returns {Promise<{ ok: true, consultant: object } | { ok: false, error: string }>}
 */
export async function updateMemberProfile(email, form, consultantId) {
  const validation = validateNetworkMemberProfile(form)
  if (!validation.ok) return validation

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return updateMemberProfileDev(email, form, consultantId)
  }

  return updateMemberProfileProduction(email, form, consultantId)
}
