import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import NetworkInviteUnavailable from '../components/network/NetworkInviteUnavailable'
import NetworkIntroTutorial from '../components/network/NetworkIntroTutorial'
import NetworkOnboardingForm from '../components/network/NetworkOnboardingForm'
import NetworkOnboardingSuccess from '../components/network/NetworkOnboardingSuccess'
import {
  networkBodySm,
  networkCard,
  networkCardPad,
  networkDisplayMd,
  networkEyebrow,
  networkPage,
  networkPanel,
  networkPrimaryBtn,
  networkSecondaryBtn,
  networkSectionTitle,
  networkSuccessPanel,
  networkTextLink,
} from '../components/network/networkUi'
import { fetchNetworkInvitationByToken } from '../lib/networkInvitationPublic.js'
import { postAcceptNetworkInvitation } from '../lib/acceptNetworkInvitationUrl'
import { fetchNetworkInviteSessionEmail } from '../lib/networkInviteSession'
import {
  brandLabel,
  parseBrandsJson,
  roleLabel,
  NETWORK_INVITE_STATUSES,
} from '../../lib/networkConstants.js'
import { inviteStatusMessage } from '../../lib/networkInvitationStatus.js'
import { NETWORK_CORE_PROMISE, NETWORK_ETHICAL_SCARCITY, NETWORK_PRIMARY_ACTION, NETWORK_SECONDARY_ACTION, NETWORK_INTRO_SECTION_ID } from '../../lib/networkIntro.js'
import {
  emptyNetworkOnboardingForm,
  validateNetworkOnboarding,
} from '../../lib/networkOnboarding.js'
import {
  buildNetworkInvitePath,
  resolveNetworkInviteToken,
} from '../lib/networkInvitationTokens'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function NetworkInvitePage() {
  const { token: routeToken } = useParams()
  const [searchParams] = useSearchParams()
  const token = useMemo(
    () => resolveNetworkInviteToken({ routeToken, queryToken: searchParams.get('token') }),
    [routeToken, searchParams],
  )
  const inviteReturnPath = token ? buildNetworkInvitePath(token) : '/network/invite'

  const [loadState, setLoadState] = useState({ status: 'loading' })
  const [sessionEmail, setSessionEmail] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState(() => emptyNetworkOnboardingForm())
  const [acceptanceResult, setAcceptanceResult] = useState(null)

  useDocumentMeta({
    title: acceptanceResult
      ? 'Welcome to the Cognition Network'
      : 'Accept your Cognition Network invitation',
    description: acceptanceResult
      ? 'Your founding Cognition Network membership is confirmed.'
      : `${NETWORK_CORE_PROMISE} Complete your founding network profile for The Cogcare Cognition Network.`,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const email = await fetchNetworkInviteSessionEmail()
        if (!cancelled) setSessionEmail(email)
      } catch {
        if (!cancelled) setSessionEmail(null)
      } finally {
        if (!cancelled) setSessionLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- derive invite load state from URL token
      setLoadState({ status: 'error', message: 'This link is missing an invitation token.' })
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const invitation = await fetchNetworkInvitationByToken(token)
        if (cancelled) return
        if (!invitation) {
          setLoadState({
            status: 'error',
            message: 'Invitation not found or this link is invalid.',
          })
          return
        }
        const blocked = inviteStatusMessage(invitation)
        setLoadState({ status: blocked ? 'blocked' : 'ok', invitation, message: blocked })
        setForm(
          emptyNetworkOnboardingForm({
            inviteeName: invitation.inviteeName,
            inviteBrands: parseBrandsJson(invitation.brandsJson),
          }),
        )
      } catch {
        if (!cancelled) {
          setLoadState({
            status: 'error',
            message: 'Invitation not found or this link is invalid.',
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const invitation = loadState.status === 'ok' || loadState.status === 'blocked' ? loadState.invitation : null
  const brands = useMemo(() => parseBrandsJson(invitation?.brandsJson), [invitation])
  const emailMismatch =
    invitation &&
    sessionEmail &&
    invitation.email?.toLowerCase() !== sessionEmail

  const loginHref = `/login?returnTo=${encodeURIComponent(inviteReturnPath)}&prefillEmail=${encodeURIComponent(invitation?.email || '')}`

  async function handleAccept(e) {
    e.preventDefault()
    setSubmitError('')
    const validation = validateNetworkOnboarding(form)
    if (!validation.ok) {
      setSubmitError(validation.error)
      return
    }
    setSubmitting(true)
    try {
      const result = await postAcceptNetworkInvitation({
        token,
        onboarding: validation.value,
      })
      setAcceptanceResult({
        slug: result?.slug,
        onboarding: validation.value,
        alreadyAccepted: Boolean(result?.alreadyAccepted),
      })
    } catch (err) {
      setSubmitError(err?.message || 'Could not accept invitation.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadState.status === 'loading') {
    return (
      <div className={`flex min-h-screen items-center justify-center ${networkPage}`}>
        <p className={`inline-flex items-center gap-2 ${networkBodySm}`} role="status" aria-live="polite">
          <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden />
          Loading invitation…
        </p>
      </div>
    )
  }

  if (loadState.status === 'error') {
    return (
      <NetworkInviteUnavailable
        title="Invitation unavailable"
        message={loadState.message}
        messageRole="alert"
      />
    )
  }

  if (loadState.status === 'blocked') {
    const acceptedSlug = invitation?.consultantSlug
    return (
      <NetworkInviteUnavailable
        title={NETWORK_INVITE_STATUSES[invitation.status] || 'Invitation closed'}
        message={loadState.message}
        messageRole="status"
      >
        {acceptedSlug ? (
          <Link
            to={`/dr/${acceptedSlug}`}
            className={networkPrimaryBtn}
          >
            View your profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </NetworkInviteUnavailable>
    )
  }

  return (
    <div className={networkPage}>
      <main className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        <Link to="/network" className={networkTextLink}>
          ← Cognition Network
        </Link>

        <div className={`mt-8 ${networkCard} ${networkCardPad}`}>
          <p className={networkEyebrow}>Invitation only · No fee</p>
          <h1 className={`mt-3 ${networkDisplayMd}`}>Welcome to the founding cohort</h1>
          <p className={`mt-4 ${networkBodySm}`}>
            You are invited as a{' '}
            <span className="font-semibold text-ink">
              {roleLabel(invitation.roleCategory) || 'founding member'}
            </span>
            {brands.length ? (
              <>
                {' '}
                across {brands.map(brandLabel).join(', ')}.
              </>
            ) : (
              '.'
            )}
          </p>
          {invitation.personalNote ? (
            <blockquote className="mt-6 border-l-[3px] border-l-clay bg-surface/60 px-4 py-3 text-sm italic text-ink-muted">
              {invitation.personalNote}
            </blockquote>
          ) : null}
          <p className={`mt-6 border-l-[3px] border-l-clay pl-4 ${networkBodySm}`}>
            {NETWORK_ETHICAL_SCARCITY}
          </p>
        </div>

        <div className="mt-10">
          <NetworkIntroTutorial variant="compact" />
        </div>

        {sessionLoading ? (
          <p className={`mt-10 ${networkBodySm}`} role="status" aria-live="polite">
            Checking your sign-in…
          </p>
        ) : !sessionEmail ? (
          <div className={`mt-10 ${networkPanel} p-6 sm:p-8`}>
            <h2 className={networkSectionTitle}>Sign in to accept</h2>
            <p className={`mt-3 ${networkBodySm}`}>
              Use <span className="font-semibold">{invitation.email}</span> — the address this
              invitation was sent to.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={loginHref} className={networkPrimaryBtn}>
                {NETWORK_PRIMARY_ACTION}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href={`#${NETWORK_INTRO_SECTION_ID}`} className={networkSecondaryBtn}>
                {NETWORK_SECONDARY_ACTION}
              </a>
            </div>
          </div>
        ) : emailMismatch ? (
          <div
            className="mt-10 rounded-2xl border border-error-border bg-error-bg p-6 text-error"
            role="alert"
          >
            <h2 className="font-serif text-xl text-ink">Email mismatch</h2>
            <p className="mt-3 text-sm">
              You are signed in as <strong>{sessionEmail}</strong>, but this invitation is for{' '}
              <strong>{invitation.email}</strong>.
            </p>
            <Link to={loginHref} className={`mt-6 ${networkPrimaryBtn}`}>
              Switch account
            </Link>
          </div>
        ) : acceptanceResult ? (
          <NetworkOnboardingSuccess
            memberEmail={sessionEmail || undefined}
            slug={acceptanceResult.slug}
            onboarding={acceptanceResult.onboarding}
            alreadyAccepted={acceptanceResult.alreadyAccepted}
          />
        ) : (
          <>
            <div className={`mt-10 flex items-start gap-3 ${networkSuccessPanel} p-4 ${networkBodySm}`}>
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-deep" aria-hidden />
              <p>
                Signed in as <strong>{sessionEmail}</strong>. Complete the onboarding form below.
              </p>
            </div>
            <NetworkOnboardingForm
              form={form}
              setForm={setForm}
              error={submitError}
              submitting={submitting}
              onSubmit={handleAccept}
            />
          </>
        )}
      </main>
    </div>
  )
}
