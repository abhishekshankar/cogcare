import { useState } from 'react'

/**
 * Shared "Create your password" form (Cognito CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED).
 * Parent supplies async onComplete(password) — typically `confirmSignIn({ challengeResponse })`.
 */
export default function CreatePasswordCard({ onComplete, title = 'Create your password', subtitle }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPw) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await onComplete(newPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-xl italic text-[#3D4B3E]">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-[#3D4B3E]/85">{subtitle}</p>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="create-pw-new" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
            New password
          </label>
          <input
            id="create-pw-new"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
            required
          />
        </div>
        <div>
          <label htmlFor="create-pw-confirm" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
            Confirm password
          </label>
          <input
            id="create-pw-confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
            required
          />
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#3D4B3E] py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2D382D] disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save and continue'}
        </button>
      </form>
    </div>
  )
}
