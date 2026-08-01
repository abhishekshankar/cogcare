import { useCallback, useEffect, useState } from 'react'
import { BarChart3, RefreshCw } from 'lucide-react'
import PanelHeader from '../bhi/PanelHeader'
import { computeNetworkIntelligence, NETWORK_COHORT_TARGETS } from '../../../lib/networkIntelligence.js'
import { fetchNetworkIntelligenceData } from '../../services/networkIntelligenceService.js'
import { ventureLabel } from '../../../lib/ventureRegistry.js'

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-brand-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">{label}</p>
      <p className="mt-2 font-serif text-2xl text-forest">{value}</p>
      {hint ? <p className="mt-1 text-xs text-forest/65">{hint}</p> : null}
    </div>
  )
}

export default function NetworkIntelligencePanel() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [intel, setIntel] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { invitations, consultants } = await fetchNetworkIntelligenceData()
      setIntel(
        computeNetworkIntelligence({
          invitations,
          consultants,
        }),
      )
    } catch (e) {
      setError(e?.message || 'Could not load network intelligence.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load on mount
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Cognition Network"
        title="Network intelligence"
        subtitle="Aggregate, non-PHI metrics for founding cohort progress. No member names or contact details."
      />

      {error ? (
        <div
          className="rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-forest/80">
          <BarChart3 className="h-4 w-4 text-clay" aria-hidden />
          First {NETWORK_COHORT_TARGETS.join(' / ')} cohort milestones
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-forest/70" role="status" aria-live="polite">
          Loading intelligence…
        </p>
      ) : intel ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Accepted members" value={intel.summary.memberCount} />
            <MetricCard
              label="Pending invitations"
              value={intel.summary.pendingInvites}
              hint={`${intel.summary.totalInvites} total invitations`}
            />
            <MetricCard
              label="Acceptance rate"
              value={intel.summary.acceptanceRate != null ? `${intel.summary.acceptanceRate}%` : '—'}
            />
            <MetricCard
              label="Engagement health"
              value={intel.engagementHealth.label}
              hint={`Score ${intel.engagementHealth.score}/100`}
            />
          </div>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-brand-sm" aria-labelledby="cohort-progress-title">
            <h2 id="cohort-progress-title" className="font-serif text-lg text-forest">
              Cohort progress
            </h2>
            <ul className="mt-4 space-y-3">
              {intel.cohortProgress.map((row) => (
                <li key={row.target}>
                  <div className="flex items-center justify-between text-xs text-forest/80">
                    <span>First {row.target}</span>
                    <span>
                      {row.current} / {row.target} ({row.percent}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className={`h-full rounded-full ${row.met ? 'bg-forest' : 'bg-clay/70'}`}
                      style={{ width: `${row.percent}%` }}
                      role="progressbar"
                      aria-valuenow={row.current}
                      aria-valuemin={0}
                      aria-valuemax={row.target}
                      aria-label={`First ${row.target} cohort progress`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-white p-5 shadow-brand-sm" aria-labelledby="invite-status-title">
              <h2 id="invite-status-title" className="font-serif text-lg text-forest">
                Invitation states
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {Object.entries(intel.inviteByStatus).map(([status, count]) => (
                  <div key={status}>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-clay">{status}</dt>
                    <dd className="mt-1 text-forest">{count}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5 shadow-brand-sm" aria-labelledby="consent-coverage-title">
              <h2 id="consent-coverage-title" className="font-serif text-lg text-forest">
                Consent coverage
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt>Public / directory name consent</dt>
                  <dd>
                    {intel.consentCoverage.publicNameConsent} (
                    {intel.consentCoverage.publicNameConsentRate ?? 0}%)
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Private members</dt>
                  <dd>{intel.consentCoverage.privateMembers}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Communications opt-in</dt>
                  <dd>
                    {intel.consentCoverage.communicationsOptIn} (
                    {intel.consentCoverage.communicationsOptInRate ?? 0}%)
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-white p-5 shadow-brand-sm" aria-labelledby="participation-modes-title">
              <h2 id="participation-modes-title" className="font-serif text-lg text-forest">
                Participation modes
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                {Object.entries(intel.participationModes).map(([mode, count]) => (
                  <div key={mode} className="flex justify-between gap-4">
                    <dt className="capitalize">{mode}</dt>
                    <dd>{count}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5 shadow-brand-sm" aria-labelledby="venture-counts-title">
              <h2 id="venture-counts-title" className="font-serif text-lg text-forest">
                Venture associations (aggregate)
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                {Object.entries(intel.ventureAssociationCounts).length ? (
                  Object.entries(intel.ventureAssociationCounts).map(([id, count]) => (
                    <div key={id} className="flex justify-between gap-4">
                      <dt>{ventureLabel(id)}</dt>
                      <dd>{count}</dd>
                    </div>
                  ))
                ) : (
                  <p className="text-forest/70">No venture associations recorded yet.</p>
                )}
              </dl>
            </section>
          </div>

          {intel.engagementHealth.notes.length ? (
            <section className="rounded-2xl border border-border bg-surface/50 p-5" aria-labelledby="engagement-notes-title">
              <h2 id="engagement-notes-title" className="text-sm font-medium text-forest">
                Engagement notes
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-forest/75">
                {intel.engagementHealth.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
