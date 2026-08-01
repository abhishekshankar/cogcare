import { defineBackend } from '@aws-amplify/backend'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { completeAssessment } from './functions/completeAssessment/resource'
import { calendlyWebhook } from './functions/calendlyWebhook/resource'
import { acceptNetworkInvitation } from './functions/acceptNetworkInvitation/resource'
import { updateNetworkMemberProfile } from './functions/updateNetworkMemberProfile/resource'
import { getNetworkPublicData } from './functions/getNetworkPublicData/resource'
import { sendNetworkInvitation } from './functions/sendNetworkInvitation/resource'
import { networkMemberApi } from './functions/networkMemberApi/resource'
import { networkAdminApi } from './functions/networkAdminApi/resource'

const backend = defineBackend({
  auth,
  data,
  storage,
  completeAssessment,
  calendlyWebhook,
  acceptNetworkInvitation,
  updateNetworkMemberProfile,
  getNetworkPublicData,
  sendNetworkInvitation,
  networkMemberApi,
  networkAdminApi,
})

backend.completeAssessment.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminDeleteUser',
      'cognito-idp:AdminGetUser',
      'cognito-idp:AdminSetUserPassword',
    ],
    resources: [backend.auth.resources.userPool.userPoolArn],
  }),
)

backend.completeAssessment.addEnvironment(
  'USER_POOL_ID',
  backend.auth.resources.userPool.userPoolId,
)

/** Public origin + path prefix for magic links (no trailing slash). Set in CI / sandbox env. */
backend.completeAssessment.addEnvironment(
  'APP_BASE_URL',
  process.env.APP_BASE_URL ?? 'http://localhost:5173',
)

backend.calendlyWebhook.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['cognito-idp:AdminGetUser'],
    resources: [backend.auth.resources.userPool.userPoolArn],
  }),
)

backend.calendlyWebhook.addEnvironment(
  'USER_POOL_ID',
  backend.auth.resources.userPool.userPoolId,
)

backend.acceptNetworkInvitation.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId)
backend.acceptNetworkInvitation.addEnvironment('USER_POOL_CLIENT_ID', backend.auth.resources.userPoolClient.userPoolClientId)
backend.updateNetworkMemberProfile.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId)
backend.updateNetworkMemberProfile.addEnvironment('USER_POOL_CLIENT_ID', backend.auth.resources.userPoolClient.userPoolClientId)
backend.sendNetworkInvitation.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId)
backend.sendNetworkInvitation.addEnvironment('USER_POOL_CLIENT_ID', backend.auth.resources.userPoolClient.userPoolClientId)
backend.sendNetworkInvitation.addEnvironment('APP_BASE_URL', process.env.APP_BASE_URL ?? 'http://localhost:5173')
backend.networkMemberApi.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId)
backend.networkMemberApi.addEnvironment('USER_POOL_CLIENT_ID', backend.auth.resources.userPoolClient.userPoolClientId)
backend.networkAdminApi.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId)
backend.networkAdminApi.addEnvironment('USER_POOL_CLIENT_ID', backend.auth.resources.userPoolClient.userPoolClientId)

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

const calendlyFnUrl = backend.calendlyWebhook.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['content-type', 'calendly-webhook-signature'],
  },
})

const acceptInviteFnUrl = backend.acceptNetworkInvitation.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['content-type', 'authorization'],
  },
})

const updateMemberProfileFnUrl = backend.updateNetworkMemberProfile.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['content-type', 'authorization'],
  },
})

const networkPublicDataFnUrl = backend.getNetworkPublicData.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['content-type'],
  },
})

const sendNetworkInvitationFnUrl = backend.sendNetworkInvitation.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ['content-type', 'authorization'],
  },
})

const networkMemberApiFnUrl = backend.networkMemberApi.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: { allowedOrigins: ['*'], allowedMethods: [HttpMethod.ALL], allowedHeaders: ['content-type', 'authorization'] },
})

const networkAdminApiFnUrl = backend.networkAdminApi.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: { allowedOrigins: ['*'], allowedMethods: [HttpMethod.ALL], allowedHeaders: ['content-type', 'authorization'] },
})

backend.addOutput({
  custom: {
    completeAssessmentFunctionUrl: fnUrl.url,
    calendlyWebhookFunctionUrl: calendlyFnUrl.url,
    acceptNetworkInvitationFunctionUrl: acceptInviteFnUrl.url,
    updateNetworkMemberProfileFunctionUrl: updateMemberProfileFnUrl.url,
    networkPublicDataFunctionUrl: networkPublicDataFnUrl.url,
    sendNetworkInvitationFunctionUrl: sendNetworkInvitationFnUrl.url,
    networkMemberApiFunctionUrl: networkMemberApiFnUrl.url,
    networkAdminApiFunctionUrl: networkAdminApiFnUrl.url,
  },
} as Parameters<typeof backend.addOutput>[0])
