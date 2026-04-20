import { Link } from 'react-router-dom'

export default function SubjectSwitcher({ subjects, activeSubjectId, onChange }) {
  if (!subjects?.length) return null

  return (
    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
      <label htmlFor="dashboard-subject" className="sr-only">
        Person you are viewing
      </label>
      <select
        id="dashboard-subject"
        value={activeSubjectId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[min(100%,14rem)] truncate rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-forest shadow-sm"
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.displayName}
            {s.isSelf ? ' (you)' : ''}
          </option>
        ))}
      </select>
      <Link
        to="/?startQuiz=newSubject"
        className="shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-clay underline-offset-4 hover:underline"
      >
        + Add loved one
      </Link>
    </div>
  )
}
