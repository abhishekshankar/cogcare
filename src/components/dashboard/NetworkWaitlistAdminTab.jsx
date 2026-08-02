import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import PanelHeader from '../bhi/PanelHeader.jsx'
import { listNetworkWaitlistRequests } from '../../lib/networkWaitlist.js'

const formatWhen = (value) => value ? new Date(value).toLocaleString() : '—'

export default function NetworkWaitlistAdminTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setRows((await listNetworkWaitlistRequests()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))) }
    catch (err) { setError(err?.message || 'Could not load waitlist requests.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  return <div className="space-y-6">
    <PanelHeader sectionLabel="Cognition Network" title="Invitation waitlist" subtitle="Private requests from the public invite-request page. A waitlist code confirms receipt; it does not grant membership." />
    <div className="flex justify-end"><button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"><RefreshCw className="h-3.5 w-3.5" />Refresh</button></div>
    {error ? <p className="text-sm text-error" role="alert">{error}</p> : loading ? <p className="text-sm text-ink-muted" role="status">Loading requests…</p> : rows.length === 0 ? <p className="text-sm text-ink-muted">No invite requests yet.</p> : <div className="overflow-x-auto rounded-2xl border border-border bg-white"><table className="min-w-full text-left text-sm"><caption className="sr-only">Cognition Network invitation waitlist</caption><thead className="border-b border-border bg-surface/60 text-[10px] font-bold uppercase tracking-[0.12em] text-clay"><tr><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Role and organization</th><th className="px-4 py-3">Interest</th><th className="px-4 py-3">Code</th><th className="px-4 py-3">Received</th></tr></thead><tbody>{rows.map((row) => <tr key={row.emailHash} className="border-b border-border/70 align-top last:border-0"><td className="px-4 py-3"><p className="font-medium text-ink">{row.name}</p><a href={`mailto:${row.email}`} className="text-xs text-forest underline">{row.email}</a>{row.location ? <p className="mt-1 text-xs text-ink-faint">{row.location}</p> : null}</td><td className="px-4 py-3"><p>{row.roleCategory}</p><p className="text-xs text-ink-muted">{row.organization || '—'}</p>{row.professionalUrl ? <a href={row.professionalUrl} target="_blank" rel="noreferrer" className="text-xs text-forest underline">Profile</a> : null}</td><td className="max-w-sm px-4 py-3 text-xs leading-relaxed text-ink-muted">{row.interest}</td><td className="px-4 py-3 font-mono text-xs text-forest">{row.waitlistCode}<p className="mt-1 font-sans uppercase tracking-wider text-ink-faint">{row.status}</p></td><td className="whitespace-nowrap px-4 py-3 text-xs text-ink-muted">{formatWhen(row.createdAt)}</td></tr>)}</tbody></table></div>}
  </div>
}
