/**
 * Playwright-only mocks for Cognition Network invite + accept flows.
 * Enabled when COGCARE_E2E_MOCKS=1 (see playwright.config.js).
 */

import { createHash } from 'node:crypto'
import {
  memberProfilePatchFromValidated,
  validateNetworkMemberProfile,
} from './lib/networkMemberProfile.js'
import { cleanText, isPublishedNow, matchesNetworkAudience, resolveEventRsvpResponse } from './lib/networkApiValidation.js'

const E2E_INVITE_TOKEN = 'e2e-founders-token'
const E2E_INVITE_EXPIRED_TOKEN = 'e2e-invite-expired'
const E2E_INVITE_REVOKED_TOKEN = 'e2e-invite-revoked'
const E2E_INVITE_ACCEPTED_TOKEN = 'e2e-invite-accepted'

function hashInviteToken(token) {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

/** @type {{ memberApiFault?: number, memberApiSlowMs?: number, hideConsultant?: boolean }} */
let e2eRuntimeControls = {}

function buildMockInvitation(token, overrides = {}) {
  return {
    tokenHash: hashInviteToken(token),
    email: 'founder@example.com',
    inviteeName: 'Dr. Pat Kim',
    cohort: 'founding',
    roleCategory: 'physician',
    brandsJson: '["cogcare"]',
    status: 'pending',
    expiresAt: '2030-01-01T00:00:00.000Z',
    createdAt: '2026-07-31T12:00:00.000Z',
    __typename: 'NetworkInvitation',
    ...overrides,
  }
}

const E2E_INVITATIONS_BY_TOKEN = {
  [E2E_INVITE_TOKEN]: buildMockInvitation(E2E_INVITE_TOKEN),
  [E2E_INVITE_EXPIRED_TOKEN]: buildMockInvitation(E2E_INVITE_EXPIRED_TOKEN, {
    expiresAt: '2020-01-01T00:00:00.000Z',
  }),
  [E2E_INVITE_REVOKED_TOKEN]: buildMockInvitation(E2E_INVITE_REVOKED_TOKEN, { status: 'revoked' }),
  [E2E_INVITE_ACCEPTED_TOKEN]: buildMockInvitation(E2E_INVITE_ACCEPTED_TOKEN, {
    status: 'accepted',
    consultantSlug: 'dr-pat-kim',
  }),
}

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

const E2E_BRIEFINGS = [
  {
    id: 'e2e-brief-1',
    title: 'E2E briefing',
    summary: 'Founding cohort orientation note.',
    publishedAt: '2026-07-01',
    status: 'published',
    audienceJson: '["physician"]',
  },
  {
    id: 'e2e-brief-researcher',
    title: 'Researcher-only briefing',
    summary: 'Not shown to physicians.',
    publishedAt: '2026-07-02',
    status: 'published',
    audienceJson: '["researcher"]',
  },
]

const E2E_OPPORTUNITIES = [
  {
    id: 'e2e-opp-1',
    title: 'E2E opportunity',
    summary: 'Optional scoped ask for founding members.',
    rationale: 'Founding member feedback shapes what every future member sees.',
    scope: 'Share written feedback. No patient stories or clinical cases.',
    timeCommitment: '15 minutes, async',
    venture: 'cogcare',
    status: 'published',
    audienceJson: '["physician"]',
  },
  {
    id: 'e2e-opp-closed',
    title: 'Closed physician opportunity',
    summary: 'Should not appear in workspace.',
    rationale: 'Closed.',
    scope: 'N/A',
    timeCommitment: 'N/A',
    venture: 'cogcare',
    status: 'closed',
    audienceJson: '["physician"]',
  },
  {
    id: 'e2e-opp-future',
    title: 'Future physician opportunity',
    summary: 'Opens later.',
    rationale: 'Future window.',
    scope: 'N/A',
    timeCommitment: 'N/A',
    venture: 'cogcare',
    status: 'published',
    opensAt: '2099-01-01T00:00:00.000Z',
    audienceJson: '["physician"]',
  },
  {
    id: 'e2e-opp-nso',
    title: 'NSO venture opportunity',
    summary: 'Only for NSO venture association.',
    rationale: 'Venture scoped.',
    scope: 'Plain-language review.',
    timeCommitment: '15 minutes',
    venture: 'nso',
    status: 'published',
    audienceJson: '["physician"]',
  },
]

/** In-memory institutional workspace for E2E member/admin API mocks. */
const e2eInstitutional = {
  attributions: [
    {
      id: 'e2e-attr-1',
      memberId: 'e2e-consultant-1',
      proposedText: 'Reviewed founding onboarding copy.',
      status: 'pending',
    },
  ],
  introductions: [
    {
      id: 'e2e-intro-1',
      requesterMemberId: 'e2e-consultant-2',
      recipientMemberId: 'e2e-consultant-1',
      purpose: 'Discuss accessibility review cadence.',
      requesterConsent: 'accepted',
      recipientConsent: 'pending',
      status: 'pending',
    },
  ],
  initiatives: [
    { id: 'e2e-init-1', title: 'Accessibility review cadence', summary: 'Institution-led editorial review.', status: 'published' },
  ],
  proposals: [],
  events: [
    {
      id: 'e2e-event-1',
      title: 'Founding salon (E2E)',
      description: 'Controlled member salon.',
      startsAt: '2030-06-01T18:00:00.000Z',
      status: 'published',
      audienceJson: '["physician"]',
      capacity: 50,
    },
    {
      id: 'e2e-event-full',
      title: 'Full-capacity salon (E2E)',
      description: 'Waitlist when capacity reached.',
      startsAt: '2030-07-01T18:00:00.000Z',
      status: 'published',
      audienceJson: '["physician"]',
      capacity: 1,
    },
    {
      id: 'e2e-event-past',
      title: 'Past salon (E2E)',
      description: 'Already occurred.',
      startsAt: '2020-01-01T18:00:00.000Z',
      status: 'published',
      audienceJson: '["physician"]',
    },
  ],
  eventResponses: [],
  preferences: null,
  contributions: [
    {
      id: 'e2e-contrib-1',
      memberId: 'e2e-consultant-1',
      title: 'Onboarding copy review',
      description: 'Verified editorial contribution.',
      recordedAt: '2026-07-20',
    },
  ],
  feedback: [],
  responses: [],
  briefings: E2E_BRIEFINGS.map((x) => ({ ...x })),
  opportunities: E2E_OPPORTUNITIES.map((x) => ({ ...x })),
  impacts: [],
  notifications: [],
}

function applyE2eScenario(scenario) {
  resetE2eInstitutionalState()
  e2eRuntimeControls = {}
  if (scenario === 'physician-public-profile') {
    e2eMemberConsultant = {
      ...e2eMemberConsultant,
      profileVisibility: 'public',
      publicNameConsentAt: '2026-07-01T00:00:00.000Z',
      isActive: true,
      bio: 'Behavioral neurologist focused on cognitive care systems.',
    }
  } else if (scenario === 'physician-communications-on') {
    e2eMemberConsultant = { ...e2eMemberConsultant, communicationPreference: 'founding_updates' }
  } else if (scenario === 'physician-empty-workspace') {
    e2eInstitutional.briefings = []
    e2eInstitutional.opportunities = []
    e2eInstitutional.contributions = []
    e2eInstitutional.attributions = []
    e2eInstitutional.introductions = []
    e2eInstitutional.initiatives = []
    e2eInstitutional.events = []
    e2eInstitutional.eventResponses = []
    e2eInstitutional.proposals = []
    e2eInstitutional.preferences = null
  } else if (scenario === 'physician-no-membership') {
    e2eRuntimeControls.hideConsultant = true
  } else if (scenario === 'physician-cross-member-attribution') {
    e2eInstitutional.attributions.push({
      id: 'e2e-attr-other',
      memberId: 'e2e-consultant-2',
      proposedText: 'Another member attribution.',
      status: 'pending',
    })
  } else if (scenario === 'physician-introduction-both-parties') {
    e2eInstitutional.introductions = [
      {
        id: 'e2e-intro-dual',
        requesterMemberId: 'e2e-consultant-2',
        recipientMemberId: 'e2e-consultant-1',
        purpose: 'Co-design a clinician-facing glossary.',
        requesterConsent: 'pending',
        recipientConsent: 'pending',
        status: 'pending',
      },
    ]
  } else if (scenario === 'physician-event-full') {
    e2eInstitutional.eventResponses = [
      {
        id: 'e2e-event-resp-blocker',
        memberId: 'e2e-consultant-2',
        eventId: 'e2e-event-full',
        response: 'attending',
        respondedAt: '2026-07-01T00:00:00.000Z',
      },
    ]
  } else if (scenario === 'api-401') {
    e2eRuntimeControls.memberApiFault = 401
  } else if (scenario === 'api-403') {
    e2eRuntimeControls.memberApiFault = 403
  } else if (scenario === 'api-500') {
    e2eRuntimeControls.memberApiFault = 500
  } else if (scenario === 'api-slow') {
    e2eRuntimeControls.memberApiSlowMs = 2500
  }
}

function resetE2eInstitutionalState() {
  e2eInstitutional.attributions = [
    {
      id: 'e2e-attr-1',
      memberId: 'e2e-consultant-1',
      proposedText: 'Reviewed founding onboarding copy.',
      status: 'pending',
    },
  ]
  e2eInstitutional.introductions = [
    {
      id: 'e2e-intro-1',
      requesterMemberId: 'e2e-consultant-2',
      recipientMemberId: 'e2e-consultant-1',
      purpose: 'Discuss accessibility review cadence.',
      requesterConsent: 'accepted',
      recipientConsent: 'pending',
      status: 'pending',
    },
  ]
  e2eInstitutional.initiatives = [
    { id: 'e2e-init-1', title: 'Accessibility review cadence', summary: 'Institution-led editorial review.', status: 'published' },
  ]
  e2eInstitutional.proposals = []
  e2eInstitutional.events = [
    {
      id: 'e2e-event-1',
      title: 'Founding salon (E2E)',
      description: 'Controlled member salon.',
      startsAt: '2030-06-01T18:00:00.000Z',
      status: 'published',
      audienceJson: '["physician"]',
      capacity: 50,
    },
    {
      id: 'e2e-event-full',
      title: 'Full-capacity salon (E2E)',
      description: 'Waitlist when capacity reached.',
      startsAt: '2030-07-01T18:00:00.000Z',
      status: 'published',
      audienceJson: '["physician"]',
      capacity: 1,
    },
    {
      id: 'e2e-event-past',
      title: 'Past salon (E2E)',
      description: 'Already occurred.',
      startsAt: '2020-01-01T18:00:00.000Z',
      status: 'published',
      audienceJson: '["physician"]',
    },
  ]
  e2eInstitutional.eventResponses = []
  e2eInstitutional.preferences = null
  e2eInstitutional.contributions = [
    {
      id: 'e2e-contrib-1',
      memberId: 'e2e-consultant-1',
      title: 'Onboarding copy review',
      description: 'Verified editorial contribution.',
      recordedAt: '2026-07-20',
    },
  ]
  e2eInstitutional.feedback = []
  e2eInstitutional.responses = []
  e2eInstitutional.briefings = E2E_BRIEFINGS.map((x) => ({ ...x }))
  e2eInstitutional.opportunities = E2E_OPPORTUNITIES.map((x) => ({ ...x }))
  e2eInstitutional.impacts = []
  e2eInstitutional.notifications = []
  for (const key of Object.keys(e2eOpportunityResponses)) delete e2eOpportunityResponses[key]
  e2eMemberConsultant = { ...MOCK_MEMBER_CONSULTANT }
}

function memberWorkspacePayload() {
  const member = e2eMemberConsultant
  const ventures = new Set(
    (() => {
      try {
        return JSON.parse(member.ventureAssociationsJson || '[]')
      } catch {
        return ['cogcare']
      }
    })(),
  )
  return {
    briefings: e2eInstitutional.briefings
      .filter((x) => x.status === 'published')
      .filter((x) => matchesNetworkAudience(x, member)),
    opportunities: e2eInstitutional.opportunities
      .filter((x) => x.status === 'published')
      .filter((x) => isPublishedNow(x))
      .filter((x) => matchesNetworkAudience(x, member))
      .filter((x) => !x.venture || ventures.has(x.venture)),
    attributions: e2eInstitutional.attributions.filter((x) => x.memberId === 'e2e-consultant-1'),
    introductions: e2eInstitutional.introductions.filter(
      (x) => x.requesterMemberId === 'e2e-consultant-1' || x.recipientMemberId === 'e2e-consultant-1',
    ),
    initiatives: e2eInstitutional.initiatives,
    proposals: e2eInstitutional.proposals,
    events: e2eInstitutional.events.filter((x) => matchesNetworkAudience(x, member)),
    eventResponses: e2eInstitutional.eventResponses,
    preferences: e2eInstitutional.preferences,
    contributions: e2eInstitutional.contributions.filter((x) => x.memberId === 'e2e-consultant-1'),
    impacts: [],
    feedback: e2eInstitutional.feedback,
    responses: e2eInstitutional.responses,
    consentEvents: [],
  }
}

async function handleE2eMemberApi(body) {
  if (e2eRuntimeControls.memberApiSlowMs) {
    await new Promise((resolve) => setTimeout(resolve, e2eRuntimeControls.memberApiSlowMs))
  }
  if (e2eRuntimeControls.memberApiFault === 401) {
    return { error: 'A valid Cognition Network member session is required.', status: 401 }
  }
  if (e2eRuntimeControls.memberApiFault === 403) {
    return { error: 'Cognition Network membership is required.', status: 403 }
  }
  if (e2eRuntimeControls.memberApiFault === 500) {
    return { error: 'Could not complete request.', status: 500 }
  }

  const operation = body.operation
  if (operation === 'workspace') {
    return { ok: true, workspace: memberWorkspacePayload() }
  }
  if (operation === 'decideAttribution') {
    const item = e2eInstitutional.attributions.find((x) => x.id === body.id)
    if (!item || item.memberId !== 'e2e-consultant-1' || item.status !== 'pending') {
      return { error: 'Pending attribution request not found.', status: 404 }
    }
    item.status = body.decision === 'approved' ? 'approved' : 'declined'
    item.decidedAt = new Date().toISOString()
    return { ok: true, attribution: item }
  }
  if (operation === 'decideIntroduction') {
    const item = e2eInstitutional.introductions.find((x) => x.id === body.id)
    if (!item || item.status !== 'pending') return { error: 'Pending introduction not found.', status: 404 }
    const field = item.recipientMemberId === 'e2e-consultant-1' ? 'recipientConsent' : 'requesterConsent'
    if (item[field] !== 'pending') return { error: 'You have already responded to this introduction.', status: 409 }
    item[field] = body.decision
    if (body.decision === 'declined') {
      item.status = 'declined'
      item.resolvedAt = new Date().toISOString()
    } else if (item.requesterConsent === 'accepted' && item.recipientConsent === 'accepted') {
      item.status = 'consented'
      item.resolvedAt = new Date().toISOString()
    }
    return { ok: true, introduction: item }
  }
  if (operation === 'submitProposal') {
    const title = cleanText(body.title, { field: 'Title', required: true, max: 160 })
    const summary = cleanText(body.summary, { field: 'Summary', required: true, max: 3000 })
    if (!title.ok || !summary.ok) return { error: (!title.ok ? title : summary).error, status: 400 }
    const proposal = {
      id: `e2e-proposal-${Date.now()}`,
      memberId: 'e2e-consultant-1',
      title: title.value,
      summary: summary.value,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }
    e2eInstitutional.proposals.push(proposal)
    return { ok: true, proposal }
  }
  if (operation === 'respondOpportunity') {
    const opportunityId = typeof body.opportunityId === 'string' ? body.opportunityId : ''
    const response = body.response
    if (!opportunityId) return { error: 'Opportunity is required.', status: 400 }
    if (!['interested', 'declined', 'withdrawn'].includes(response)) {
      return { error: 'Response must be interested, declined, or withdrawn.', status: 400 }
    }
    const opportunity = e2eInstitutional.opportunities.find(
      (o) => o.id === opportunityId && o.status === 'published' && isPublishedNow(o),
    )
    if (!opportunity || !matchesNetworkAudience(opportunity, e2eMemberConsultant)) {
      return { error: 'This opportunity is not currently available.', status: 404 }
    }
    const existing = e2eInstitutional.responses.find(
      (x) => x.memberId === 'e2e-consultant-1' && x.opportunityId === opportunityId,
    )
    const record = existing || { id: `e2e-response-${Date.now()}`, memberId: 'e2e-consultant-1', opportunityId }
    record.response = response
    record.respondedAt = new Date().toISOString()
    if (!existing) e2eInstitutional.responses.push(record)
    return { ok: true, response: record }
  }
  if (operation === 'respondEvent') {
    const eventId = typeof body.eventId === 'string' ? body.eventId : ''
    const response = body.response
    if (!eventId) return { error: 'Event is required.', status: 400 }
    if (!['attending', 'declined', 'waitlist', 'withdrawn'].includes(response)) {
      return { error: 'Response must be attending, declined, waitlist, or withdrawn.', status: 400 }
    }
    const networkEvent = e2eInstitutional.events.find((x) => x.id === eventId && x.status === 'published')
    if (!networkEvent) return { error: 'Event not found.', status: 404 }
    const attending = e2eInstitutional.eventResponses.filter(
      (x) => x.eventId === eventId && x.response === 'attending' && x.memberId !== 'e2e-consultant-1',
    ).length
    const resolvedResponse = resolveEventRsvpResponse(networkEvent, response, attending)
    const eventResponse = {
      id: `e2e-event-resp-${Date.now()}`,
      memberId: 'e2e-consultant-1',
      eventId,
      response: resolvedResponse,
      respondedAt: new Date().toISOString(),
    }
    e2eInstitutional.eventResponses = [
      ...e2eInstitutional.eventResponses.filter((x) => x.eventId !== eventId),
      eventResponse,
    ]
    return { ok: true, eventResponse }
  }
  if (operation === 'savePreferences') {
    if (body.notificationCadence !== 'none' && e2eMemberConsultant.communicationPreference === 'none') {
      return {
        error: 'Enable network communications in Profile & consent before selecting notifications.',
        status: 409,
      }
    }
    e2eInstitutional.preferences = {
      id: 'e2e-pref-1',
      memberId: 'e2e-consultant-1',
      topicsJson: JSON.stringify(body.topics || []),
      notificationCadence: body.notificationCadence || 'none',
      updatedAt: new Date().toISOString(),
    }
    return { ok: true, preferences: e2eInstitutional.preferences }
  }
  if (operation === 'submitFeedback') {
    const message = cleanText(body.message, { field: 'Feedback', required: true, max: 3000 })
    if (!message.ok) return { error: message.error, status: 400 }
    const feedback = {
      id: `e2e-feedback-${Date.now()}`,
      memberId: 'e2e-consultant-1',
      message: message.value,
      createdAt: new Date().toISOString(),
    }
    e2eInstitutional.feedback.push(feedback)
    return { ok: true, feedback }
  }
  return { error: 'Unknown operation.', status: 400 }
}

function e2eMetrics() {
  return [
    { id: 'm1', metric: 'opportunity_responses', value: e2eInstitutional.responses.length },
    { id: 'm2', metric: 'feedback_submissions', value: e2eInstitutional.feedback.length },
  ]
}

function handleE2eAdminApi(body) {
  const operation = body.operation
  if (operation === 'dashboard') {
    return { ok: true, dashboard: {
      briefings: e2eInstitutional.briefings,
      opportunities: e2eInstitutional.opportunities,
      responses: e2eInstitutional.responses.map((item) => {
        const rest = { ...item }
        delete rest.memberEmail
        delete rest.note
        return rest
      }),
      feedback: e2eInstitutional.feedback.map((item) => {
        const rest = { ...item }
        delete rest.memberEmail
        return rest
      }),
      contributions: e2eInstitutional.contributions,
      impacts: e2eInstitutional.impacts,
      attributions: e2eInstitutional.attributions,
      initiatives: e2eInstitutional.initiatives,
      proposals: e2eInstitutional.proposals,
      events: e2eInstitutional.events,
      introductions: e2eInstitutional.introductions,
      notifications: e2eInstitutional.notifications,
      metrics: e2eMetrics(),
    } }
  }
  if (operation === 'recomputeMetrics') {
    return { ok: true, metrics: e2eMetrics() }
  }
  if (operation === 'saveBriefing') {
    const title = String(body.title || '').trim()
    if (!title) return { error: 'Title is required.', status: 400 }
    const id = typeof body.id === 'string' && body.id ? body.id : `e2e-brief-${Date.now()}`
    const existing = e2eInstitutional.briefings.find((x) => x.id === id)
    const values = { id, title, summary: String(body.summary || '').trim(), topic: body.topic || undefined,
      status: body.status || 'draft', publishedAt: body.status === 'published' ? new Date().toISOString() : existing?.publishedAt }
    if (existing) Object.assign(existing, values)
    else e2eInstitutional.briefings.push(values)
    return { ok: true, briefing: existing || values }
  }
  if (operation === 'saveOpportunity') {
    const title = String(body.title || '').trim()
    if (!title) return { error: 'Title is required.', status: 400 }
    const id = typeof body.id === 'string' && body.id ? body.id : `e2e-opp-${Date.now()}`
    const existing = e2eInstitutional.opportunities.find((x) => x.id === id)
    const values = { id, title, summary: String(body.summary || '').trim(), rationale: String(body.rationale || '').trim(),
      scope: body.scope || undefined, timeCommitment: body.timeCommitment || undefined, venture: body.venture || undefined,
      status: body.status || 'draft' }
    if (existing) Object.assign(existing, values)
    else e2eInstitutional.opportunities.push(values)
    return { ok: true, opportunity: existing || values }
  }
  if (operation === 'recordContribution' || operation === 'recordImpact') {
    const memberId = String(body.memberId || '').trim(), title = String(body.title || '').trim(), description = String(body.description || '').trim()
    if (!memberId || !title || !description) return { error: 'Member, title, and description are required.', status: 400 }
    if (operation === 'recordContribution') {
      const contribution = { id: `e2e-contrib-${Date.now()}`, memberId, title, description, status: 'verified', recordedAt: new Date().toISOString() }
      e2eInstitutional.contributions.push(contribution)
      return { ok: true, contribution }
    }
    const impact = { id: `e2e-impact-${Date.now()}`, memberId, title, description, status: 'verified', verifiedAt: new Date().toISOString() }
    e2eInstitutional.impacts.push(impact)
    return { ok: true, impact }
  }
  if (operation === 'requestAttribution') {
    const memberId = String(body.memberId || '').trim(), proposedText = String(body.proposedText || '').trim()
    if (!memberId || !proposedText) return { error: 'Member and proposed wording are required.', status: 400 }
    const attribution = { id: `e2e-attr-${Date.now()}`, memberId, proposedText, status: 'pending', requestedAt: new Date().toISOString() }
    e2eInstitutional.attributions.push(attribution)
    return { ok: true, attribution }
  }
  if (operation === 'createIntroduction') {
    const requesterMemberId = String(body.requesterMemberId || '').trim(), recipientMemberId = String(body.recipientMemberId || '').trim()
    const purpose = String(body.purpose || '').trim()
    if (!requesterMemberId || !recipientMemberId || !purpose) return { error: 'Both members and a purpose are required.', status: 400 }
    if (requesterMemberId === recipientMemberId) return { error: 'Introduction requires two different members.', status: 400 }
    const introduction = { id: `e2e-intro-${Date.now()}`, requesterMemberId, recipientMemberId, purpose,
      requesterConsent: 'pending', recipientConsent: 'pending', status: 'pending', createdAt: new Date().toISOString() }
    e2eInstitutional.introductions.push(introduction)
    return { ok: true, introduction }
  }
  if (operation === 'saveInitiative') {
    const title = String(body.title || '').trim()
    if (!title) return { error: 'Title is required.', status: 400 }
    const id = typeof body.id === 'string' && body.id ? body.id : `e2e-init-${Date.now()}`
    const existing = e2eInstitutional.initiatives.find((x) => x.id === id)
    const values = { id, title, summary: String(body.summary || '').trim(), status: body.status || 'draft' }
    if (existing) Object.assign(existing, values)
    else e2eInstitutional.initiatives.push(values)
    return { ok: true, initiative: existing || values }
  }
  if (operation === 'saveEvent') {
    const title = String(body.title || '').trim()
    if (!title || typeof body.startsAt !== 'string') return { error: 'Title and start time are required.', status: 400 }
    const id = typeof body.id === 'string' && body.id ? body.id : `e2e-event-${Date.now()}`
    const existing = e2eInstitutional.events.find((x) => x.id === id)
    const values = { id, title, description: String(body.description || '').trim(), startsAt: body.startsAt, status: body.status || 'draft' }
    if (existing) Object.assign(existing, values)
    else e2eInstitutional.events.push(values)
    return { ok: true, event: existing || values }
  }
  if (operation === 'reviewProposal') {
    const id = String(body.id || '').trim()
    if (!['under_review', 'accepted', 'declined'].includes(body.status)) return { error: 'Status must be under_review, accepted, or declined.', status: 400 }
    const proposal = e2eInstitutional.proposals.find((x) => x.id === id)
    if (!proposal) return { error: 'Proposal not found.', status: 404 }
    proposal.status = body.status
    proposal.reviewedAt = new Date().toISOString()
    return { ok: true, proposal }
  }
  if (operation === 'queueNotification') {
    if (e2eMemberConsultant.communicationPreference === 'none') {
      return { error: 'Member has not consented to network communications.', status: 409 }
    }
    const notification = { id: `e2e-notif-${Date.now()}`, memberId: body.memberId, kind: body.kind,
      subject: body.subject, message: body.message, status: 'queued', createdAt: new Date().toISOString() }
    e2eInstitutional.notifications.push(notification)
    return { ok: true, notification }
  }
  if (operation === 'dispatchNotification') {
    const notification = e2eInstitutional.notifications.find((x) => x.id === body.id)
    if (!notification || notification.status !== 'queued') return { error: 'Queued notification not found.', status: 404 }
    if (e2eMemberConsultant.communicationPreference === 'none') {
      notification.status = 'cancelled_no_consent'
      return { error: 'Delivery cancelled because current communication consent is absent.', status: 409 }
    }
    return { error: 'Network email delivery is not configured.', status: 503 }
  }
  return { error: 'Unknown operation.', status: 400 }
}

function getE2eEmailFromBody(body) {
  return typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
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
            const items = e2eRuntimeControls.hideConsultant ? [] : [e2eMemberConsultant]
            return sendJson(res, 200, {
              data: { listConsultants: { items, nextToken: null } },
            })
          }
          if (query.includes('NetworkInvitation')) {
            const tokenHash = String(variables.tokenHash || '')
            const invitation = Object.values(E2E_INVITATIONS_BY_TOKEN).find((x) => x.tokenHash === tokenHash)
            return sendJson(res, 200, { data: { getNetworkInvitation: invitation || null } })
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
          const token = url.searchParams.get('token')
          if (token && E2E_INVITATIONS_BY_TOKEN[token]) {
            const invitation = E2E_INVITATIONS_BY_TOKEN[token]
            const expiredByDate = Boolean(invitation.expiresAt && new Date(invitation.expiresAt) <= new Date())
            if (['revoked', 'accepted', 'expired'].includes(invitation.status) || expiredByDate) {
              return sendJson(res, 200, {
                invitation: { status: expiredByDate ? 'expired' : invitation.status, consultantSlug: invitation.consultantSlug },
              })
            }
            return sendJson(res, 200, { invitation })
          }
          if (token) {
            return sendJson(res, 404, { error: 'Not found.' })
          }
          return sendJson(res, 404, { error: 'Not found.' })
        }

        if (pathname === '/__e2e__/network-scenario' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          applyE2eScenario(typeof body.scenario === 'string' ? body.scenario : 'default')
          return sendJson(res, 200, { ok: true, scenario: body.scenario || 'default' })
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
          if (e2eRuntimeControls.hideConsultant || email !== e2eMemberConsultant.contactEmail?.toLowerCase()) {
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

        if (pathname === '/__e2e__/network-reset' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          applyE2eScenario(typeof body.scenario === 'string' ? body.scenario : 'default')
          return sendJson(res, 200, { ok: true })
        }

        if (pathname === '/__e2e__/network-member-api' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            return sendJson(res, 400, { error: 'Invalid JSON body.' })
          }
          const result = await handleE2eMemberApi(body)
          if (result.error) return sendJson(res, result.status || 400, { error: result.error })
          return sendJson(res, 200, result)
        }

        if (pathname === '/__e2e__/network-admin-api' && req.method === 'POST') {
          const raw = await readRequestBody(req)
          let body = {}
          try {
            body = raw ? JSON.parse(raw) : {}
          } catch {
            return sendJson(res, 400, { error: 'Invalid JSON body.' })
          }
          const result = handleE2eAdminApi(body)
          if (result.error) return sendJson(res, result.status || 400, { error: result.error })
          return sendJson(res, 200, result)
        }

        return next()
      })
    },
  }
}
