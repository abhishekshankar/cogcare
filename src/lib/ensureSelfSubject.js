/**
 * Ensure the signed-in user has a Subject row with `isSelf: true` (display "Myself").
 * @param {import('aws-amplify/data').generateClient} client
 * @param {string} ownerSub Cognito sub
 * @returns {Promise<string>} subject id
 */
export async function ensureSelfSubject(client, ownerSub) {
  const { data: profiles } = await client.models.UserProfile.list({
    filter: { owner: { eq: ownerSub } },
    limit: 1,
  })
  const profile = profiles?.[0]
  if (profile?.defaultSubjectId) {
    const { data: existing } = await client.models.Subject.get({ id: profile.defaultSubjectId })
    if (existing?.id) return existing.id
  }
  const createdAt = new Date().toISOString()
  const { data: selfRow, errors } = await client.models.Subject.create({
    owner: ownerSub,
    displayName: 'Myself',
    relation: 'self',
    isSelf: true,
    createdAt,
  })
  if (errors?.length || !selfRow?.id) {
    throw new Error(errors?.map((e) => e.message).join('; ') || 'Could not create self subject')
  }
  if (profile?.id) {
    await client.models.UserProfile.update({
      id: profile.id,
      defaultSubjectId: selfRow.id,
    })
  }
  return selfRow.id
}
