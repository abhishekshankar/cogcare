import { useCallback, useEffect, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { callNetworkApi } from '../../services/networkApiClient.js'
import { networkBodySm, networkCard, networkCardPad, networkInput, networkLabel, networkPrimaryBtn, networkSecondaryBtn, networkSectionTitle } from '../network/networkUi.js'

const emptyBriefing = { title: '', summary: '', topic: '', status: 'draft' }
const emptyOpportunity = { title: '', summary: '', rationale: '', scope: '', timeCommitment: '', venture: 'cogcare', status: 'draft' }

function Count({ label, value }) {
  return <div className="rounded-xl border border-border bg-surface p-4"><dt className={networkLabel}>{label}</dt><dd className="mt-1 text-2xl font-semibold text-forest">{value}</dd></div>
}

export default function NetworkOperationsAdmin() {
  const [dashboard, setDashboard] = useState(null)
  const [briefing, setBriefing] = useState(emptyBriefing)
  const [opportunity, setOpportunity] = useState(emptyOpportunity)
  const [record, setRecord] = useState({ memberId: '', title: '', description: '', kind: 'contribution' })
  const [introduction, setIntroduction] = useState({ requesterMemberId: '', recipientMemberId: '', purpose: '' })
  const [event, setEvent] = useState({ title: '', description: '', startsAt: '', status: 'draft' })
  const [notification, setNotification] = useState({ memberId: '', kind: 'briefing', subject: '', message: '' })
  const [attribution, setAttribution] = useState({ memberId: '', itemType: 'contribution', itemId: '', proposedText: '' })
  const [queuedNotification, setQueuedNotification] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setBusy(true); setError('')
    try { setDashboard((await callNetworkApi('admin', { operation: 'dashboard' })).dashboard) }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not load Network operations.') }
    finally { setBusy(false) }
  }, [])
  useEffect(() => { load() }, [load])

  async function save(operation, values, reset) {
    setBusy(true); setError(''); setNotice('')
    try {
      await callNetworkApi('admin', { operation, ...values })
      setNotice(operation === 'saveBriefing' ? 'Briefing saved.' : 'Opportunity saved.')
      reset(); await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save.') }
    finally { setBusy(false) }
  }

  async function recomputeMetrics() {
    setBusy(true); setError(''); setNotice('')
    try { await callNetworkApi('admin', { operation: 'recomputeMetrics' }); setNotice('Privacy-minimized outcome metrics refreshed.'); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not refresh metrics.') }
    finally { setBusy(false) }
  }

  async function operate(operation, values, success, after) {
    setBusy(true); setError(''); setNotice('')
    try { const body = await callNetworkApi('admin', { operation, ...values }); setNotice(success); after?.(body); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Operation failed.') }
    finally { setBusy(false) }
  }

  const counts = dashboard ? [
    ['Published briefings', dashboard.briefings.filter((x) => x.status === 'published').length],
    ['Open opportunities', dashboard.opportunities.filter((x) => x.status === 'published').length],
    ['Private responses', dashboard.responses.length], ['Feedback notes', dashboard.feedback.length],
    ['Verified contributions', dashboard.contributions.length], ['Pending attribution', dashboard.attributions.filter((x) => x.status === 'pending').length],
    ['Member proposals', dashboard.proposals.length], ['Controlled events', dashboard.events.length],
  ] : []

  return <div className="space-y-6">
    <section className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-operations-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="network-operations-title" className={networkSectionTitle}>Institution operations</h2>
          <p className={`mt-2 ${networkBodySm}`}>Publish only reviewed professional material. Counts are operational records, not member rankings.</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" className={networkSecondaryBtn} onClick={recomputeMetrics} disabled={busy}>Refresh outcome metrics</button><button type="button" className={networkSecondaryBtn} onClick={load} disabled={busy}><RefreshCw className="h-4 w-4" aria-hidden />Refresh</button></div>
      </div>
      {error ? <p className="mt-4 rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error" role="alert">{error}</p> : null}
      {notice ? <p className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-forest" role="status">{notice}</p> : null}
      {busy && !dashboard ? <p className="mt-6 inline-flex items-center gap-2 text-sm text-forest" role="status"><Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />Loading records…</p> : null}
      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{counts.map(([label, value]) => <Count key={label} label={label} value={value} />)}</dl>
      {dashboard?.metrics?.length ? <div className="mt-6"><h3 className={networkLabel}>Privacy-minimized outcome report</h3><dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{dashboard.metrics.map((metric) => <Count key={metric.id} label={metric.metric.replaceAll('_', ' ')} value={metric.value} />)}</dl></div> : null}
    </section>

    <div className="grid gap-6 lg:grid-cols-2">
      <form className={`${networkCard} ${networkCardPad} space-y-4`} onSubmit={(e) => { e.preventDefault(); save('saveBriefing', briefing, () => setBriefing(emptyBriefing)) }}>
        <div><h2 className={networkSectionTitle}>Author a briefing</h2><p className={`mt-2 ${networkBodySm}`}>Draft first; publishing makes it visible to eligible members.</p></div>
        <label className="block"><span className={networkLabel}>Title</span><input required className={networkInput} value={briefing.title} onChange={(e) => setBriefing((x) => ({ ...x, title: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Summary</span><textarea required rows={4} className={networkInput} value={briefing.summary} onChange={(e) => setBriefing((x) => ({ ...x, summary: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Topic</span><input className={networkInput} value={briefing.topic} onChange={(e) => setBriefing((x) => ({ ...x, topic: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>State</span><select className={networkInput} value={briefing.status} onChange={(e) => setBriefing((x) => ({ ...x, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Publish now</option></select></label>
        <button disabled={busy} className={networkPrimaryBtn}>{busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}Save briefing</button>
      </form>

      <form className={`${networkCard} ${networkCardPad} space-y-4`} onSubmit={(e) => { e.preventDefault(); save('saveOpportunity', opportunity, () => setOpportunity(emptyOpportunity)) }}>
        <div><h2 className={networkSectionTitle}>Create an opportunity</h2><p className={`mt-2 ${networkBodySm}`}>A scoped, optional ask with a clear rationale and time expectation.</p></div>
        <label className="block"><span className={networkLabel}>Title</span><input required className={networkInput} value={opportunity.title} onChange={(e) => setOpportunity((x) => ({ ...x, title: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Summary</span><textarea required rows={2} className={networkInput} value={opportunity.summary} onChange={(e) => setOpportunity((x) => ({ ...x, summary: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Why this matters</span><textarea required rows={2} className={networkInput} value={opportunity.rationale} onChange={(e) => setOpportunity((x) => ({ ...x, rationale: e.target.value }))} /></label>
        <div className="grid gap-3 sm:grid-cols-2"><label><span className={networkLabel}>Scope</span><input className={networkInput} value={opportunity.scope} onChange={(e) => setOpportunity((x) => ({ ...x, scope: e.target.value }))} /></label><label><span className={networkLabel}>Time</span><input className={networkInput} value={opportunity.timeCommitment} onChange={(e) => setOpportunity((x) => ({ ...x, timeCommitment: e.target.value }))} /></label></div>
        <div className="grid gap-3 sm:grid-cols-2"><label><span className={networkLabel}>Venture</span><select className={networkInput} value={opportunity.venture} onChange={(e) => setOpportunity((x) => ({ ...x, venture: e.target.value }))}><option value="cogcare">Cogcare</option><option value="cogtraining">Cogtraining</option><option value="nso">Neuro Second Opinion</option></select></label><label><span className={networkLabel}>State</span><select className={networkInput} value={opportunity.status} onChange={(e) => setOpportunity((x) => ({ ...x, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Publish now</option></select></label></div>
        <button disabled={busy} className={networkPrimaryBtn}>Save opportunity</button>
      </form>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <form className={`${networkCard} ${networkCardPad} space-y-4`} onSubmit={(e) => { e.preventDefault(); const op = record.kind === 'impact' ? 'recordImpact' : 'recordContribution'; operate(op, record, 'Verified record added.', () => setRecord({ memberId: '', title: '', description: '', kind: 'contribution' })) }}>
        <div><h2 className={networkSectionTitle}>Verified contribution or impact</h2><p className={`mt-2 ${networkBodySm}`}>Record only evidence reviewed by an administrator. This does not authorize public attribution.</p></div>
        <label className="block"><span className={networkLabel}>Member record ID</span><input required className={networkInput} value={record.memberId} onChange={(e) => setRecord((x) => ({ ...x, memberId: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Record type</span><select className={networkInput} value={record.kind} onChange={(e) => setRecord((x) => ({ ...x, kind: e.target.value }))}><option value="contribution">Contribution</option><option value="impact">Impact</option></select></label>
        <label className="block"><span className={networkLabel}>Title</span><input required className={networkInput} value={record.title} onChange={(e) => setRecord((x) => ({ ...x, title: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Verified description</span><textarea required rows={3} className={networkInput} value={record.description} onChange={(e) => setRecord((x) => ({ ...x, description: e.target.value }))} /></label>
        <button disabled={busy} className={networkPrimaryBtn}>Record verified work</button>
      </form>

      <form className={`${networkCard} ${networkCardPad} space-y-4`} onSubmit={(e) => { e.preventDefault(); operate('createIntroduction', introduction, 'Private introduction request created.', () => setIntroduction({ requesterMemberId: '', recipientMemberId: '', purpose: '' })) }}>
        <div><h2 className={networkSectionTitle}>Consent-mediated introduction</h2><p className={`mt-2 ${networkBodySm}`}>Both members decide independently before an introduction is marked consented.</p></div>
        <label className="block"><span className={networkLabel}>Requesting member ID</span><input required className={networkInput} value={introduction.requesterMemberId} onChange={(e) => setIntroduction((x) => ({ ...x, requesterMemberId: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Recipient member ID</span><input required className={networkInput} value={introduction.recipientMemberId} onChange={(e) => setIntroduction((x) => ({ ...x, recipientMemberId: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Purpose</span><textarea required rows={3} className={networkInput} value={introduction.purpose} onChange={(e) => setIntroduction((x) => ({ ...x, purpose: e.target.value }))} /></label>
        <button disabled={busy} className={networkPrimaryBtn}>Request both consents</button>
      </form>

      <form className={`${networkCard} ${networkCardPad} space-y-4`} onSubmit={(e) => { e.preventDefault(); operate('saveEvent', { ...event, startsAt: new Date(event.startsAt).toISOString() }, 'Salon or event saved.', () => setEvent({ title: '', description: '', startsAt: '', status: 'draft' })) }}>
        <div><h2 className={networkSectionTitle}>Controlled salon or event</h2><p className={`mt-2 ${networkBodySm}`}>Attendance and responses remain private; publishing does not create a public attendee list.</p></div>
        <label className="block"><span className={networkLabel}>Title</span><input required className={networkInput} value={event.title} onChange={(e) => setEvent((x) => ({ ...x, title: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Description</span><textarea required rows={3} className={networkInput} value={event.description} onChange={(e) => setEvent((x) => ({ ...x, description: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Starts</span><input required type="datetime-local" className={networkInput} value={event.startsAt} onChange={(e) => setEvent((x) => ({ ...x, startsAt: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>State</span><select className={networkInput} value={event.status} onChange={(e) => setEvent((x) => ({ ...x, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Publish now</option></select></label>
        <button disabled={busy} className={networkPrimaryBtn}>Save salon or event</button>
      </form>

      <form className={`${networkCard} ${networkCardPad} space-y-4`} onSubmit={(e) => { e.preventDefault(); operate('queueNotification', notification, 'Notification queued after consent check.', (body) => setQueuedNotification(body.notification)) }}>
        <div><h2 className={networkSectionTitle}>Consent-enforced notification</h2><p className={`mt-2 ${networkBodySm}`}>Queueing checks consent. Delivery checks it again. No message is sent until you explicitly dispatch it.</p></div>
        <label className="block"><span className={networkLabel}>Member record ID</span><input required className={networkInput} value={notification.memberId} onChange={(e) => setNotification((x) => ({ ...x, memberId: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Subject</span><input required className={networkInput} value={notification.subject} onChange={(e) => setNotification((x) => ({ ...x, subject: e.target.value }))} /></label>
        <label className="block"><span className={networkLabel}>Message</span><textarea required rows={3} className={networkInput} value={notification.message} onChange={(e) => setNotification((x) => ({ ...x, message: e.target.value }))} /></label>
        <button disabled={busy} className={networkSecondaryBtn}>Queue for review</button>
        {queuedNotification ? <div className="rounded-xl border border-border bg-surface p-4"><p className={networkBodySm}>Queued, not sent: {queuedNotification.subject}</p><button type="button" className={`${networkPrimaryBtn} mt-3`} disabled={busy} onClick={() => operate('dispatchNotification', { id: queuedNotification.id }, 'Notification accepted for delivery.', () => setQueuedNotification(null))}>Dispatch now</button></div> : null}
      </form>

      <form className={`${networkCard} ${networkCardPad} space-y-4 lg:col-span-2`} onSubmit={(e) => { e.preventDefault(); operate('requestAttribution', attribution, 'Item-specific attribution approval requested.', () => setAttribution({ memberId: '', itemType: 'contribution', itemId: '', proposedText: '' })) }}>
        <div><h2 className={networkSectionTitle}>Request item-specific attribution</h2><p className={`mt-2 ${networkBodySm}`}>Membership is never permission to use a name. The named member must approve this exact proposed wording.</p></div>
        <div className="grid gap-4 sm:grid-cols-3"><label><span className={networkLabel}>Member ID</span><input required className={networkInput} value={attribution.memberId} onChange={(e) => setAttribution((x) => ({ ...x, memberId: e.target.value }))} /></label><label><span className={networkLabel}>Item type</span><select className={networkInput} value={attribution.itemType} onChange={(e) => setAttribution((x) => ({ ...x, itemType: e.target.value }))}><option value="contribution">Contribution</option><option value="impact">Impact</option><option value="briefing">Briefing</option><option value="initiative">Initiative</option></select></label><label><span className={networkLabel}>Item ID</span><input required className={networkInput} value={attribution.itemId} onChange={(e) => setAttribution((x) => ({ ...x, itemId: e.target.value }))} /></label></div>
        <label className="block"><span className={networkLabel}>Exact proposed wording</span><textarea required rows={3} className={networkInput} value={attribution.proposedText} onChange={(e) => setAttribution((x) => ({ ...x, proposedText: e.target.value }))} /></label>
        <button disabled={busy} className={networkPrimaryBtn}>Request member approval</button>
      </form>
    </div>
  </div>
}
