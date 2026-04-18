import { useCallback, useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { getUrl } from 'aws-amplify/storage'
import { hasPendingNewPasswordFlag } from '../lib/authFlags'

const client = generateClient()

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

/**
 * Loads dashboard entities from Amplify Data + optional avatar preview URL.
 */
export function useDashboardData() {
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [consultants, setConsultants] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const load = useCallback(async () => {
    setLoadError(null)
    setLoading(true)
    try {
      if (hasPendingNewPasswordFlag()) {
        return
      }
      const attrs = await fetchUserAttributes()
      setEmail(attrs.email || attrs.preferred_username || '')
      const { data: profiles } = await client.models.UserProfile.list({ limit: 1 })
      setProfile(profiles?.[0] ?? null)
      const assess = await listAllAssessments()
      setAssessments(assess)
      const { data: cons } = await client.models.Consultant.list()
      setConsultants(cons ?? [])
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

  return {
    client,
    email,
    profile,
    assessments,
    consultants,
    loading,
    loadError,
    load,
    avatarUrl,
  }
}
