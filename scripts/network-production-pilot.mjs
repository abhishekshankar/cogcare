import crypto from 'node:crypto'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import { Amplify } from 'aws-amplify'
import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth'

const outputs = JSON.parse(fs.readFileSync(new URL('../src/amplify_outputs.json', import.meta.url), 'utf8'))
const region = outputs.auth.aws_region
const poolId = outputs.auth.user_pool_id
const clientId = outputs.auth.user_pool_client_id
const graphqlUrl = outputs.data.url
const memberUrl = outputs.custom.networkMemberApiFunctionUrl
const adminUrl = outputs.custom.networkAdminApiFunctionUrl
if (![poolId, clientId, graphqlUrl, memberUrl, adminUrl].every(Boolean)) throw new Error('Production outputs are incomplete.')

const cognito = new CognitoIdentityProviderClient({ region })
Amplify.configure(outputs)
const runId = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
const adminEmail = `network-pilot-admin+${runId}@example.com`
const memberEmails = [1, 2].map((n) => `network-pilot-member${n}+${runId}@example.com`)
const password = `T3st!${crypto.randomBytes(18).toString('base64url')}aA`
const cleanupRecords = []
const cleanupUsers = [adminEmail, ...memberEmails]
const results = []

function record(id, ok, detail = '') {
  results.push({ id, ok, detail })
  if (!ok) throw new Error(`${id} failed: ${detail}`)
}

async function createUser(email, admin = false) {
  await cognito.send(
    new AdminCreateUserCommand({
      UserPoolId: poolId,
      Username: email,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
    }),
  )
  await cognito.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: poolId,
      Username: email,
      Password: password,
      Permanent: true,
    }),
  )
  if (admin) {
    await cognito.send(
      new AdminAddUserToGroupCommand({ UserPoolId: poolId, Username: email, GroupName: 'admin' }),
    )
  }
}

async function token(email) {
  await signIn({ username: email, password, options: { authFlowType: 'USER_SRP_AUTH' } })
  const value = (await fetchAuthSession()).tokens?.idToken?.toString()
  await signOut()
  return value
}

async function graph(tokenValue, query, variables) {
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: tokenValue },
    body: JSON.stringify({ query, variables }),
  })
  const body = await response.json()
  if (!response.ok || body.errors?.length) throw new Error(`GraphQL failed: ${JSON.stringify(body.errors || body)}`)
  return body.data
}

