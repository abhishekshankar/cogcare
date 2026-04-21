import { useCallback, useEffect, useMemo, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getUrl } from 'aws-amplify/storage'
import { useSearchParams } from 'react-router-dom'
import { hasPendingNewPasswordFlag } from '../lib/authFlags'
import { ensureSelfSubject } from '../lib/ensureSelfSubject.js'
import { mergeGenericLovedOneSubjects } from '../lib/mergeGenericLovedOneSubjects.js'
import { isGenericLovedOneDisplayName } from '../lib/subjectLabels.js'

const client = generateClient()
const BACKFILL_KEY = 'cogcare:subjectBackfillDone'

async function listAllAssessments() {
  const all = []
  let nextToken = undefined
  for (;;) {
    const res = await client.models.Assessment.list({
      limit: 200,
      ...(nextToken ? { nextToken } : {}),
    })
    const batch = res.data ?? []
    all.push(...batch)
    nextToken = res.nextToken
    if (!nextToken) break
  }
  return all
}

async function listAllSubjects() {
  const all = []
  let nextToken = undefined
  for (;;) {
    const res = await client.models.Subject.list({
      limit: 200,
      ...(nextToken ? { nextToken } : {}),
    })
    const batch = res.data ?? []
    all.push(...batch)
    nextToken = res.nextToken
    if (!nextToken) break
  }
  return all
}

async function listConsultAppointments() {
  const all = []
  let nextToken = undefined
  for (;;) {
    const res = await client.models.ConsultAppointment.list({
      limit: 200,
      ...(nextToken ? { nextToken } : {}),
    })
    const batch = res.data ?? []
    all.push(...batch)
    nextToken = res.nextToken
    if (!nextToken) break
  }
  return all
}

/**
 * Backfill legacy assessments missing subjectId (idempotent per browser).
 */
async function backfillAssessmentSubjects(assessments, ownerSub) {
  if (typeof localStorage === 'undefined') return assessments
  if (localStorage.getItem(BACKFILL_KEY) === '1') return assessments
  let changed = false
  const out = [...assessments]
  for (let i = 0; i < out.length; i++) {
    const a = out[i]
    if (a.subjectId) continue
    try {
      const r = JSON.parse(a.resultsJson || '{}')
      const name =
        typeof r.lovedOneName === 'string' && r.lovedOneName.trim()
          ? r.lovedOneName.trim()
          : ''
      const age = typeof r.lovedOneAge === 'number' ? r.lovedOneAge : null
      const relation = typeof r.caregiverRelation === 'string' ? r.caregiverRelation : ''

      const { data: subs } = await client.models.Subject.list({ limit: 200 })
      let sid = null
      if (!name || isGenericLovedOneDisplayName(name)) {
        sid = await ensureSelfSubject(client, ownerSub)
      } else {
        const key = name.toLowerCase()
        sid = subs?.find(
          (s) =>
            !s.isSelf &&
            (s.displayName?.trim().toLowerCase() ?? '') === key &&
            (s.age ?? null) === (age ?? null),
        )?.id

        if (!sid) {
          const { data: created, errors } = await client.models.Subject.create({
            owner: ownerSub,
            displayName: name,
            age: age ?? undefined,
            relation: relation || undefined,
            isSelf: false,
            createdAt: new Date().toISOString(),
          })
          if (errors?.length || !created?.id) continue
          sid = created.id
        }
      }
      if (sid && a.id) {
        const { errors: upErr } = await client.models.Assessment.update({ id: a.id, subjectId: sid })
        if (!upErr?.length) {
          out[i] = { ...a, subjectId: sid }
          changed = true
        }
      }
    } catch {
      /* ignore row */
    }
  }
  if (changed) localStorage.setItem(BACKFILL_KEY, '1')
  return out
}

/**
 * Loads dashboard entities from Amplify Data + optional avatar preview URL.
 */
export function useDashboardData() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState(null)
  const [sub, setSub] = useState('')
  const [assessments, setAssessments] = useState([])
  const [subjects, setSubjects] = useState([])
  const [consultants, setConsultants] = useState([])
  const [consultAppointments, setConsultAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const activeSubjectId = useMemo(() => {
    if (!subjects?.length) return null
    const fromUrl = searchParams.get('subjectId')
    if (fromUrl && subjects.some((s) => s.id === fromUrl)) return fromUrl
    try {
      const stored = localStorage.getItem('cogcare:activeSubjectId')
      if (stored && subjects.some((s) => s.id === stored)) return stored
    } catch {
      /* ignore */
    }
    if (profile?.defaultSubjectId && subjects.some((s) => s.id === profile.defaultSubjectId)) {
      return profile.defaultSubjectId
    }
    return subjects[0].id
  }, [subjects, profile?.defaultSubjectId, searchParams])

  const setActiveSubjectId = useCallback(
    (id) => {
      try {
        localStorage.setItem('cogcare:activeSubjectId', id)
      } catch {
        /* ignore */
      }
      const next = new URLSearchParams(searchParams)
      next.set('subjectId', id)
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const load = useCallback(async () => {
    setLoadError(null)
    setLoading(true)
    try {
      if (hasPendingNewPasswordFlag()) {
        return
      }
      const attrs = await fetchUserAttributes()
      const ownerSub = attrs.sub || ''
      setSub(ownerSub)
      setEmail(attrs.email || attrs.preferred_username || '')
      const { data: profiles } = await client.models.UserProfile.list({ limit: 1 })
      setProfile(profiles?.[0] ?? null)
      let assess = await listAllAssessments()
      if (ownerSub) {
        assess = await backfillAssessmentSubjects(assess, ownerSub)
      }
      let subjList = await listAllSubjects()
      let appts = await listConsultAppointments()
      if (ownerSub) {
        const { mutated } = await mergeGenericLovedOneSubjects(
          client,
          ownerSub,
          subjList,
          assess,
          appts,
        )
        if (mutated) {
          assess = await listAllAssessments()
          subjList = await listAllSubjects()
          appts = await listConsultAppointments()
        }
      }
      setAssessments(assess)
      setSubjects(subjList.filter((s) => !s.archivedAt))
      const { data: cons } = await client.models.Consultant.list()
      setConsultants(cons ?? [])
      setConsultAppointments(appts ?? [])
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not load your data. Please try again.'
      setLoadError(msg)
      if (import.meta.env.DEV) console.error('[dashboard load]', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!profile?.avatarKey) {
        setAvatarUrl(null)
        return
      }
      try {
        const u = await getUrl({ path: profile.avatarKey })
        if (!cancelled) setAvatarUrl(u.url.toString())
      } catch {
        if (!cancelled) setAvatarUrl(null)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [profile?.avatarKey])

  const assessmentsForActiveSubject = useMemo(() => {
    if (!activeSubjectId) return assessments
    return assessments.filter((a) => a.subjectId === activeSubjectId)
  }, [assessments, activeSubjectId])

  const appointmentsForActiveSubject = useMemo(() => {
    if (!activeSubjectId) return consultAppointments
    return consultAppointments.filter((a) => a.subjectId === activeSubjectId)
  }, [consultAppointments, activeSubjectId])

  return {
    client,
    email,
    sub,
    profile,
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    assessments,
    assessmentsForActiveSubject,
    consultants,
    consultAppointments,
    appointmentsForActiveSubject,
    loading,
    loadError,
    load,
    avatarUrl,
  }
}
