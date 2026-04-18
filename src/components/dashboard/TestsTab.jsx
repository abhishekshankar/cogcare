import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import BHIReportContent from '../BHIReportContent'
import PanelHeader from '../bhi/PanelHeader'

function getFocusableElements(container) {
  if (!container) return []
  const sel =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return [...container.querySelectorAll(sel)].filter(
    (el) => el.offsetParent !== null || el.getClientRects().length > 0,
  )
}

export default function TestsTab({ assessments, onRefresh }) {
  const [open, setOpen] = useState(null)
  const panelRef = useRef(null)
  const openTriggerRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const sorted = [...assessments].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
  )

  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement
    const panel = panelRef.current
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(null)
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const nodes = getFocusableElements(panel)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    requestAnimationFrame(() => {
      const nodes = getFocusableElements(panel)
      ;(nodes[0] || panel)?.focus?.()
    })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      const restore = openTriggerRef.current || previouslyFocusedRef.current
      queueMicrotask(() => restore?.focus?.())
    }
  }, [open])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PanelHeader sectionLabel="History" title="My tests" />
        <button
          type="button"
          onClick={onRefresh}
          className="min-h-[44px] rounded-full border border-[#E8DCC4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] hover:bg-[#F3EFE9] sm:min-h-0"
        >
          Refresh
        </button>
      </div>
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8DCC4] bg-white/60 px-6 py-12 text-center shadow-sm">
          <p className="text-sm leading-relaxed text-[#3D4B3E]/70">
            No assessments yet. Complete the Brain Health Index on the home page and email your results to save them
            here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((a) => {
            let summary = 'BHI'
            try {
              const r = JSON.parse(a.resultsJson || '{}')
              summary = r.urgency ? `Urgency: ${r.urgency}` : 'Brain Health Index'
            } catch {
              /* ignore */
            }
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    openTriggerRef.current = document.activeElement
                    setOpen(a)
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl border border-[#E8DCC4] bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#3D4B3E]/30"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                      {new Date(a.completedAt).toLocaleString()}
                    </span>
                    <span className="mt-1 block font-medium text-[#1A1A1A]">{a.type}</span>
                    <span className="mt-1 block text-sm text-[#3D4B3E]/75">{summary}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#A67B5B]/70" aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#3D4B3E]/30 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            aria-label="Close dialog"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-saved-report-title"
            tabIndex={-1}
            className="relative z-10 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#E8DCC4] bg-[#FDFBF7] shadow-2xl sm:rounded-3xl"
          >
            <div className="flex shrink-0 justify-center pt-3 sm:pt-2" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-[#E8DCC4]" />
            </div>
            <div className="max-h-[90dvh] overflow-y-auto p-6 pt-4">
              <div className="mb-4 flex justify-between gap-4">
                <p
                  id="dashboard-saved-report-title"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]"
                >
                  Saved report
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="text-sm font-semibold text-[#A67B5B] hover:underline"
                >
                  Close
                </button>
              </div>
              {(() => {
                try {
                  const r = JSON.parse(open.resultsJson || '{}')
                  return <BHIReportContent quizResults={r} />
                } catch {
                  return <p className="text-sm text-red-700">Could not load results.</p>
                }
              })()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
