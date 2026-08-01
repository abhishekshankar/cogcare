import { useCallback, useEffect, useState } from 'react'
import { fetchMemberConsultantByEmail, updateMemberProfile } from '../services/networkMemberService.js'
import {
  fetchMemberBriefings,
  fetchMemberWorkspace,
  fetchMemberContributions,
  fetchMemberOpportunities,
  fetchOpportunityResponses,
  submitOpportunityResponse,
} from '../services/networkMemberContentService.js'
import { consultantToMemberProfileForm } from '../../lib/networkMemberProfile.js'
import { filterOpportunitiesForVentures } from '../../lib/networkVentureAssociation.js'

/**
 * @param {string} email
 */
export function useNetworkMember(email) {
  const [consultant, setConsultant] = useState(null)
  const [briefings, setBriefings] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [contributions, setContributions] = useState([])
  const [opportunityResponses, setOpportunityResponses] = useState([])
  const [workspace, setWorkspace] = useState(null)
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
      const member = await fetchMemberConsultantByEmail(email)
      const workspace = await fetchMemberWorkspace()
      setWorkspace(workspace)
      const [responses, recorded] = workspace ? [workspace.responses ?? [], workspace.contributions ?? []] : await Promise.all([
        fetchOpportunityResponses(email), fetchMemberContributions(email),
      ])
      setConsultant(member)
      setProfileForm(consultantToMemberProfileForm(member))
      const ventures = consultantToMemberProfileForm(member).ventureAssociations
      setBriefings(
        workspace && Object.prototype.hasOwnProperty.call(workspace, 'briefings')
          ? workspace.briefings
          : fetchMemberBriefings(email),
      )
      const mappedOpportunities = workspace && Object.prototype.hasOwnProperty.call(workspace, 'opportunities')
        ? workspace.opportunities?.map((item) => ({ ...item, why: item.rationale, brand: item.venture }))
        : null
      setOpportunities(
        mappedOpportunities
          ? filterOpportunitiesForVentures(mappedOpportunities, ventures)
          : fetchMemberOpportunities(email, ventures),
      )
      setOpportunityResponses(responses.map((item) => ({ ...item, kind: item.kind ?? (item.response === 'interested' ? 'interest' : item.response) })))
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
        const member = await fetchMemberConsultantByEmail(email)
        const workspace = await fetchMemberWorkspace()
        const [responses, recorded] = workspace ? [workspace.responses ?? [], workspace.contributions ?? []] : await Promise.all([
          fetchOpportunityResponses(email), fetchMemberContributions(email),
        ])
        if (cancelled) return
        setWorkspace(workspace)
        setConsultant(member)
        setProfileForm(consultantToMemberProfileForm(member))
        const ventures = consultantToMemberProfileForm(member).ventureAssociations
        setBriefings(
          workspace && Object.prototype.hasOwnProperty.call(workspace, 'briefings')
            ? workspace.briefings
            : fetchMemberBriefings(email),
        )
        const mappedOpportunities = workspace && Object.prototype.hasOwnProperty.call(workspace, 'opportunities')
          ? workspace.opportunities?.map((item) => ({ ...item, why: item.rationale, brand: item.venture }))
          : null
        setOpportunities(
          mappedOpportunities
            ? filterOpportunitiesForVentures(mappedOpportunities, ventures)
            : fetchMemberOpportunities(email, ventures),
        )
        setOpportunityResponses(responses.map((item) => ({ ...item, kind: item.kind ?? (item.response === 'interested' ? 'interest' : item.response) })))
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
    workspace,
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
