import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCurrentUser,
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth'
import { Brain } from 'lucide-react'
import { isAmplifyConfigured } from '../lib/amplifyConfigure'
import { setPendingNewPasswordFlag } from '../lib/authFlags'

/** Cognito default-style hint; pool may differ slightly. */
const PASSWORD_HINT =
  'At least 8 characters. Include uppercase, lowercase, a number, and a symbol.'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'
  const fromQuiz = searchParams.get('from') === 'quiz'
  const quizFlowExisting = searchParams.get('quizFlow') === 'existing'
  const modeParam = searchParams.get('mode')

  const [view, setView] = useState(() =>
    modeParam === 'signup' ? 'signUp' : modeParam === 'forgot' ? 'forgotPassword' : 'signIn',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  /** Skip login UI if already signed in (redirect to dashboard). */
  const [sessionPhase, setSessionPhase] = useState('checking')

  useEffect(() => {
    if (!isAmplifyConfigured()) return
    getCurrentUser()
      .then(() => navigate(returnTo, { replace: true }))
      .catch(() => setSessionPhase('show'))
  }, [navigate, returnTo])

  useEffect(() => {
    const pe = searchParams.get('prefillEmail')
    if (pe) setEmail(pe)
  }, [searchParams])

  function goView(next) {
    setView(next)
    setError('')
    setInfo('')
    const nextParams = new URLSearchParams(searchParams)
    if (next === 'signUp') nextParams.set('mode', 'signup')
    else if (next === 'signIn') nextParams.set('mode', 'signin')
    else if (next === 'forgotPassword') nextParams.set('mode', 'forgot')
    setSearchParams(nextParams, { replace: true })
  }

  if (!isAmplifyConfigured()) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-16 text-[#1A1A1A]">
        <div className="mx-auto max-w-md rounded-3xl border border-[#E8DCC4] bg-white p-8 shadow-sm">
          <p className="text-sm leading-relaxed text-[#3D4B3E]">
            Authentication is not configured in this build. For production, deploy the Amplify Gen 2
            backend and ensure the Hosting build runs <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">ampx generate outputs</code> (see{' '}
            <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">amplify.yml</code>) or set{' '}
            <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">VITE_USER_POOL_CLIENT_ID</code> and related vars. Locally, run{' '}
            <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">npm run sandbox</code> to write{' '}
            <code className="rounded bg-[#F3EFE9] px-1.5 py-0.5 text-xs">src/amplify_outputs.json</code>, then refresh.
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

  if (sessionPhase === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-4 text-[#3D4B3E]">
        <p className="text-sm font-medium">Loading…</p>
      </div>
    )
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setInfo('')
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

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const out = await signUp({
        username: trimmed,
        password,
        options: {
          userAttributes: {
            email: trimmed,
          },
        },
      })
      if (out.isSignUpComplete && out.nextStep?.signUpStep === 'DONE') {
        await signIn({ username: trimmed, password })
        navigate(returnTo, { replace: true })
        return
      }
      if (out.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setView('confirmSignUp')
        return
      }
      setError('Sign up requires an extra step; check your email or contact support.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmSignUp(e) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!confirmationCode.trim()) {
      setError('Enter the verification code from your email.')
      return
    }
    setLoading(true)
    try {
      await confirmSignUp({
        username: trimmed,
        confirmationCode: confirmationCode.trim(),
      })
      await signIn({ username: trimmed, password })
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPasswordRequest(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Enter your email.')
      return
    }
    setLoading(true)
    try {
      await resetPassword({ username: trimmed })
      setInfo('We sent a verification code to your email.')
      setView('confirmForgotPassword')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start password reset.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmForgotPassword(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!confirmationCode.trim()) {
      setError('Enter the code from your email.')
      return
    }
    setLoading(true)
    try {
      await confirmResetPassword({
        username: email.trim(),
        confirmationCode: confirmationCode.trim(),
        newPassword: password,
      })
      setPassword('')
      setPasswordConfirm('')
      setConfirmationCode('')
      setInfo('Your password was reset. Sign in below.')
      setView('signIn')
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('mode', 'signin')
      setSearchParams(nextParams, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await resendSignUpCode({ username: email.trim() })
      setInfo('We sent a new code. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend code.')
    } finally {
      setLoading(false)
    }
  }

  const title =
    view === 'confirmSignUp'
      ? 'Verify your email'
      : view === 'signUp'
        ? 'Create account'
        : view === 'forgotPassword'
          ? 'Reset password'
          : view === 'confirmForgotPassword'
            ? 'Choose a new password'
            : 'Sign in'

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
          {view !== 'confirmSignUp' &&
          view !== 'forgotPassword' &&
          view !== 'confirmForgotPassword' ? (
            <div className="mb-6 flex gap-2 rounded-full border border-[#E8DCC4] bg-[#FDFBF7] p-1">
              <button
                type="button"
                onClick={() => goView('signIn')}
                className={`flex-1 rounded-full py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                  view === 'signIn'
                    ? 'bg-white text-[#3D4B3E] shadow-sm'
                    : 'text-[#3D4B3E]/60 hover:text-[#3D4B3E]'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => goView('signUp')}
                className={`flex-1 rounded-full py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                  view === 'signUp'
                    ? 'bg-white text-[#3D4B3E] shadow-sm'
                    : 'text-[#3D4B3E]/60 hover:text-[#3D4B3E]'
                }`}
              >
                New here
              </button>
            </div>
          ) : null}

          <h1 className="font-serif text-2xl italic text-[#3D4B3E]">{title}</h1>
          {fromQuiz && view === 'signIn' && !quizFlowExisting ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              Use the email and temporary password we sent you, then choose a new password on the next screen.
            </p>
          ) : null}
          {fromQuiz && view === 'signIn' && quizFlowExisting ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              Sign in with your CogCare email and password to see this quiz on your dashboard.
            </p>
          ) : null}
          {view === 'signIn' && info ? (
            <p className="mt-2 text-sm text-[#3D4B3E]" role="status">
              {info}
            </p>
          ) : null}
          {view === 'signUp' ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              Create your CogCare account with email and password. You can also get an account by completing the Brain Health Index on the home page — we will email you a login link.
            </p>
          ) : null}
          {view === 'confirmSignUp' ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              We sent a verification code to <strong className="font-medium">{email.trim() || 'your email'}</strong>.
            </p>
          ) : null}
          {view === 'forgotPassword' ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              Enter your email and we will send a code to reset your password.
            </p>
          ) : null}
          {view === 'confirmForgotPassword' ? (
            <p className="mt-2 text-sm text-[#3D4B3E]/80">
              Enter the code from your email and choose a new password.
            </p>
          ) : null}

          {view === 'signIn' ? (
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
                type="button"
                className="w-full text-left text-sm text-[#A67B5B] underline-offset-4 hover:underline"
                onClick={() => goView('forgotPassword')}
              >
                Forgot password?
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#3D4B3E] py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2D382D] disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : null}

          {view === 'forgotPassword' ? (
            <form onSubmit={handleForgotPasswordRequest} className="mt-8 space-y-4">
              <div>
                <label htmlFor="fp-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Email
                </label>
                <input
                  id="fp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  required
                />
              </div>
              {error ? (
                <p className="text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              {info ? (
                <p className="text-sm text-[#3D4B3E]" role="status">
                  {info}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#3D4B3E] py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2D382D] disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send reset code'}
              </button>
              <button
                type="button"
                onClick={() => goView('signIn')}
                className="w-full text-sm text-[#A67B5B] underline-offset-4 hover:underline"
              >
                ← Back to sign in
              </button>
            </form>
          ) : null}

          {view === 'confirmForgotPassword' ? (
            <form onSubmit={handleConfirmForgotPassword} className="mt-8 space-y-4">
              {info ? (
                <p className="text-sm text-[#3D4B3E]" role="status">
                  {info}
                </p>
              ) : null}
              <div>
                <label htmlFor="fp-code" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Verification code
                </label>
                <input
                  id="fp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm tracking-widest outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  placeholder="123456"
                  required
                />
              </div>
              <div>
                <label htmlFor="fp-newpw" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  New password
                </label>
                <input
                  id="fp-newpw"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  required
                  minLength={8}
                />
                <p className="mt-1.5 text-xs text-[#3D4B3E]/65">{PASSWORD_HINT}</p>
              </div>
              <div>
                <label htmlFor="fp-newpw2" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Confirm new password
                </label>
                <input
                  id="fp-newpw2"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  required
                  minLength={8}
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
                {loading ? 'Updating…' : 'Reset password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('forgotPassword')
                  setConfirmationCode('')
                  setError('')
                  setInfo('')
                }}
                className="w-full text-sm text-[#A67B5B] underline-offset-4 hover:underline"
              >
                ← Request a new code
              </button>
            </form>
          ) : null}

          {view === 'signUp' ? (
            <form onSubmit={handleSignUp} className="mt-8 space-y-4">
              <div>
                <label htmlFor="su-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Email
                </label>
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="su-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Password
                </label>
                <input
                  id="su-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  required
                  minLength={8}
                />
                <p className="mt-1.5 text-xs text-[#3D4B3E]/65">{PASSWORD_HINT}</p>
              </div>
              <div>
                <label htmlFor="su-password2" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Confirm password
                </label>
                <input
                  id="su-password2"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  required
                  minLength={8}
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
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          ) : null}

          {view === 'confirmSignUp' ? (
            <form onSubmit={handleConfirmSignUp} className="mt-8 space-y-4">
              <div>
                <label htmlFor="confirm-code" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                  Verification code
                </label>
                <input
                  id="confirm-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 py-3 text-sm tracking-widest outline-none focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20"
                  placeholder="123456"
                  required
                />
              </div>
              {error ? (
                <p className="text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              {info ? (
                <p className="text-sm text-[#3D4B3E]" role="status">
                  {info}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#3D4B3E] py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2D382D] disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Verify and continue'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleResendCode}
                className="w-full rounded-full border border-[#E8DCC4] py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] transition hover:bg-[#F3EFE9] disabled:opacity-50"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('signUp')
                  setConfirmationCode('')
                  setError('')
                }}
                className="w-full text-sm text-[#A67B5B] underline-offset-4 hover:underline"
              >
                ← Back to sign up
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}