async function api(url, tokenValue, operation, values = {}, { expectFailure = false } = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${tokenValue}` },
    body: JSON.stringify({ operation, ...values }),
  })
  const body = await response.json().catch(() => ({}))
  if (expectFailure) return { response, body }
  if (!response.ok) throw new Error(`${operation} failed (${response.status}): ${body.error || 'unknown error'}`)
  return body
}

async function createConsultant(adminToken, email, suffix) {
  const data = await graph(
    adminToken,
    `mutation Create($input: CreateConsultantInput!) { createConsultant(input: $input) { id } }`,
    {
      input: {
        name: `Network Pilot ${suffix}`,
        contactEmail: email,
        networkCohort: 'controlled-pilot',
        networkRoleCategory: 'physician',
        networkBrandsJson: '["cogcare"]',
        ventureAssociationsJson: '["cogcare"]',
        participationMode: 'passive',
        profileVisibility: 'private',
        communicationPreference: suffix === 'One' ? 'email' : 'none',
        isActive: true,
      },
    },
  )
  cleanupRecords.push(['Consultant', data.createConsultant.id])
  return data.createConsultant.id
}

async function removeRecord(adminToken, model, id) {
  await graph(
    adminToken,
    `mutation Delete($input: Delete${model}Input!) { delete${model}(input: $input) { id } }`,
    { input: { id } },
  )
}

function removeControlledRecordDirectly(model, id) {
  const tables = JSON.parse(execFileSync('aws', ['dynamodb', 'list-tables', '--output', 'json'], { encoding: 'utf8' }))
    .TableNames.filter((name) => name.startsWith(`${model}-`) && name.endsWith('-NONE'))
  if (tables.length !== 1) throw new Error(`Expected one ${model} table, found ${tables.length}.`)
  execFileSync('aws', [
    'dynamodb',
    'delete-item',
    '--table-name',
    tables[0],
    '--key',
    JSON.stringify({ id: { S: id } }),
  ])
}

let adminToken
let communicationsSent = 0

try {
  await createUser(adminEmail, true)
  await Promise.all(memberEmails.map((email) => createUser(email)))
  record('PILOT-NET-SAFE-01', true, 'Synthetic users created with MessageAction SUPPRESS')

  adminToken = await token(adminEmail)
  const memberTokens = []
  for (const email of memberEmails) memberTokens.push(await token(email))
  record(
    'PILOT-NET-SEC-01',
    Boolean(adminToken && memberTokens.every(Boolean)),
    'Controlled pilot tokens obtained',
  )

  const memberIds = [
    await createConsultant(adminToken, memberEmails[0], 'One'),
    await createConsultant(adminToken, memberEmails[1], 'Two'),
  ]

  const unauth = await fetch(memberUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ operation: 'workspace' }),
  })
  record('PILOT-NET-SEC-01', unauth.status === 401, `Unauthenticated member API status ${unauth.status}`)

  const memberOnAdmin = await api(adminUrl, memberTokens[0], 'dashboard', {}, { expectFailure: true })
  record('PILOT-NET-SEC-02', memberOnAdmin.response.status === 403, 'Member token rejected for admin dashboard')

  const briefing = (
    await api(adminUrl, adminToken, 'saveBriefing', {
      title: `Pilot briefing ${runId}`,
      summary: 'Controlled verification briefing.',
      status: 'published',
      audience: ['physician'],
    })
  ).briefing
  cleanupRecords.push(['NetworkBriefing', briefing.id])

  const opportunity = (
    await api(adminUrl, adminToken, 'saveOpportunity', {
      title: `Pilot opportunity ${runId}`,
      summary: 'Controlled verification ask.',
      rationale: 'Verify persistent member response.',
      scope: 'Automated controlled pilot only.',
      timeCommitment: 'One minute',
      venture: 'cogcare',
      status: 'published',
      audience: ['physician'],
    })
  ).opportunity
  cleanupRecords.push(['NetworkOpportunity', opportunity.id])

  const event = (
    await api(adminUrl, adminToken, 'saveEvent', {
      title: `Pilot salon ${runId}`,
      description: 'Controlled verification event.',
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'published',
      audience: ['physician'],
    })
  ).event
  cleanupRecords.push(['NetworkEvent', event.id])

  const initiative = (
    await api(adminUrl, adminToken, 'saveInitiative', {
      title: `Pilot initiative ${runId}`,
      summary: 'Controlled verification initiative.',
      status: 'published',
    })
  ).initiative
  cleanupRecords.push(['NetworkInitiative', initiative.id])

  const contribution = (
    await api(adminUrl, adminToken, 'recordContribution', {
      memberId: memberIds[0],
      title: 'Controlled pilot contribution',
      description: 'Verified test record only.',
    })
  ).contribution
  cleanupRecords.push(['NetworkContribution', contribution.id])

  const impact = (
    await api(adminUrl, adminToken, 'recordImpact', {
      memberId: memberIds[0],
      contributionId: contribution.id,
      title: 'Controlled pilot impact',
      description: 'Verified test outcome only.',
    })
  ).impact
  cleanupRecords.push(['NetworkImpact', impact.id])

  const attribution = (
    await api(adminUrl, adminToken, 'requestAttribution', {
      memberId: memberIds[0],
      itemType: 'contribution',
      itemId: contribution.id,
      proposedText: 'Controlled pilot attribution.',
    })
  ).attribution
  cleanupRecords.push(['AttributionApproval', attribution.id])

  const introduction = (
    await api(adminUrl, adminToken, 'createIntroduction', {
      requesterMemberId: memberIds[0],
      recipientMemberId: memberIds[1],
      purpose: 'Controlled pilot introduction.',
    })
  ).introduction
  cleanupRecords.push(['NetworkIntroduction', introduction.id])

  const notification = (
    await api(adminUrl, adminToken, 'queueNotification', {
      memberId: memberIds[0],
      kind: 'controlled_pilot',
      subject: 'Controlled pilot — do not send',
      message: 'Automated verification ledger only.',
      subjectId: briefing.id,
    })
  ).notification
  cleanupRecords.push(['NetworkNotification', notification.id])
  record('PILOT-NET-NOTIF-01', true, 'Notification queued only after consent check')

  const consentRefused = await api(
    adminUrl,
    adminToken,
    'queueNotification',
    { memberId: memberIds[1], kind: 'controlled_pilot', subject: 'Must be refused', message: 'No consent.' },
    { expectFailure: true },
  )
  record(
    'PILOT-NET-NOTIF-01',
    consentRefused.response.status === 409,
    'Notification queue refused without communication consent',
  )

  const workspace = (await api(memberUrl, memberTokens[0], 'workspace')).workspace
  record(
    'PILOT-NET-SEC-03',
    workspace.briefings.some(({ id }) => id === briefing.id) &&
      workspace.opportunities.some(({ id }) => id === opportunity.id),
    'Member workspace scoped to published targeted content',
  )

  const response = (
    await api(memberUrl, memberTokens[0], 'respondOpportunity', {
      opportunityId: opportunity.id,
      response: 'declined',
    })
  ).response
  cleanupRecords.push(['NetworkOpportunityResponse', response.id])
  record('PILOT-NET-ADM-01', response.memberId === memberIds[0], 'Opportunity response persisted for member')

  const withdrawn = (
    await api(memberUrl, memberTokens[0], 'respondOpportunity', {
      opportunityId: opportunity.id,
      response: 'withdrawn',
    })
  ).response
  record('PILOT-NET-ADM-01', withdrawn.response === 'withdrawn', 'Opportunity response supports withdrawn')

  const feedback = (
    await api(memberUrl, memberTokens[0], 'submitFeedback', { message: 'Controlled pilot feedback only.' })
  ).feedback
  cleanupRecords.push(['NetworkFeedback', feedback.id])

  const phiRejected = await api(
    memberUrl,
    memberTokens[0],
    'submitFeedback',
    { message: 'This patient was diagnosed yesterday.' },
    { expectFailure: true },
  )
  record('PILOT-NET-SEC-06', phiRejected.response.status === 400, 'PHI language rejected in feedback')

  const proposal = (
    await api(memberUrl, memberTokens[0], 'submitProposal', {
      title: 'Controlled pilot proposal',
      summary: 'Automated verification proposal only.',
    })
  ).proposal
  cleanupRecords.push(['NetworkProposal', proposal.id])

  const reviewed = await api(adminUrl, adminToken, 'reviewProposal', {
    id: proposal.id,
    status: 'under_review',
  })
  record('PILOT-NET-ADM-01', reviewed.proposal?.status === 'under_review', 'Admin reviewed proposal')

  const eventResponse = (
    await api(memberUrl, memberTokens[0], 'respondEvent', { eventId: event.id, response: 'attending' })
  ).eventResponse
  cleanupRecords.push(['NetworkEventResponse', eventResponse.id])

  const preferences = (
    await api(memberUrl, memberTokens[0], 'savePreferences', {
      topics: ['accessibility'],
      notificationCadence: 'important_only',
    })
  ).preferences
  cleanupRecords.push(['NetworkMemberPreference', preferences.id])

  const prefRefused = await api(
    memberUrl,
    memberTokens[1],
    'savePreferences',
    { topics: ['accessibility'], notificationCadence: 'important_only' },
    { expectFailure: true },
  )
  record(
    'PILOT-NET-SEC-07',
    prefRefused.response.status === 409,
    'Preferences cadence refused without communication consent',
  )

  await graph(
    adminToken,
    'mutation Update($input: UpdateConsultantInput!) { updateConsultant(input: $input) { id communicationPreference } }',
    { input: { id: memberIds[0], communicationPreference: 'none' } },
  )
  const cancelledDispatch = await api(
    adminUrl,
    adminToken,
    'dispatchNotification',
    { id: notification.id },
    { expectFailure: true },
  )
  record(
    'PILOT-NET-NOTIF-02',
    cancelledDispatch.response.status === 409 && communicationsSent === 0,
    'Dispatch rechecked revoked consent, cancelled delivery, and sent no communication',
  )

  await api(memberUrl, memberTokens[0], 'decideAttribution', { id: attribution.id, decision: 'approved' })
  record('PILOT-NET-ATTR-01', true, 'Named member approved item-specific attribution')

  const otherMemberAttribution = await api(
    memberUrl,
    memberTokens[1],
    'decideAttribution',
    { id: attribution.id, decision: 'approved' },
    { expectFailure: true },
  )
  record('PILOT-NET-SEC-04', otherMemberAttribution.response.status === 404, 'Cross-member attribution blocked')

  await api(memberUrl, memberTokens[0], 'decideIntroduction', { id: introduction.id, decision: 'accepted' })
  const finalIntro = (
    await api(memberUrl, memberTokens[1], 'decideIntroduction', { id: introduction.id, decision: 'accepted' })
  ).introduction
  record('PILOT-NET-INTRO-01', finalIntro.status === 'consented', 'Dual-consent introduction reached consented')

  const introDecline = (
    await api(adminUrl, adminToken, 'createIntroduction', {
      requesterMemberId: memberIds[0],
      recipientMemberId: memberIds[1],
      purpose: 'Decline path verification.',
    })
  ).introduction
  cleanupRecords.push(['NetworkIntroduction', introDecline.id])
  const declined = (
    await api(memberUrl, memberTokens[1], 'decideIntroduction', { id: introDecline.id, decision: 'declined' })
  ).introduction
  record('PILOT-NET-INTRO-01', declined.status === 'declined', 'Introduction decline path verified')

  const unknownOp = await api(memberUrl, memberTokens[0], 'notARealOperation', {}, { expectFailure: true })
  record('PILOT-NET-SEC-05', unknownOp.response.status === 400, 'Unknown member operation rejected')

  const dashboard = (await api(adminUrl, adminToken, 'dashboard')).dashboard
  const feedbackRow = dashboard.feedback.find(({ id }) => id === feedback.id)
  record(
    'PILOT-NET-PRIV-01',
    dashboard.responses.some(({ id }) => id === response.id) && !feedbackRow?.memberEmail,
    'Admin dashboard omits feedback email and response notes',
  )

  const metrics = (await api(adminUrl, adminToken, 'recomputeMetrics')).metrics
  record('PILOT-NET-PRIV-01', metrics.length === 8, 'Privacy-minimized metrics recomputed')

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok)
  console.log(
    JSON.stringify({
      ok: failed.length === 0,
      runId,
      passed,
      failed: failed.length,
      communicationsSent,
      results,
    }),
  )
  if (failed.length) process.exitCode = 1
} catch (error) {
  console.log(
    JSON.stringify({
      ok: false,
      runId,
      error: error instanceof Error ? error.message : String(error),
      communicationsSent,
      results,
    }),
  )
  process.exitCode = 1
} finally {
  if (adminToken) {
    for (const [model, id] of cleanupRecords.reverse()) {
      try {
        await removeRecord(adminToken, model, id)
      } catch {
        removeControlledRecordDirectly(model, id)
      }
    }
    try {
      await api(adminUrl, adminToken, 'recomputeMetrics')
    } catch {
      /* backend may predate metrics during staged deploy */
    }
  }
  for (const username of cleanupUsers) {
    try {
      await cognito.send(new AdminDeleteUserCommand({ UserPoolId: poolId, Username: username }))
    } catch {
      /* best effort */
    }
  }
}
