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
  </div>
}
