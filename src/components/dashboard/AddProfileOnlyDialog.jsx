import { useState } from 'react'
import { X } from 'lucide-react'

const RELATION_OPTIONS = ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other']

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.ownerSub
 * @param {import('aws-amplify/data').generateClient} props.client
 * @param {(newSubjectId: string) => void} [props.onCreated]
 * @param {() => void} [props.onRefresh]
 */
export default function AddProfileOnlyDialog({ open, onClose, ownerSub, client, onCreated, onRefresh }) {
  const [displayName, setDisplayName] = useState('')
  const [age, setAge] = useState('')
  const [relation, setRelation] = useState(RELATION_OPTIONS[0])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const name = displayName.trim()
    if (!name) {
      setError('Please enter a first name.')
      return
    }
    const ageNum = age.trim() ? Number(age) : NaN
    if (age.trim() && (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 120)) {
      setError('Age must be between 1 and 120, or leave blank.')
      return
    }
    setBusy(true)
    try {
      const createdAt = new Date().toISOString()
      const { data: row, errors } = await client.models.Subject.create({
        owner: ownerSub,
        displayName: name,
        age: age.trim() ? Math.floor(ageNum) : undefined,
        relation,
        isSelf: false,
        createdAt,
      })
      if (errors?.length || !row?.id) {
        throw new Error(errors?.map((x) => x.message).join('; ') || 'Could not save profile.')
      }
      await onRefresh?.()
      onCreated?.(row.id)
      setDisplayName('')
      setAge('')
      setRelation(RELATION_OPTIONS[0])
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.')
    } finally {
      setBusy(false)
    }
  }

  function handleDismiss() {
    if (busy) return
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[195] flex items-end justify-center sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-forest/35 backdrop-blur-sm"
        aria-label="Close"
        onClick={handleDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-profile-only-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-border bg-page shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <h2 id="add-profile-only-title" className="font-serif text-lg italic text-forest">
            Add a person
          </h2>
          <button
            type="button"
            onClick={handleDismiss}
            disabled={busy}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest hover:bg-surface disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
          <p className="text-sm text-forest/75">
            Save someone you care for now. You can run the Brain Health Index for them anytime from My tests.
          </p>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
              {error}
            </div>
          ) : null}
          <div>
            <label htmlFor="add-profile-name" className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">
              First name
            </label>
            <input
              id="add-profile-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-page px-3 py-2.5 text-sm text-forest"
              autoComplete="given-name"
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor="add-profile-age" className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">
              Age <span className="font-normal normal-case tracking-normal text-forest/50">(optional)</span>
            </label>
            <input
              id="add-profile-age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-page px-3 py-2.5 text-sm text-forest"
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor="add-profile-relation" className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">
              Relationship
            </label>
            <select
              id="add-profile-relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-page px-3 py-2.5 text-sm text-forest"
              disabled={busy}
            >
              {RELATION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-forest px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-forest-dark disabled:opacity-50 sm:min-h-0"
            >
              {busy ? 'Saving…' : 'Save profile'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={handleDismiss}
              className="rounded-full border border-border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest hover:bg-surface disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
