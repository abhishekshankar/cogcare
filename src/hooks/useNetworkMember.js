import { useCallback, useEffect, useState } from 'react'
import { fetchMemberConsultantByEmail, updateMemberProfile } from '../services/networkMemberService.js'
import {
  fetchMemberBriefings,
  fetchMemberContributions,
  fetchMemberOpportunities,
  fetchOpportunityResponses,
  submitOpportunityResponse,
} from '../services/networkMemberContentService.js'
import { consultantToMemberProfileForm } from '../../lib/networkMemberProfile.js'

/**
 * @param {string} email
 */
export function useNetworkMember(email) {
  const [consultant, setConsultant] = useState(null)
  const [briefings, setBriefings] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [contributions, setContributions] = useState([])
  const [opportunityResponses, setOpportunityResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [profileForm, setProfileForm] = useState(() => consultantToMemberProfileForm(null))

  const load = useCallback(async () => {
    if (!email) {
      setConsultant(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const [member, responses, recorded] = await Promise.all([
        fetchMemberConsultantByEmail(email),
        fetchOpportunityResponses(email),
        fetchMemberContributions(email),
      ])
      setConsultant(member)
      setProfileForm(consultantToMemberProfileForm(member))
      setBriefings(fetchMemberBriefings(email))
      const ventures = consultantToMemberProfileForm(member).ventureAssociations
      setOpportunities(fetchMemberOpportunities(email, ventures))
      setOpportunityResponses(responses)
      setContributions(recorded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your network portal.')
    } finally {
      setLoading(false)
    }
  }, [email])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!email) {
        if (!cancelled) {
          setConsultant(null)
          setLoading(false)
        }
        return
      }

      if (!cancelled) {
        setLoading(true)
        setError('')
      }

      try {
        const [member, responses, recorded] = await Promise.all([
          fetchMemberConsultantByEmail(email),
          fetchOpportunityResponses(email),
          fetchMemberContributions(email),
        ])
        if (cancelled) return
        setConsultant(member)
        setProfileForm(consultantToMemberProfileForm(member))
        setBriefings(fetchMemberBriefings(email))
        const ventures = consultantToMemberProfileForm(member).ventureAssociations
        setOpportunities(fetchMemberOpportunities(email, ventures))
        setOpportunityResponses(responses)
        setContributions(recorded)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load your network portal.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [email])

  const saveProfile = useCallback(
    async (form) => {
      if (!email || !consultant?.id) {
        return { ok: false, error: 'Membership record not found.' }
      }
      setSaving(true)
      setError('')
      try {
        const result = await updateMemberProfile(email, form, consultant.id)
        if (!result.ok) {
          setError(result.error)
          return result
        }
        setConsultant(result.consultant)
        setProfileForm(consultantToMemberProfileForm(result.consultant))
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not save your settings.'
        setError(msg)
        return { ok: false, error: msg }
      } finally {
        setSaving(false)
      }
    },
    [email, consultant],
  )

  const respondToOpportunity = useCallback(
    async (opportunityId, kind) => {
      const result = await submitOpportunityResponse(email, opportunityId, kind)
      if (result.ok) {
        setOpportunityResponses((prev) => [
          ...prev.filter((r) => r.opportunityId !== opportunityId),
          result.response,
        ])
      }
      return result
    },
    [email],
  )

  return {
    consultant,
    briefings,
    opportunities,
    contributions,
    opportunityResponses,
    profileForm,
    setProfileForm,
    loading,
    error,
    saving,
    load,
    saveProfile,
    respondToOpportunity,
  }
}
