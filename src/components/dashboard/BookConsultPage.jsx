import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PanelHeader from '../bhi/PanelHeader'
import { buildCalendlyEmbedUrl, loadCalendlyScript, subscribeCalendlyScheduled } from '../../lib/calendlyEmbed'

const DEFAULT_BOOKING = 'https://calendly.com/cogcare/30min'

const PENDING_INTENT_KEY = 'cogcare:pendingConsultIntent'

export default function BookConsultPage({
  client,
  email,
  ownerSub,
  consultants,
  subjects,
  activeSubjectId,
  setActiveSubjectId,
  onRefresh,
}) {
  const [searchParams] = useSearchParams()
  const widgetHostRef = useRef(null)
  const [selectedConsultantId, setSelectedConsultantId] = useState(() => searchParams.get('consultantId') || '')
  const [embedError, setEmbedError] = useState(null)
  const [bookedMsg, setBookedMsg] = useState(false)

  const subjectIdFromUrl = searchParams.get('subjectId')
  const assessmentIdFromUrl = searchParams.get('assessmentId')

  useEffect(() => {
    if (subjectIdFromUrl && subjects?.some((s) => s.id === subjectIdFromUrl)) {
      setActiveSubjectId(subjectIdFromUrl)
    }
  }, [subjectIdFromUrl, subjects, setActiveSubjectId])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_INTENT_KEY)
      if (raw) sessionStorage.removeItem(PENDING_INTENT_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const activeSubject = useMemo(
    () => subjects?.find((s) => s.id === activeSubjectId) ?? null,
    [subjects, activeSubjectId],
  )

  const selectedConsultant = useMemo(() => {
    if (!consultants?.length) return null
    if (selectedConsultantId) {
      const c = consultants.find((x) => x.id === selectedConsultantId)
      if (c) return c
    }
    return consultants[0]
  }, [consultants, selectedConsultantId])

  const embedUrl = useMemo(() => {
    if (!selectedConsultant) return null
    const base = selectedConsultant.bookingUrl?.trim() || DEFAULT_BOOKING
    const name = activeSubject?.displayName || 'Consultation'
    return buildCalendlyEmbedUrl(base, {
      email: email || undefined,
      name,
      subjectId: activeSubjectId || undefined,
      assessmentId: assessmentIdFromUrl || undefined,
      ownerSub: ownerSub || undefined,
    })
  }, [selectedConsultant, email, activeSubject, activeSubjectId, assessmentIdFromUrl, ownerSub])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!embedUrl || !widgetHostRef.current) return
      setEmbedError(null)
      try {
        await loadCalendlyScript()
        if (cancelled || !widgetHostRef.current) return
        const el = widgetHostRef.current
        el.innerHTML = ''
        const Cal = window.Calendly
        if (Cal?.initInlineWidget) {
          Cal.initInlineWidget({ url: embedUrl, parentElement: el })
        } else {
          setEmbedError('Calendly did not load. Check your network or ad blockers.')
        }
      } catch (e) {
        if (!cancelled) setEmbedError(e instanceof Error ? e.message : 'Could not load scheduler')
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [embedUrl])

  useEffect(() => {
    if (!client?.models?.ConsultAppointment?.create || !activeSubjectId || !ownerSub) return () => {}
    return subscribeCalendlyScheduled(async () => {
      try {
        const { errors } = await client.models.ConsultAppointment.create({
          owner: ownerSub,
          subjectId: activeSubjectId,
          assessmentId: assessmentIdFromUrl || undefined,
          consultantId: selectedConsultant?.id || undefined,
          status: 'pending',
          createdAt: new Date().toISOString(),
        })
        if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '))
        setBookedMsg(true)
        await onRefresh?.()
      } catch (e) {
        if (import.meta.env.DEV) console.error('[calendly scheduled]', e)
      }
    })
  }, [
    client,
    activeSubjectId,
    ownerSub,
    assessmentIdFromUrl,
    selectedConsultant?.id,
    onRefresh,
  ])

  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Care"
        title="Book a consultation"
        subtitle="Choose who this visit is for, then pick a specialist and time. Your booking is saved to this dashboard when Calendly confirms (webhook)."
      />

      {subjects?.length > 1 ? (
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Who is this for?</p>
          <select
            className="mt-2 w-full max-w-md rounded-xl border border-border bg-page px-3 py-2 text-sm text-forest"
            value={activeSubjectId || ''}
            onChange={(e) => setActiveSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.displayName}
                {s.isSelf ? ' (you)' : ''}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {consultants?.length > 1 ? (
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Specialist</p>
          <select
            className="mt-2 w-full max-w-md rounded-xl border border-border bg-page px-3 py-2 text-sm text-forest"
            value={selectedConsultant?.id || ''}
            onChange={(e) => setSelectedConsultantId(e.target.value)}
          >
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {bookedMsg ? (
        <div
          className="rounded-2xl border border-[#B8D9C1] bg-[#EEF5F0] px-4 py-3 text-sm text-forest"
          role="status"
        >
          Thanks — we recorded a pending booking. When Calendly confirms, details will appear under{' '}
          <Link to="/dashboard/consultants" className="font-semibold underline underline-offset-2">
            Consultations
          </Link>
          .
        </div>
      ) : null}

      {embedError ? (
        <p className="text-sm text-red-800" role="alert">
          {embedError}
        </p>
      ) : null}

      <div ref={widgetHostRef} className="min-h-[720px] w-full overflow-hidden rounded-2xl border border-border bg-white" />

      <p className="text-xs text-forest/60">
        Point the Calendly webhook at your deployed <code className="rounded bg-surface px-1">calendly-webhook</code>{' '}
        Function URL (see Amplify outputs) and set env <code className="rounded bg-surface px-1">CALENDLY_WEBHOOK_SIGNING_KEY</code>{' '}
        for signature verification.
      </p>
    </div>
  )
}
