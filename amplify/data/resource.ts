import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { completeAssessment } from '../functions/completeAssessment/resource'
import { calendlyWebhook } from '../functions/calendlyWebhook/resource'
import { acceptNetworkInvitation } from '../functions/acceptNetworkInvitation/resource'
import { updateNetworkMemberProfile } from '../functions/updateNetworkMemberProfile/resource'
import { getNetworkPublicData } from '../functions/getNetworkPublicData/resource'
import { networkMemberApi } from '../functions/networkMemberApi/resource'
import { networkAdminApi } from '../functions/networkAdminApi/resource'
import { verifyAuthChallengeResponse } from '../auth/verify-auth-challenge-response/resource'

const schema = a.schema({
  /**
   * Explicit `owner` field (vs. implicit `allow.owner()`) so the completeAssessment Lambda
   * can set `owner` to the new Cognito `sub` on create. Implicit owner fields are stripped
   * from the GraphQL CreateInput, which surfaces as
   * `field that is not defined for input object type 'CreateUserProfileInput'` from the Lambda.
   */
  UserProfile: a
    .model({
      owner: a.string(),
      displayName: a.string(),
      avatarKey: a.string(),
      brainCreditScore: a.integer(),
      createdAt: a.datetime(),
      /** Cognito `sub` of the implicit "Myself" subject row for this account. */
      defaultSubjectId: a.string(),
    })
    .authorization((allow) => [allow.ownerDefinedIn('owner')]),

  /**
   * A person the account owner tracks (self or a loved one). Assessments and consults reference `subjectId`.
   */
  Subject: a
    .model({
      owner: a.string(),
      displayName: a.string().required(),
      age: a.integer(),
      relation: a.string(),
      isSelf: a.boolean().required(),
      archivedAt: a.datetime(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.ownerDefinedIn('owner')]),

  /**
   * One-time magic-link tokens for CUSTOM_WITHOUT_SRP sign-in (quiz email).
   * PK = sha256(rawToken). IAM access from completeAssessment + verifyAuthChallengeResponse Lambdas.
   */
  MagicLinkToken: a
    .model({
      tokenHash: a.string().required(),
      email: a.string().required(),
      expiresAt: a.datetime().required(),
      used: a.boolean().required(),
    })
    .identifier(['tokenHash'])
    .authorization((allow) => [
      allow.authenticated('identityPool').to(['create', 'read', 'update', 'delete']),
    ]),

  /** Per-email daily cap for completeAssessment (Lambda). PK slotKey = email#YYYY-MM-DD (UTC). */
  OnboardingAttempt: a
    .model({
      slotKey: a.string().required(),
      hitCount: a.integer().required(),
    })
    .identifier(['slotKey'])
    .authorization((allow) => [
      allow.authenticated('identityPool').to(['create', 'read', 'update', 'delete']),
    ]),

  Assessment: a
    .model({
      owner: a.string(),
      type: a.string().required(),
      answersJson: a.string().required(),
      resultsJson: a.string().required(),
      completedAt: a.datetime().required(),
      subjectId: a.string(),
    })
    .authorization((allow) => [allow.ownerDefinedIn('owner')]),

  Consultant: a
    .model({
      name: a.string().required(),
      slug: a.string(),
      title: a.string(),
      credentials: a.string(),
      bio: a.string(),
      photoUrl: a.string(),
      bookingUrl: a.string(),
      contactEmail: a.string(),
      affiliation: a.string(),
      licensedStates: a.string().array(),
      locationCity: a.string(),
      locationState: a.string(),
      isActive: a.boolean(),
      inactiveReason: a.string(),
      sortOrder: a.integer(),
      /** Cognition Network founding cohort label, e.g. "founding". */
      networkCohort: a.string(),
      networkRoleCategory: a.string(),
      /** JSON string array of brand ids: cogcare, cogtraining, nso */
      networkBrandsJson: a.string(),
      /** Set when the member explicitly consents to public display of their name/profile. */
      publicNameConsentAt: a.datetime(),
      organization: a.string(),
      professionalUrl: a.string(),
      participationMode: a.string(),
      /** JSON string array of venture brand ids */
      ventureAssociationsJson: a.string(),
      interests: a.string(),
      /** public | directory | private */
      profileVisibility: a.string(),
      communicationPreference: a.string(),
      onboardingNote: a.string(),
      disclosureAcknowledgedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.groups(['admin']).to(['create', 'read', 'update', 'delete']),
    ]),

  /**
   * Invitation-only onboarding for Cognition Network.
   * PK = sha256(rawToken). Public read via API key for invite landing pages.
   */
  NetworkInvitation: a
    .model({
      tokenHash: a.string().required(),
      email: a.string().required(),
      inviteeName: a.string(),
      cohort: a.string().required(),
      roleCategory: a.string(),
      /** JSON string array of brand ids */
      brandsJson: a.string(),
      status: a.string().required(),
      invitedByEmail: a.string(),
      personalNote: a.string(),
      expiresAt: a.datetime(),
      acceptedAt: a.datetime(),
      consultantId: a.string(),
      consultantSlug: a.string(),
      createdAt: a.datetime(),
    })
    .identifier(['tokenHash'])
    .authorization((allow) => [
      allow.groups(['admin']).to(['create', 'read', 'update', 'delete']),
    ]),

  /** Public invite requests. Contact details are readable only by Network administrators. */
  NetworkWaitlistRequest: a
    .model({
      emailHash: a.string().required(),
      waitlistCode: a.string().required(),
      name: a.string().required(),
      email: a.string().required(),
      roleCategory: a.string().required(),
      organization: a.string(),
      location: a.string(),
      professionalUrl: a.string(),
      interest: a.string().required(),
      source: a.string(),
      status: a.string().required(),
      consentAt: a.datetime().required(),
      createdAt: a.datetime().required(),
    })
    .identifier(['emailHash'])
    .authorization((allow) => [allow.groups(['admin']).to(['read', 'update', 'delete'])]),

  /** Editorial material visible to members only after an administrator publishes it. */
  NetworkBriefing: a
    .model({
      title: a.string().required(),
      summary: a.string().required(),
      body: a.string(),
      topic: a.string(),
      audienceJson: a.string(),
      status: a.string().required(),
      publishedAt: a.datetime(),
      archivedAt: a.datetime(),
      createdBy: a.string(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  /** Optional, scoped request for professional input. Never implies participation. */
  NetworkOpportunity: a
    .model({
      title: a.string().required(),
      summary: a.string().required(),
      rationale: a.string().required(),
      scope: a.string(),
      timeCommitment: a.string(),
      topic: a.string(),
      audienceJson: a.string(),
      venture: a.string(),
      status: a.string().required(),
      opensAt: a.datetime(),
      closesAt: a.datetime(),
      publishedAt: a.datetime(),
      archivedAt: a.datetime(),
      createdBy: a.string(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  NetworkOpportunityResponse: a
    .model({
      memberId: a.string().required(),
      memberEmail: a.string().required(),
      opportunityId: a.string().required(),
      response: a.string().required(),
      note: a.string(),
      respondedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['read'])]),

  NetworkFeedback: a
    .model({
      memberId: a.string().required(),
      memberEmail: a.string().required(),
      context: a.string().required(),
      category: a.string(),
      message: a.string().required(),
      createdAt: a.datetime().required(),
      status: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['read', 'update'])]),

  /** Append-only evidence of member-controlled consent. There are deliberately no client grants. */
  NetworkConsentEvent: a
    .model({
      memberId: a.string().required(),
      memberEmail: a.string().required(),
      actorSub: a.string(),
      changesJson: a.string().required(),
      occurredAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['read'])]),

  NetworkContribution: a
    .model({
      memberId: a.string().required(),
      title: a.string().required(),
      description: a.string().required(),
      venture: a.string(),
      status: a.string().required(),
      occurredAt: a.datetime(),
      verifiedAt: a.datetime().required(),
      verifiedBy: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  NetworkImpact: a
    .model({
      memberId: a.string().required(),
      contributionId: a.string(),
      title: a.string().required(),
      description: a.string().required(),
      evidenceUrl: a.string(),
      status: a.string().required(),
      verifiedAt: a.datetime().required(),
      verifiedBy: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  /** Approval is item-specific; membership never authorizes attribution by itself. */
  AttributionApproval: a
    .model({
      memberId: a.string().required(),
      itemType: a.string().required(),
      itemId: a.string().required(),
      proposedText: a.string().required(),
      status: a.string().required(),
      requestedAt: a.datetime().required(),
      decidedAt: a.datetime(),
      requestedBy: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read'])]),

  NetworkIntroduction: a
    .model({
      requesterMemberId: a.string().required(),
      recipientMemberId: a.string().required(),
      purpose: a.string().required(),
      requesterConsent: a.string().required(),
      recipientConsent: a.string().required(),
      status: a.string().required(),
      createdAt: a.datetime().required(),
      resolvedAt: a.datetime(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  NetworkInitiative: a
    .model({
      title: a.string().required(),
      summary: a.string().required(),
      topic: a.string(),
      venture: a.string(),
      status: a.string().required(),
      createdBy: a.string().required(),
      publishedAt: a.datetime(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  NetworkProposal: a
    .model({
      memberId: a.string().required(),
      title: a.string().required(),
      summary: a.string().required(),
      topic: a.string(),
      status: a.string().required(),
      submittedAt: a.datetime().required(),
      reviewedAt: a.datetime(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['read', 'update'])]),

  NetworkEvent: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      topic: a.string(),
      startsAt: a.datetime().required(),
      endsAt: a.datetime(),
      capacity: a.integer(),
      status: a.string().required(),
      audienceJson: a.string(),
      createdBy: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  NetworkEventResponse: a
    .model({
      memberId: a.string().required(),
      eventId: a.string().required(),
      response: a.string().required(),
      respondedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['read'])]),

  NetworkMemberPreference: a
    .model({
      memberId: a.string().required(),
      topicsJson: a.string().required(),
      notificationCadence: a.string().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['read'])]),

  /** Delivery ledger only; actual sends require communication consent at dispatch time. */
  NetworkNotification: a
    .model({
      memberId: a.string().required(),
      kind: a.string().required(),
      subject: a.string().required(),
      message: a.string().required(),
      subjectId: a.string(),
      status: a.string().required(),
      consentCheckedAt: a.datetime(),
      createdAt: a.datetime().required(),
      sentAt: a.datetime(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  /** Privacy-minimized aggregate, never a raw member activity stream. */
  NetworkMetric: a
    .model({
      period: a.string().required(),
      metric: a.string().required(),
      dimension: a.string(),
      value: a.integer().required(),
      computedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.groups(['admin']).to(['create', 'read', 'update'])]),

  /**
   * Consultation bookings mirrored from Calendly (`invitee.created` / `invitee.canceled` webhooks).
   * PK = invitee URI so updates/cancels upsert the same row.
   * Lambda IAM access for calendlyWebhook is only on the schema (`.authorization` below);
   * per-model `allow` does not support `.resource()` — that caused AssemblyError at deploy.
   */
  ConsultAppointment: a
    .model({
      owner: a.string(),
      calendlyInviteeUri: a.string().required(),
      calendlyScheduledEventUri: a.string(),
      inviteeEmail: a.string(),
      inviteeName: a.string(),
      eventName: a.string(),
      startTime: a.datetime(),
      endTime: a.datetime(),
      status: a.string().required(),
    })
    .identifier(['calendlyInviteeUri'])
    .authorization((allow) => [allow.ownerDefinedIn('owner')]),
}).authorization((allow) => [
  allow.resource(completeAssessment).to(['mutate', 'query']),
  allow.resource(calendlyWebhook).to(['mutate', 'query']),
  allow.resource(acceptNetworkInvitation).to(['mutate', 'query']),
  allow.resource(updateNetworkMemberProfile).to(['mutate', 'query']),
  allow.resource(getNetworkPublicData).to(['mutate', 'query']),
  allow.resource(networkMemberApi).to(['mutate', 'query']),
  allow.resource(networkAdminApi).to(['mutate', 'query']),
  allow.resource(verifyAuthChallengeResponse).to(['mutate', 'query']),
])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
