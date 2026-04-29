/**
 * Collapse duplicate Subject rows that represent the same person (same name for non-self,
 * or multiple self rows) so the BHI chooser lists each person once.
 *
 * Tie-break when picking the canonical row: most assessments, then newer createdAt, then id.
 *
 * @param {Array<{ id: string, displayName?: string|null, isSelf?: boolean|null, createdAt?: string|null }>} subjects
 * @param {Array<{ subjectId?: string|null }>} assessments
 * @returns {{ canonicalList: typeof subjects, idToCanonical: Map<string, typeof subjects[0]> }}
 */
export function resolveSubjectChooserGroups(subjects, assessments) {
  const empty = { canonicalList: [], idToCanonical: new Map() }
  if (!subjects?.length) return empty

  const counts = new Map()
  for (const a of assessments ?? []) {
    if (!a?.subjectId) continue
    counts.set(a.subjectId, (counts.get(a.subjectId) ?? 0) + 1)
  }

  const pickBetter = (a, b) => {
    const ca = counts.get(a.id) ?? 0
    const cb = counts.get(b.id) ?? 0
    if (cb !== ca) return cb > ca ? b : a
    const da = a.createdAt || ''
    const db = b.createdAt || ''
    if (db !== da) return db > da ? b : a
    return a.id < b.id ? a : b
  }

  const keyOf = (s) => {
    if (s.isSelf) return '__self__'
    const n = (s.displayName ?? '').trim().toLowerCase()
    return n || `__id:${s.id}`
  }

  /** @type {Map<string, typeof subjects>} */
  const groups = new Map()
  for (const s of subjects) {
    const key = keyOf(s)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(s)
  }

  const idToCanonical = new Map()
  const canonicalList = []

  for (const members of groups.values()) {
    const canonical = members.reduce((best, s) => pickBetter(best, s))
    canonicalList.push(canonical)
    for (const m of members) {
      idToCanonical.set(m.id, canonical)
    }
  }

  canonicalList.sort((a, b) => {
    if (a.isSelf && !b.isSelf) return -1
    if (!a.isSelf && b.isSelf) return 1
    return (a.displayName || '').localeCompare(b.displayName || '', undefined, { sensitivity: 'base' })
  })

  return { canonicalList, idToCanonical }
}
