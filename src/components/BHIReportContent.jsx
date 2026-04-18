import SectionLabel from './bhi/SectionLabel'

const URGENCY_CONFIG = {
  HIGH: { label: 'High Priority', color: '#c0392b', bg: '#fdf0ef' },
  UNCERTAIN: { label: 'Uncertain', color: '#e67e22', bg: '#fef6ed' },
  LOW: { label: 'Low Concern', color: '#27ae60', bg: '#edfaf1' },
}

/** Read-only report body (shared by quiz overlay and dashboard). */
export default function BHIReportContent({ quizResults, middleSlot }) {
  if (!quizResults) return null
  const { differentials, domains, urgency } = quizResults
  const u = URGENCY_CONFIG[urgency] ?? URGENCY_CONFIG.LOW

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <SectionLabel className="mb-2 tracking-[0.3em]">Assessment snapshot</SectionLabel>
        <h2 className="mb-4 font-serif italic text-2xl text-[#1A1A1A]">Your Brain Health Index</h2>
        <span
          className="inline-block rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color: u.color, background: u.bg }}
        >
          {u.label}
        </span>
      </div>

      {middleSlot}

      <div className="mb-8">
        <SectionLabel className="mb-4 text-[#3D4B3E]/50">Differential Analysis</SectionLabel>
        <div className="space-y-4">
          {differentials.map((d) => (
            <div key={d.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#1A1A1A]">{d.label}</span>
                <span className="text-[11px] font-bold" style={{ color: d.color }}>
                  {d.probability}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8DCC4]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.probability}%`, background: d.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel className="mb-4 text-[#3D4B3E]/50">Domain Scores</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {Object.entries(domains || {}).map(([name, score]) => (
            <span
              key={name}
              className="rounded-full border border-[#E8DCC4] px-3 py-1.5 text-[11px] font-semibold"
              style={{
                background: score > 60 ? '#fdf0ef' : '#F3EFE9',
                color: score > 60 ? '#c0392b' : '#3D4B3E',
              }}
            >
              {name}: {score}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
