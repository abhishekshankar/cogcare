import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { completeAssessment } from '../functions/completeAssessment/resource'

const schema = a.schema({
  UserProfile: a
    .model({
      displayName: a.string(),
      avatarKey: a.string(),
      brainCreditScore: a.integer(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),

  /** Per-email daily cap for completeAssessment (Lambda). PK slotKey = email#YYYY-MM-DD (UTC). */
  OnboardingAttempt: a
    .model({
      slotKey: a.string().required(),
      hitCount: a.integer().required(),
    })
    .identifier(['slotKey'])
    .authorization((allow) => [
      // Per-model `allow` has no `.resource()` (Amplify strips it — see ModelType.authorization).
      // Schema-level `allow.resource(completeAssessment)` still wires Lambda IAM access.
      // GraphQL auth for this model: IAM / Identity Pool (matches Lambda data client).
      allow.authenticated('identityPool').to(['create', 'read', 'update', 'delete']),
    ]),

  Assessment: a
    .model({
      type: a.string().required(),
      answersJson: a.string().required(),
      resultsJson: a.string().required(),
      completedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.owner()]),

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
}).authorization((allow) => [
  allow.resource(completeAssessment).to(['mutate', 'query']),
])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
