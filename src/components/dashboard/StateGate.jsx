import { useState } from 'react'

/**
 * Pre-booking state-of-residence gate. Renders only when activeSubject
 * doesn't have residenceState set. Calls onSave with the chosen 2-letter
 * code and lets the parent persist to Subject.
 *
 * Doc reference: section 12 ("Patient travels"), section 3 (telehealth
 * licensure is per patient state at session time).
 */

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'],
  ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'],
  ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
]

export default function StateGate({ subjectName, onSave, onSkip, saving = false, error = null }) {
  const [value, setValue] = useState('')

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">One quick question</p>
      <h2 className="mt-2 font-serif text-xl text-forest">
        Which US state will {subjectName || 'you'} be in for the session?
      </h2>
      <p className="mt-2 text-sm text-forest/70">
        Telehealth providers must be licensed in your state at the time of the visit. We use this
        to show only the consultants who can legally see you.
      </p>
      <form
        className="mt-5 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!value) return
          onSave(value)
        }}
      >
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-clay">
            State
          </span>
          <select
            required
            className="w-64 rounded-xl border border-border bg-page px-3 py-2 text-sm text-forest focus:border-forest/50 focus:outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="">Select a state…</option>
            {US_STATES.map(([code, label]) => (
              <option key={code} value={code}>
                {label} ({code})
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={saving || !value}
          className="rounded-full bg-forest px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Continue'}
        </button>
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-forest/60 underline underline-offset-2"
          >
            Skip for now
          </button>
        ) : null}
      </form>
      {error ? (
        <p className="mt-3 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <p className="mt-4 text-xs text-forest/55">
        We store this on the profile you're booking for and never share it. You can change it later in Settings.
      </p>
    </div>
  )
}
