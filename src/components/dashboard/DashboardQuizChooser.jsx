import { X, UserPlus, ClipboardList } from 'lucide-react'

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {Array<{ id: string, displayName?: string, isSelf?: boolean }>} props.subjects
 * @param {string|null} props.activeSubjectId
 * @param {(subjectId: string) => void} props.onStartForSubject — existing subject; skips profile questions
 * @param {() => void} props.onStartNewPerson — full questionnaire + upsert subject on complete
 * @param {() => void} props.onAddProfileOnly
 */
export default function DashboardQuizChooser({
  open,
  onClose,
  subjects = [],
  activeSubjectId,
  onStartForSubject,
  onStartNewPerson,
  onAddProfileOnly,
}) {
  if (!open) return null

  const active = subjects.find((s) => s.id === activeSubjectId)
  const others = subjects.filter((s) => s.id !== activeSubjectId)

  return (
    <div
      className="fixed inset-0 z-[190] flex items-end justify-center sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest/35 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-quiz-chooser-title"
        className="relative z-10 flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-page shadow-2xl sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Brain Health Index</p>
            <h2 id="dashboard-quiz-chooser-title" className="mt-1 font-serif text-lg italic text-forest">
              Who is this assessment for?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-forest/75">
              Choose who you are answering about. We will save results to the right person in your account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest hover:bg-surface"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {active ? (
            <button
              type="button"
              onClick={() => {
                onStartForSubject(active.id)
                onClose()
              }}
              className="flex w-full items-start gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition hover:border-forest/25 hover:bg-surface/80"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-clay">
                <ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-forest/50">
                  Continue for current profile
                </span>
                <span className="mt-1 block font-medium text-ink">
                  {active.displayName}
                  {active.isSelf ? ' (you)' : ''}
                </span>
                <span className="mt-1 block text-sm text-forest/70">Skip the name and relationship step — go straight to the questions.</span>
              </span>
            </button>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-surface/30 px-4 py-3 text-sm text-forest/75">
              Add your first person with the options below, or start the full questionnaire for someone new.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              onStartNewPerson()
              onClose()
            }}
            className="mt-3 flex w-full items-start gap-3 rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition hover:border-forest/25 hover:bg-surface/80"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-clay">
              <UserPlus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-forest/50">
                Someone new
              </span>
              <span className="mt-1 block font-medium text-ink">Full questionnaire</span>
              <span className="mt-1 block text-sm text-forest/70">
                We will ask their first name, age, and your relationship, then the assessment. They are added when you
                finish.
              </span>
            </span>
          </button>

          {others.length > 0 ? (
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Another saved person</p>
              <ul className="mt-2 flex flex-col gap-2">
                {others.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onStartForSubject(s.id)
                        onClose()
                      }}
                      className="w-full rounded-xl border border-border bg-page px-4 py-3 text-left text-sm font-medium text-forest transition hover:bg-surface"
                    >
                      {s.displayName}
                      {s.isSelf ? ' (you)' : ''}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                onAddProfileOnly()
                onClose()
              }}
              className="text-sm font-medium text-clay underline-offset-4 hover:underline"
            >
              Add someone to your account without taking a test yet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
