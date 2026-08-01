import crypto from 'node:crypto'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import {
  AdminAddUserToGroupCommand, AdminCreateUserCommand, AdminDeleteUserCommand,
  AdminSetUserPasswordCommand, CognitoIdentityProviderClient,
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

async function createUser(email, admin = false) {
  await cognito.send(new AdminCreateUserCommand({ UserPoolId: poolId, Username: email, MessageAction: 'SUPPRESS',
    UserAttributes: [{ Name: 'email', Value: email }, { Name: 'email_verified', Value: 'true' }] }))
  await cognito.send(new AdminSetUserPasswordCommand({ UserPoolId: poolId, Username: email, Password: password, Permanent: true }))
  if (admin) await cognito.send(new AdminAddUserToGroupCommand({ UserPoolId: poolId, Username: email, GroupName: 'admin' }))
}

async function token(email) {
  await signIn({ username: email, password, options: { authFlowType: 'USER_SRP_AUTH' } })
  const value = (await fetchAuthSession()).tokens?.idToken?.toString()
  await signOut()
  return value
}

async function graph(tokenValue, query, variables) {
  const response = await fetch(graphqlUrl, { method: 'POST', headers: { 'content-type': 'application/json', authorization: tokenValue }, body: JSON.stringify({ query, variables }) })
  const body = await response.json()
  if (!response.ok || body.errors?.length) throw new Error(`GraphQL failed: ${JSON.stringify(body.errors || body)}`)
  return body.data
}

async function api(url, tokenValue, operation, values = {}) {
  const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${tokenValue}` }, body: JSON.stringify({ operation, ...values }) })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${operation} failed (${response.status}): ${body.error || 'unknown error'}`)
  return body
}

async function createConsultant(adminToken, email, suffix) {
  const data = await graph(adminToken, `mutation Create($input: CreateConsultantInput!) { createConsultant(input: $input) { id } }`, {
    input: { name: `Network Pilot ${suffix}`, contactEmail: email, networkCohort: 'controlled-pilot',
      networkRoleCategory: 'physician', networkBrandsJson: '["cogcare"]', ventureAssociationsJson: '["cogcare"]',
      participationMode: 'passive', profileVisibility: 'private', communicationPreference: 'email', isActive: true },
  })
  cleanupRecords.push(['Consultant', data.createConsultant.id])
  return data.createConsultant.id
}

async function removeRecord(adminToken, model, id) {
  await graph(adminToken, `mutation Delete($input: Delete${model}Input!) { delete${model}(input: $input) { id } }`, { input: { id } })
}

function removeControlledRecordDirectly(model, id) {
  const tables = JSON.parse(execFileSync('aws', ['dynamodb', 'list-tables', '--output', 'json'], { encoding: 'utf8' })).TableNames
    .filter((name) => name.startsWith(`${model}-`) && name.endsWith('-NONE'))
  if (tables.length !== 1) throw new Error(`Expected one ${model} table, found ${tables.length}.`)
  execFileSync('aws', ['dynamodb', 'delete-item', '--table-name', tables[0], '--key', JSON.stringify({ id: { S: id } })])
}

