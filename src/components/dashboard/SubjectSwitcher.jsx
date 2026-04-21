import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function SubjectSwitcher({ subjects, activeSubjectId, onChange, onAddLovedOne }) {
  if (!subjects?.length) return null

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Who this is for</p>
      <div className="flex min-w-0 flex-wrap items-stretch gap-2">
        <label htmlFor="dashboard-subject" className="sr-only">
          Person you are viewing — tests and visits use this profile
        </label>
        <select
          id="dashboard-subject"
          value={activeSubjectId || ''}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-border bg-page px-3 py-2 text-sm font-medium text-forest shadow-sm sm:h-9 sm:min-h-0 sm:max-w-[min(100%,20rem)] sm:py-0"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.displayName}
              {s.isSelf ? ' (you)' : ''}
            </option>
          ))}
        </select>
        {typeof onAddLovedOne === 'function' ? (
          <button
            type="button"
            onClick={onAddLovedOne}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-white px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-forest shadow-sm transition-colors hover:bg-surface sm:min-h-0 sm:h-9 sm:px-4"
            aria-label="Add someone you care for, with or without a test"
          >
            <UserPlus className="h-3.5 w-3.5 shrink-0 text-clay" strokeWidth={1.75} aria-hidden />
            Add loved one
          </button>
        ) : (
          <Link
            to="/?startQuiz=newSubject"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-white px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-forest shadow-sm transition-colors hover:bg-surface sm:min-h-0 sm:h-9 sm:px-4"
            aria-label="Add someone new to care for and run an assessment"
          >
            <UserPlus className="h-3.5 w-3.5 shrink-0 text-clay" strokeWidth={1.75} aria-hidden />
            Add loved one
          </Link>
        )}
      </div>
    </div>
  )
}
