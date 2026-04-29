import { ensureSelfSubject } from './ensureSelfSubject.js'
import { isGenericLovedOneDisplayName } from './subjectLabels.js'

/**
 * Re-point assessments and consults from generic placeholder subjects to the self subject, then archive placeholders.
 * @returns {Promise<{ mutated: boolean }>}
 */
export async function mergeGenericLovedOneSubjects(client, ownerSub, subjects, assessments, appointments) {
  const placeholders = subjects.filter(
    (s) =>
      (!s.owner || s.owner === ownerSub) &&
      !s.isSelf &&
      !s.archivedAt &&
      isGenericLovedOneDisplayName(s.displayName),
  )
  if (!placeholders.length) {
    return { mutated: false }
  }

  const selfId = await ensureSelfSubject(client, ownerSub)
  const placeholderIds = new Set(placeholders.map((p) => p.id))
  const now = new Date().toISOString()

  for (const a of assessments) {
    if (a.subjectId && placeholderIds.has(a.subjectId)) {
      await client.models.Assessment.update({ id: a.id, subjectId: selfId })
    }
  }
  for (const ap of appointments ?? []) {
    if (ap.subjectId && placeholderIds.has(ap.subjectId)) {
      await client.models.ConsultAppointment.update({ id: ap.id, subjectId: selfId })
    }
  }
  for (const p of placeholders) {
    await client.models.Subject.update({ id: p.id, archivedAt: now })
  }

  return { mutated: true }
}
