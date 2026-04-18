import { useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { confirmSignIn, signIn } from 'aws-amplify/auth'
import { Brain } from 'lucide-react'
import { isAmplifyConfigured } from '../lib/amplifyConfigure'

/**
 * Completes Cognito CUSTOM_WITHOUT_SRP (magic link from quiz email).
 * Link format: /auth/magic?email=&token=
 */
export default function MagicLinkPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = (searchParams.get('email') || '').trim()
  const token = (searchParams.get('token') || '').trim()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const configError = useMemo(() => {
    if (!isAmplifyConfigured()) {
      return 'Authentication is not configured in this build. Deploy the Amplify backend or run sandbox locally.'
    }
    if (!email || !token) {
      return 'This sign-in link is missing the email or token. Open the link from your email again.'
    }
    return null
  }, [email, token])

  const ranRef = useRef(false)

  useEffect(() => {
    if (configError) return
    if (ranRef.current) return
    ranRef.current = true

    const toLogin = () =>
      navigate(
        `/login?magicLinkError=1&from=quiz&prefillEmail=${encodeURIComponent(email)}&returnTo=${encodeURIComponent(returnTo)}`,
        { replace: true },
      )

    ;(async () => {
      try {
        const signInResult = await signIn({
          username: email.toLowerCase(),
          options: { authFlowType: 'CUSTOM_WITHOUT_SRP' },
        })

        if (signInResult.isSignedIn) {
          navigate(returnTo.startsWith('/') ? returnTo : `/${returnTo}`, { replace: true })
          return
        }

        const step = signInResult.nextStep?.signInStep
        if (step && step !== 'DONE') {
          const confirmResult = await confirmSignIn({ challengeResponse: token })
          if (confirmResult.isSignedIn) {
            navigate(returnTo.startsWith('/') ? returnTo : `/${returnTo}`, { replace: true })
            return
          }
          const next = confirmResult.nextStep?.signInStep
          if (next === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            navigate(returnTo.startsWith('/') ? returnTo : `/${returnTo}`, { replace: true })
            return
          }
        }

        toLogin()
      } catch {
        toLogin()
      }
    })()
  }, [configError, email, token, navigate, returnTo])

  if (configError) {
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
            <h1 className="font-serif text-xl italic text-[#3D4B3E]">Invalid link</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#3D4B3E]/85">{configError}</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-[#3D4B3E] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
            >
              Back to home & quiz
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBF7] px-4 text-[#3D4B3E]">
      <div className="flex items-center gap-2 font-serif text-lg italic">
        <Brain className="h-6 w-6 text-[#A67B5B]" strokeWidth={1.5} aria-hidden />
        CogCare
      </div>
      <p className="mt-6 text-sm font-medium">Signing you in…</p>
      <p className="mt-2 max-w-sm text-center text-xs text-[#3D4B3E]/70">
        One moment while we open your dashboard.
      </p>
    </div>
  )
}
