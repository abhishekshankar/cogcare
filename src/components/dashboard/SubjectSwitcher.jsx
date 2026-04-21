/**
 * Care profile selector (inline “This is for” + dropdown). Add loved one is in the header with Sign out.
 */
export default function SubjectSwitcher({ subjects, activeSubjectId, onChange }) {
  if (!subjects?.length) return null

  return (
    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
      <label
        htmlFor="dashboard-subject"
        className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-clay"
      >
        This is for
      </label>
      <select
        id="dashboard-subject"
        value={activeSubjectId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-border bg-page px-3 py-2 text-sm font-medium text-forest shadow-sm sm:h-9 sm:min-h-0 sm:max-w-[min(100%,20rem)] sm:flex-initial sm:py-0"
        aria-label="Person you are viewing — tests and visits use this profile"
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.displayName}
            {s.isSelf ? ' (you)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
