import { defineBackend } from '@aws-amplify/backend'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { completeAssessment } from './functions/completeAssessment/resource'

const backend = defineBackend({
  auth,
  data,
  storage,
  completeAssessment,
})

backend.completeAssessment.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['cognito-idp:AdminCreateUser', 'cognito-idp:AdminDeleteUser'],
    resources: [backend.auth.resources.userPool.userPoolArn],
  }),
)

backend.completeAssessment.addEnvironment(
  'USER_POOL_ID',
  backend.auth.resources.userPool.userPoolId,
)

// CloudFormation AllowMethods only allows GET|PUT|HEAD|POST|PATCH|DELETE|* — not OPTIONS.
// Use * so browsers’ CORS preflight (OPTIONS) is allowed; listing OPTIONS fails validation.
const fnUrl = backend.completeAssessment.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['content-type', 'authorization'],
  },
})

backend.addOutput({
  custom: {
    completeAssessmentFunctionUrl: fnUrl.url,
  },
} as Parameters<typeof backend.addOutput>[0])
