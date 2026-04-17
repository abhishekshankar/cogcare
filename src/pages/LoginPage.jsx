import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { signIn } from 'aws-amplify/auth'
import { Brain } from 'lucide-react'
import { isAmplifyConfigured } from '../lib/amplifyConfigure'
import { setPendingNewPasswordFlag } from '../lib/authFlags'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'
  const fromQuiz = searchParams.get('from') === 'quiz'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isAmplifyConfigured()) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-16 text-[#1A1A1A]">
        <div className="mx-auto max-w-md rounded-3xl border border-[#E8DCC4] bg-white p-8 shadow-sm">
          <p className="text-sm leading-relaxed text-[#3D4B3E]">
            Authentication is not configured in this build. Run{' '}
            <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">npm run sandbox</code> to
            generate <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">amplify_outputs.json</code>{' '}
            in <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">src/</code>, then refresh.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex text-sm font-semibold text-[#A67B5B] underline-offset-4 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const out = await signIn({ username: email.trim(), password })
      const step = out?.nextStep?.signInStep
      if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setPendingNewPasswordFlag()
        navigate(returnTo, { replace: true })
        return
      }
      if (step === 'DONE') {
        navigate(returnTo, { replace: true })
        return
      }
      setError('Additional sign-in steps are required; contact support.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-12 text-[#1A1A1A]">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 font-serif text-lg italic text-[#3D4B3E]"
        >
          <Brain className="h-5 w-5 text-[#A67B5B]" strokeWidth={1.5} aria-hidden />
          CogCare
        </Link>

        <div className="rounded-3xl border border-[#E8DCC4] bg-white p-8 shadow-sm">
          <h1 className="font-serif text-2xl italic text-[#3D4B3E]">Sign in</h1>
          {fromQuiz ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              Use the email and temporary password we sent you, then choose a new password on the next screen.
            </p>
          ) : null}

          <form onSubmit={handleSignIn} className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
