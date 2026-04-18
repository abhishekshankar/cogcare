import { Link } from 'react-router-dom'
import { Brain } from 'lucide-react'
import PanelHeader from '../bhi/PanelHeader'
import SectionLabel from '../bhi/SectionLabel'
import {
  computeBrainCreditFromResults,
  computeBrainCreditHistory,
  engagementBonusFromCount,
  normalAgingPercentFromResults,
} from '../../../lib/brainCredit'

const SCORE_MIN = 300
const SCORE_MAX = 850

function scoreToFillPercent(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return 0
  return Math.min(100, Math.max(0, ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100))
}

export default function BrainCreditTab({ profile, latestResults, assessmentCount, assessments }) {
  const score =
    profile?.brainCreditScore ??
    (latestResults
      ? computeBrainCreditFromResults(latestResults, {
          completedAssessmentCount: assessmentCount ?? 1,
        })
      : null)

  const normalPct = latestResults ? normalAgingPercentFromResults(latestResults) : null
  const bonusPts = engagementBonusFromCount(assessmentCount ?? 1)

  const sortedNewest = [...(assessments || [])].sort(
    (a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0),
  )
  const lastUpdated = sortedNewest[0]?.completedAt
    ? new Date(sortedNewest[0].completedAt).toLocaleString()
    : null

  const history = computeBrainCreditHistory(assessments || [])
  const showTrend = history.length > 1

  if (!assessmentCount) {
    return (
      <div className="space-y-6">
        <PanelHeader
          sectionLabel="Overview"
          title="Brain credit"
          subtitle='A single score derived from your Brain Health Index (v1). Higher reflects a stronger "normal aging" pattern in your results — not a diagnosis.'
        />
        <div className="rounded-2xl border border-dashed border-[#E8DCC4] bg-white/60 px-6 py-14 text-center shadow-sm">
          <Brain className="mx-auto h-10 w-10 text-[#A67B5B]/80" strokeWidth={1.25} aria-hidden />
          <p className="mt-4 text-sm leading-relaxed text-[#3D4B3E]/80">
            No assessments yet. Complete the Brain Health Index and save your results to see your brain credit
            here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#3D4B3E] px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#2D382D]"
          >
            Go to home — start the assessment
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Overview"
        title="Brain credit"
        subtitle='A single score derived from your latest Brain Health Index (v1). Higher reflects a stronger "normal aging" pattern in your results — not a diagnosis.'
      />
      <div className="rounded-2xl border border-[#E8DCC4] bg-[#F3EFE9]/40 px-4 py-3 text-sm leading-relaxed text-[#3D4B3E]/85">
        <Link
          to="/dashboard/tests"
          className="font-semibold text-[#3D4B3E] underline decoration-[#A67B5B]/40 underline-offset-2 hover:text-[#2D382D]"
        >
          My tests
        </Link>{' '}
        lists every Brain Health Index you saved by emailing your results (same email as this account). Open a report,
        export JSON, or delete past runs.
      </div>
      <div className="rounded-3xl border border-[#E8DCC4] bg-white p-8 shadow-sm">
        <SectionLabel className="text-[#3D4B3E]/50">Your score</SectionLabel>
        <p className="mt-4 font-serif text-6xl tabular-nums text-[#3D4B3E]">{score ?? '—'}</p>
        <div className="mt-6">
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-[#F3EFE9]"
            role="img"
            aria-label={`Score position from ${SCORE_MIN} to ${SCORE_MAX}`}
          >
            <div
              className="h-full rounded-full bg-[#3D4B3E]/85 transition-[width] duration-500"
              style={{ width: `${scoreToFillPercent(score)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-medium tabular-nums text-[#3D4B3E]/50">
            <span>{SCORE_MIN}</span>
            <span>{SCORE_MAX}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-[#3D4B3E]/60">Range 300–850 (v1 formula documented in backend).</p>
        {lastUpdated ? (
          <p className="mt-2 text-[11px] text-[#3D4B3E]/55">Last updated from saved results: {lastUpdated}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-[#E8DCC4] bg-white p-6 shadow-sm">
        <SectionLabel className="text-[#3D4B3E]/50">How this score is built (v1)</SectionLabel>
        <dl className="mt-4 space-y-3 text-sm text-[#3D4B3E]/85">
          <div className="flex flex-wrap justify-between gap-2 border-b border-[#F3EFE9] pb-3">
            <dt className="text-[#3D4B3E]/70">Normal Aging (model output)</dt>
            <dd className="font-medium tabular-nums">{normalPct != null ? `${Math.round(normalPct)}%` : '—'}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-[#3D4B3E]/70">Engagement bonus (repeat assessments)</dt>
            <dd className="font-medium tabular-nums">+{bonusPts} pts (max 25)</dd>
          </div>
        </dl>
      </div>

      {showTrend ? (
        <div className="rounded-2xl border border-[#E8DCC4] bg-white p-6 shadow-sm">
          <SectionLabel className="text-[#3D4B3E]/50">History</SectionLabel>
          <p className="mt-2 text-xs text-[#3D4B3E]/65">
            Score recalculated for each saved test using the count of assessments completed through that date.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8DCC4] text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67B5B]">
                  <th className="pb-2 pr-4 font-bold">Date</th>
                  <th className="pb-2 font-bold tabular-nums">Score</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id || row.completedAt} className="border-b border-[#F3EFE9] last:border-0">
                    <td className="py-2 pr-4 text-[#3D4B3E]/85">
                      {row.completedAt ? new Date(row.completedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2 tabular-nums font-medium text-[#1A1A1A]">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
