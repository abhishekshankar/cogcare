import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { completeAssessment } from '../functions/completeAssessment/resource'
import { calendlyWebhook } from '../functions/calendlyWebhook/resource'
import { acceptNetworkInvitation } from '../functions/acceptNetworkInvitation/resource'
import { updateNetworkMemberProfile } from '../functions/updateNetworkMemberProfile/resource'
import { getNetworkPublicData } from '../functions/getNetworkPublicData/resource'
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
      allow.authenticated().to(['read']),
      allow.groups(['admin']).to(['create', 'read', 'update', 'delete']),
    ]),

  /**
   * Invitation-only onboarding for The Cogcare Cognition Network.
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
  allow.resource(getNetworkPublicData).to(['query']),
  allow.resource(verifyAuthChallengeResponse).to(['mutate', 'query']),
])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
