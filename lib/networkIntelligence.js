import { parseBrandsJson } from './networkConstants.js'
import { parseVentureAssociations } from './networkVentureAssociation.js'
import { isVentureId } from './ventureRegistry.js'

/** Founding cohort capacity milestones — aggregate targets only, no PHI. */
export const NETWORK_COHORT_TARGETS = [10, 30, 100]

/**
 * @typedef {{
 *   invitations: object[]
 *   consultants: object[]
 * }} NetworkIntelligenceInput
 */

/**
 * Aggregate, non-PHI network intelligence for admin dashboards.
 *
 * @param {NetworkIntelligenceInput} input
 */
export function computeNetworkIntelligence({ invitations = [], consultants = [] }) {
  const members = consultants.filter((c) => Boolean(c?.networkCohort))

  const inviteByStatus = countBy(invitations, (row) => row?.status || 'unknown')
  const acceptedInvites = inviteByStatus.accepted ?? 0
  const pendingInvites = inviteByStatus.pending ?? 0
  const revokedInvites = inviteByStatus.revoked ?? 0
  const expiredInvites = inviteByStatus.expired ?? 0

  const participationModes = countBy(members, (m) => m?.participationMode || 'passive')

  const visibilityBuckets = { private: 0, directory: 0, public: 0 }
  let publicConsentCount = 0
  let communicationsOptIn = 0

  for (const member of members) {
    const visibility = member?.profileVisibility || 'private'
    if (visibility === 'public') visibilityBuckets.public += 1
    else if (visibility === 'directory') visibilityBuckets.directory += 1
    else visibilityBuckets.private += 1

    if (member?.publicNameConsentAt) publicConsentCount += 1

    const comm = member?.communicationPreference
    if (comm && comm !== 'none') communicationsOptIn += 1
  }

  const ventureCounts = {}
  for (const member of members) {
    const ventures = parseVentureAssociations(member?.ventureAssociationsJson)
    for (const id of ventures) {
      ventureCounts[id] = (ventureCounts[id] ?? 0) + 1
    }
  }

  const inviteBrands = {}
  for (const invite of invitations) {
    for (const brand of parseBrandsJson(invite?.brandsJson)) {
      if (isVentureId(brand)) {
        inviteBrands[brand] = (inviteBrands[brand] ?? 0) + 1
      }
    }
  }

  const memberCount = members.length
  const cohortProgress = NETWORK_COHORT_TARGETS.map((target) => ({
    target,
    current: memberCount,
    percent: Math.min(100, Math.round((memberCount / target) * 100)),
    met: memberCount >= target,
  }))

  const totalInvites = invitations.length
  const acceptanceRate =
    totalInvites > 0 ? Math.round((acceptedInvites / totalInvites) * 100) : null

  const engagementHealth = scoreEngagementHealth({
    memberCount,
    acceptanceRate,
    publicConsentCount,
    communicationsOptIn,
    participationModes,
  })

  return {
    summary: {
      memberCount,
      totalInvites,
      acceptedInvites,
      pendingInvites,
      revokedInvites,
      expiredInvites,
      acceptanceRate,
    },
    cohortProgress,
    inviteByStatus,
    participationModes,
    visibilityBuckets,
    consentCoverage: {
      publicNameConsent: publicConsentCount,
      publicNameConsentRate:
        memberCount > 0 ? Math.round((publicConsentCount / memberCount) * 100) : null,
      communicationsOptIn,
      communicationsOptInRate:
        memberCount > 0 ? Math.round((communicationsOptIn / memberCount) * 100) : null,
      privateMembers: visibilityBuckets.private,
    },
    ventureAssociationCounts: ventureCounts,
    inviteBrandCounts: inviteBrands,
    engagementHealth,
  }
}

/**
 * @param {object} input
 * @returns {{ label: string, score: number, notes: string[] }}
 */
function scoreEngagementHealth(input) {
  const notes = []
  let score = 50

  if (input.memberCount === 0) {
    return { label: 'Awaiting first members', score: 0, notes: ['No accepted members yet.'] }
  }

  if (input.acceptanceRate != null) {
    if (input.acceptanceRate >= 60) score += 15
    else if (input.acceptanceRate < 30) {
      score -= 10
      notes.push('Invitation acceptance is below 30%.')
    }
  }

  const active = (input.participationModes.active ?? 0) + (input.participationModes.selective ?? 0)
  const passive = input.participationModes.passive ?? 0
  if (active > 0) score += 10
  if (passive > active) notes.push('Most members are passive — expected for founding cohort.')

  const publicRate =
    input.memberCount > 0
      ? Math.round((input.publicConsentCount / input.memberCount) * 100)
      : 0
  if (publicRate < 20) notes.push('Most members remain private — consent-first posture is healthy.')

  if (input.communicationsOptIn > 0) score += 5

  score = Math.max(0, Math.min(100, score))

  let label = 'Stable'
  if (score >= 75) label = 'Healthy'
  else if (score < 40) label = 'Early'

  return { label, score, notes }
}

/**
 * @template T
 * @param {T[]} rows
 * @param {(row: T) => string} keyFn
 */
function countBy(rows, keyFn) {
  /** @type {Record<string, number>} */
  const out = {}
  for (const row of rows) {
    const key = keyFn(row)
    out[key] = (out[key] ?? 0) + 1
  }
  return out
}
