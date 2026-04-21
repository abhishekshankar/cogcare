import { computeBrainCreditFromResults } from '../../lib/brainCredit.js'

const RELATION_CHOICES = ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other']

function parseQuizSubject(answers) {
  const nameRaw = answers.name
  const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
  const age =
    typeof answers.age === 'number' && !Number.isNaN(answers.age) && answers.age > 0
      ? Math.floor(answers.age)
      : null
  let relationLabel = ''
  const rel = answers.relation
  if (typeof rel === 'number' && rel >= 1 && rel <= RELATION_CHOICES.length) {
    relationLabel = RELATION_CHOICES[rel - 1] ?? ''
  }
  return {
    name: name || 'Your loved one',
    age,
    relationLabel,
  }
}

async function upsertLovedOneSubject(client, ownerSub, parsed) {
  const displayName = parsed.name
  const age = parsed.age
  const keyName = displayName.trim().toLowerCase()
  const { data: list } = await client.models.Subject.list({
    filter: { owner: { eq: ownerSub } },
    limit: 200,
  })
  const match = list?.find(
    (s) =>
      !s.isSelf &&
      (s.displayName?.trim().toLowerCase() ?? '') === keyName &&
      (s.age ?? null) === (age ?? null),
  )
  if (match?.id) return match.id

  const createdAt = new Date().toISOString()
  const { data: row, errors } = await client.models.Subject.create({
    owner: ownerSub,
    displayName,
    age: age ?? undefined,
    relation: parsed.relationLabel || undefined,
    isSelf: false,
    createdAt,
  })
  if (errors?.length || !row?.id) {
    throw new Error(errors?.map((e) => e.message).join('; ') || 'Could not create subject')
  }
  return row.id
}

async function listAllAssessments(client) {
  const all = []
  let nextToken = undefined
  for (;;) {
    const res = await client.models.Assessment.list({
      limit: 200,
      ...(nextToken ? { nextToken } : {}),
    })
    all.push(...(res.data ?? []))
    nextToken = res.nextToken
    if (!nextToken) break
  }
  return all
}

/**
 * Save a completed BHI from the signed-in dashboard (no email lambda).
 * @param {object} params
 * @param {import('aws-amplify/data').generateClient} params.client
 * @param {string} params.ownerSub
 * @param {Record<string, unknown>} params.answers
 * @param {object|null} params.results
 * @param {string|null} params.existingSubjectId — skip upsert when set
 * @returns {Promise<{ subjectId: string, assessmentId: string, createdNewSubject: boolean }>}
 */
export async function persistDashboardAssessment({
  client,
  ownerSub,
  answers,
  results,
  existingSubjectId,
}) {
  let subjectId = existingSubjectId
  let createdNewSubject = false
  let careDisplayName = ''
  if (!subjectId) {
    const parsed = parseQuizSubject(answers)
    careDisplayName = parsed.name
    subjectId = await upsertLovedOneSubject(client, ownerSub, parsed)
    createdNewSubject = true
  } else {
    const { data: subRow } = await client.models.Subject.get({ id: existingSubjectId })
    careDisplayName = subRow?.displayName?.trim() || 'This person'
  }

  const completedAt = new Date().toISOString()
  const { data: createdAssessment, errors: assessmentErrors } = await client.models.Assessment.create({
    type: 'BHI',
    answersJson: JSON.stringify(answers ?? {}),
    resultsJson: JSON.stringify(results ?? {}),
    completedAt,
    owner: ownerSub,
    subjectId,
  })
  if (assessmentErrors?.length || !createdAssessment?.id) {
    throw new Error(
      assessmentErrors?.map((e) => e.message).join('; ') || 'Assessment create failed',
    )
  }

  const existing = await listAllAssessments(client)
  const count = existing.length
  const newCredit = computeBrainCreditFromResults(results, { completedAssessmentCount: count })

  const { data: profiles } = await client.models.UserProfile.list({ limit: 1 })
  const profileRow = profiles?.[0]
  if (profileRow?.id) {
    await client.models.UserProfile.update({
      id: profileRow.id,
      brainCreditScore: newCredit,
    })
  }

  return {
    subjectId,
    assessmentId: createdAssessment.id,
    createdNewSubject,
    careDisplayName,
  }
}

/**
 * Prefill BHI `quizAnswers` for name / age / relation from a Subject row.
 * @param {{ displayName?: string|null, age?: number|null, relation?: string|null, isSelf?: boolean }} s
 */
export function buildInitialAnswersFromSubject(s) {
  const relationOptions = ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other']
  let relation = 5
  if (typeof s.relation === 'string' && s.relation !== 'self') {
    const idx = relationOptions.indexOf(s.relation)
    if (idx >= 0) relation = idx + 1
  }
  return {
    name: (s.displayName || '').trim(),
    age: typeof s.age === 'number' && s.age > 0 ? s.age : undefined,
    relation,
  }
}

export { parseQuizSubject, upsertLovedOneSubject }
