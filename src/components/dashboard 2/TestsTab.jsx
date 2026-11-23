import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Download, Trash2 } from 'lucide-react'
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

function safeParseJson(raw) {
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

function buildExportRecord(a) {
  return {
    id: a.id,
    type: a.type,
    completedAt: a.completedAt,
    answers: safeParseJson(a.answersJson),
    results: safeParseJson(a.resultsJson),
  }
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
}

function exportFilenameStub(completedAt, id) {
  const d = completedAt ? new Date(completedAt).toISOString().slice(0, 10) : 'assessment'
  const short = typeof id === 'string' && id.length > 6 ? id.slice(0, 8) : id || 'export'
  return `cogcare-bhi-${d}-${short}`
}

export default function TestsTab({ client, assessments, onRefresh }) {
  const [open, setOpen] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState(null)
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

  function handleExportOne(a) {
    setActionError(null)
    const payload = {
      app: 'CogCare',
      exportedAt: new Date().toISOString(),
      assessment: buildExportRecord(a),
    }
    downloadJson(`${exportFilenameStub(a.completedAt, a.id)}.json`, payload)
  }

  function handleExportAll() {
    setActionError(null)
    if (sorted.length === 0) return
    const payload = {
      app: 'CogCare',
      exportedAt: new Date().toISOString(),
      assessments: sorted.map((a) => buildExportRecord(a)),
    }
    downloadJson(`cogcare-bhi-all-${new Date().toISOString().slice(0, 10)}.json`, payload)
  }

  async function handleDelete(a) {
    if (!client?.models?.Assessment?.delete || !a?.id) return
    if (
      !window.confirm(
        'Delete this saved test? Your brain credit may still reflect past assessments until you take a new test.',
      )
    ) {
      return
    }
    setActionError(null)
    setDeletingId(a.id)
    try {
      const { errors } = await client.models.Assessment.delete({ id: a.id })
      if (errors?.length) {
        throw new Error(errors.map((e) => e.message).join('; '))
      }
      if (open?.id === a.id) setOpen(null)
      await onRefresh?.()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not delete.'
      setActionError(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PanelHeader
          sectionLabel="History"
          title="My tests"
          subtitle="Tests you saved by emailing your results from the Brain Health Index appear here after you sign in with the same account."
        />
        <div className="flex flex-wrap items-center gap-2">
          {sorted.length > 0 ? (
            <button
              type="button"
              onClick={handleExportAll}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#E8DCC4] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] hover:bg-[#F3EFE9] sm:min-h-0"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden />
              Export all
            </button>
          ) : null}
          <button
            type="button"
            onClick={onRefresh}
            className="min-h-[44px] rounded-full border border-[#E8DCC4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] hover:bg-[#F3EFE9] sm:min-h-0"
          >
            Refresh
          </button>
        </div>
      </div>

      {actionError ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {actionError}
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8DCC4] bg-white/60 px-6 py-12 text-center shadow-sm">
          <p className="text-sm leading-relaxed text-[#3D4B3E]/70">
            No assessments yet. Complete the Brain Health Index on the home page and email your results to the same
            address as this account — they will show up here after you sign in.
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
            const busy = deletingId === a.id
            return (
              <li key={a.id}>
                <div className="flex gap-1 rounded-2xl border border-[#E8DCC4] bg-white shadow-sm transition hover:border-[#3D4B3E]/30 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openTriggerRef.current = document.activeElement
                      setOpen(a)
                    }}
                    className="flex min-h-[44px] min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left sm:px-5"
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
                  <div className="flex shrink-0 items-center gap-0 border-l border-[#F3EFE9] pr-2 sm:pr-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportOne(a)
                      }}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#3D4B3E] hover:bg-[#F3EFE9] disabled:opacity-50"
                      aria-label="Export this test as JSON"
                    >
                      <Download className="h-5 w-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={(e) => {
                        e.stopPropagation()
                        void handleDelete(a)
                      }}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-red-800/90 hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete this test"
                    >
                      <Trash2 className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
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
            <div className="max-h-[90dvh] min-h-0 flex-1 overflow-y-auto p-6 pt-4">
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
            <div className="shrink-0 border-t border-[#E8DCC4] bg-[#FDFBF7] p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleExportOne(open)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-[#E8DCC4] bg-white px-4 py-2 text-sm font-semibold text-[#3D4B3E] hover:bg-[#F3EFE9] sm:min-h-0 sm:flex-initial"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Export JSON
                </button>
                <button
                  type="button"
                  disabled={deletingId === open.id}
                  onClick={() => void handleDelete(open)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-50 disabled:opacity-50 sm:min-h-0 sm:flex-initial"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {deletingId === open.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