let adminToken
try {
  await createUser(adminEmail, true)
  await Promise.all(memberEmails.map((email) => createUser(email)))
  adminToken = await token(adminEmail)
  const memberTokens = []
  for (const email of memberEmails) memberTokens.push(await token(email))
  if (!adminToken || memberTokens.some((value) => !value)) throw new Error('Could not obtain controlled pilot tokens.')
  const memberIds = [
    await createConsultant(adminToken, memberEmails[0], 'One'),
    await createConsultant(adminToken, memberEmails[1], 'Two'),
  ]

  const briefing = (await api(adminUrl, adminToken, 'saveBriefing', { title: `Pilot briefing ${runId}`, summary: 'Controlled verification briefing.', status: 'published', audience: ['physician'] })).briefing
  cleanupRecords.push(['NetworkBriefing', briefing.id])
  const opportunity = (await api(adminUrl, adminToken, 'saveOpportunity', { title: `Pilot opportunity ${runId}`, summary: 'Controlled verification ask.', rationale: 'Verify persistent member response.', scope: 'Automated controlled pilot only.', timeCommitment: 'One minute', venture: 'cogcare', status: 'published', audience: ['physician'] })).opportunity
  cleanupRecords.push(['NetworkOpportunity', opportunity.id])
  const event = (await api(adminUrl, adminToken, 'saveEvent', { title: `Pilot salon ${runId}`, description: 'Controlled verification event.', startsAt: new Date(Date.now() + 86400000).toISOString(), status: 'published', audience: ['physician'] })).event
  cleanupRecords.push(['NetworkEvent', event.id])
  const initiative = (await api(adminUrl, adminToken, 'saveInitiative', { title: `Pilot initiative ${runId}`, summary: 'Controlled verification initiative.', status: 'published' })).initiative
  cleanupRecords.push(['NetworkInitiative', initiative.id])
  const contribution = (await api(adminUrl, adminToken, 'recordContribution', { memberId: memberIds[0], title: 'Controlled pilot contribution', description: 'Verified test record only.' })).contribution
  cleanupRecords.push(['NetworkContribution', contribution.id])
  const impact = (await api(adminUrl, adminToken, 'recordImpact', { memberId: memberIds[0], contributionId: contribution.id, title: 'Controlled pilot impact', description: 'Verified test outcome only.' })).impact
  cleanupRecords.push(['NetworkImpact', impact.id])
  const attribution = (await api(adminUrl, adminToken, 'requestAttribution', { memberId: memberIds[0], itemType: 'contribution', itemId: contribution.id, proposedText: 'Controlled pilot attribution.' })).attribution
  cleanupRecords.push(['AttributionApproval', attribution.id])
  const introduction = (await api(adminUrl, adminToken, 'createIntroduction', { requesterMemberId: memberIds[0], recipientMemberId: memberIds[1], purpose: 'Controlled pilot introduction.' })).introduction
  cleanupRecords.push(['NetworkIntroduction', introduction.id])
  const notification = (await api(adminUrl, adminToken, 'queueNotification', { memberId: memberIds[0], kind: 'controlled_pilot', subject: 'Controlled pilot — do not send', message: 'Automated verification ledger only.', subjectId: briefing.id })).notification
  cleanupRecords.push(['NetworkNotification', notification.id])

  const workspace = (await api(memberUrl, memberTokens[0], 'workspace')).workspace
  if (!workspace.briefings.some(({ id }) => id === briefing.id) || !workspace.opportunities.some(({ id }) => id === opportunity.id)) throw new Error('Targeted published content did not reach the member workspace.')
  const response = (await api(memberUrl, memberTokens[0], 'respondOpportunity', { opportunityId: opportunity.id, response: 'declined' })).response
  cleanupRecords.push(['NetworkOpportunityResponse', response.id])
  const feedback = (await api(memberUrl, memberTokens[0], 'submitFeedback', { message: 'Controlled pilot feedback only.' })).feedback
  cleanupRecords.push(['NetworkFeedback', feedback.id])
  const proposal = (await api(memberUrl, memberTokens[0], 'submitProposal', { title: 'Controlled pilot proposal', summary: 'Automated verification proposal only.' })).proposal
  cleanupRecords.push(['NetworkProposal', proposal.id])
  const eventResponse = (await api(memberUrl, memberTokens[0], 'respondEvent', { eventId: event.id, response: 'attending' })).eventResponse
  cleanupRecords.push(['NetworkEventResponse', eventResponse.id])
  const preferences = (await api(memberUrl, memberTokens[0], 'savePreferences', { topics: ['accessibility'], notificationCadence: 'important_only' })).preferences
  cleanupRecords.push(['NetworkMemberPreference', preferences.id])
  await api(memberUrl, memberTokens[0], 'decideAttribution', { id: attribution.id, decision: 'approved' })
  await api(memberUrl, memberTokens[0], 'decideIntroduction', { id: introduction.id, decision: 'accepted' })
  const finalIntro = (await api(memberUrl, memberTokens[1], 'decideIntroduction', { id: introduction.id, decision: 'accepted' })).introduction
  if (finalIntro.status !== 'consented') throw new Error('Dual-consent introduction did not reach consented state.')

  const dashboard = (await api(adminUrl, adminToken, 'dashboard')).dashboard
  if (!dashboard.responses.some(({ id }) => id === response.id) || dashboard.feedback.find(({ id }) => id === feedback.id)?.memberEmail) throw new Error('Admin privacy-minimized dashboard verification failed.')
  console.log(JSON.stringify({ ok: true, runId, checks: 18, communicationsSent: 0 }))
} finally {
  if (adminToken) {
    for (const [model, id] of cleanupRecords.reverse()) {
      try { await removeRecord(adminToken, model, id) }
      catch { removeControlledRecordDirectly(model, id) }
    }
  }
  for (const username of cleanupUsers) {
    try { await cognito.send(new AdminDeleteUserCommand({ UserPoolId: poolId, Username: username })) } catch { /* best effort */ }
  }
}
