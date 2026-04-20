import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { completeAssessment } from '../functions/completeAssessment/resource'
import { verifyAuthChallengeResponse } from '../auth/verify-auth-challenge-response/resource'
import { calendlyWebhook } from '../functions/calendlyWebhook/resource'

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
      title: a.string(),
      bio: a.string(),
      photoUrl: a.string(),
      bookingUrl: a.string(),
      contactEmail: a.string(),
      sortOrder: a.integer(),
    })
    .authorization((allow) => [allow.authenticated().to(['read'])]),

  /**
   * Booked or pending consults; `owner` is Cognito sub. Webhook Lambda uses IAM to upsert rows.
   */
  ConsultAppointment: a
    .model({
      owner: a.string(),
      subjectId: a.string().required(),
      assessmentId: a.string(),
      consultantId: a.string(),
      eventName: a.string(),
      startTime: a.datetime(),
      endTime: a.datetime(),
      /** pending | scheduled | canceled | completed */
      status: a.string().required(),
      calendlyInviteeUri: a.string(),
      calendlyEventUri: a.string(),
      cancelUrl: a.string(),
      rescheduleUrl: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.ownerDefinedIn('owner'),
      allow.authenticated('identityPool').to(['create', 'read', 'update', 'delete']),
    ]),
}).authorization((allow) => [
  allow.resource(completeAssessment).to(['mutate', 'query']),
  allow.resource(verifyAuthChallengeResponse).to(['mutate', 'query']),
  allow.resource(calendlyWebhook).to(['mutate', 'query']),
])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
