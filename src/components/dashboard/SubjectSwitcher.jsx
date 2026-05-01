/**
 * Care profile selector (inline “This is for” + dropdown). Add loved one is in the header with Sign out.
 */
export default function SubjectSwitcher({ subjects, activeSubjectId, onChange }) {
  if (!subjects?.length) return null

  return (
    <div className="flex w-full min-w-0 max-w-full shrink-0 flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
      <label
        htmlFor="dashboard-subject"
        className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-clay"
      >
        This profile is for
      </label>
      <select
        id="dashboard-subject"
        value={activeSubjectId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 min-h-[44px] w-full min-w-0 rounded-xl border border-border bg-white px-3 py-0 text-sm font-medium text-forest shadow-sm sm:h-9 sm:min-h-0 sm:w-auto sm:max-w-[18rem]"
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
