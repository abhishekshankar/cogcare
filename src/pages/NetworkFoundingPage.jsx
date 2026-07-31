import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Globe2, Shield, Users } from 'lucide-react'
import NetworkIntroTutorial from '../components/network/NetworkIntroTutorial'
import {
  NETWORK_CORE_PROMISE,
  NETWORK_ETHICAL_SCARCITY,
  NETWORK_FOUNDING_INVITE_STEPS,
  NETWORK_HERO_SUPPORT,
  NETWORK_PASSIVE_PRIVATE,
  NETWORK_PRIVACY_DEFAULT,
  NETWORK_SECONDARY_ACTION,
  NETWORK_INTRO_SECTION_ID,
} from '../../lib/networkIntro.js'
import {
  networkBody,
  networkBodySm,
  networkCard,
  networkCardPad,
  networkDisplayLg,
  networkDisplayMd,
  networkEyebrow,
  networkEyebrowCompact,
  networkPage,
  networkPrimaryBtn,
  networkSecondaryBtn,
} from '../components/network/networkUi'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { resolveSafeReturnDestination } from '../../lib/networkReturnTo.js'

const VOICES = ['Physicians', 'Researchers', 'Educators', 'Care leaders', 'Builders']

const PILLARS = [
  {
    icon: Shield,
    title: 'Invitation only',
    body: 'Every founding member is personally invited. There is no open signup and no membership fee.',
  },
  {
    icon: Globe2,
    title: 'Three brands, one network',
    body: 'CogCare, Cogtraining, and Neuro Second Opinion share a curated cognition network — not a marketplace.',
  },
  {
    icon: Shield,
    title: 'Private by default',
    body: NETWORK_PRIVACY_DEFAULT,
  },
  {
    icon: Users,
    title: 'Considered welcomes',
    body: NETWORK_ETHICAL_SCARCITY,
  },
]

export default function NetworkFoundingPage() {
  const [searchParams] = useSearchParams()
  const returnDest = resolveSafeReturnDestination(searchParams.get('returnTo'))

  useDocumentMeta({
    title: 'The Cogcare Cognition Network',
    description: `${NETWORK_CORE_PROMISE} ${NETWORK_HERO_SUPPORT}`,
    canonical:
      typeof window !== 'undefined' ? `${window.location.origin}/network` : 'https://cogcare.org/network',
  })

  return (
    <div className={networkPage}>
      <header className="border-b border-border bg-page">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <Link to="/" className="font-serif text-lg italic text-ink">
            CogCare
          </Link>
          <nav aria-label="Network account">
            <Link to="/login" className={networkSecondaryBtn}>
              Member sign in
            </Link>
          </nav>
        </div>
      </header>

      <main id="network-main">
        {returnDest ? (
          <div className="border-b border-border bg-surface/60">
            <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
              <a
                href={returnDest.href}
                className="text-sm text-forest underline underline-offset-2"
              >
                ← Return to {returnDest.label}
              </a>
            </div>
          </div>
        ) : null}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
            <p className={networkEyebrow}>Founding launch</p>
            <h1 className={`mt-5 max-w-3xl ${networkDisplayLg}`}>The Cogcare Cognition Network</h1>
            <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-ink sm:text-2xl">
              {NETWORK_CORE_PROMISE}
            </p>
            <p className={`mt-6 max-w-2xl ${networkBody}`}>{NETWORK_HERO_SUPPORT}</p>
            <p className={`mt-6 max-w-2xl border-l-[3px] border-l-clay pl-4 ${networkBodySm}`}>
              {NETWORK_PASSIVE_PRIVATE}
            </p>
            <p className={`mt-4 max-w-2xl border-l-[3px] border-l-clay pl-4 ${networkBodySm}`}>
              {NETWORK_PRIVACY_DEFAULT}
            </p>
            <div className="mt-10 flex flex-wrap gap-2">
              {VOICES.map((voice) => (
                <span
                  key={voice}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted"
                >
                  {voice}
                </span>
              ))}
            </div>
            <div className="mt-10">
              <a href={`#${NETWORK_INTRO_SECTION_ID}`} className={networkSecondaryBtn}>
                {NETWORK_SECONDARY_ACTION}
              </a>
            </div>
          </div>
        </section>

        <NetworkIntroTutorial variant="full" />

        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            {PILLARS.map((pillar) => {
              const PillarIcon = pillar.icon
              return (
                <div key={pillar.title} className={`${networkCard} ${networkCardPad}`}>
                  <div className="mb-5 inline-flex rounded-full border border-border bg-surface p-3 text-forest-deep">
                    <PillarIcon className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="font-serif text-xl text-ink">{pillar.title}</h2>
                  <p className={`mt-4 ${networkBodySm}`}>{pillar.body}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-y border-border bg-surface/40">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">
              <div>
                <p className={networkEyebrow}>How invitations work</p>
                <h2 className={`mt-4 ${networkDisplayMd}`}>Your link is personal</h2>
                <ol className={`mt-8 space-y-5 ${networkBodySm}`}>
                  {NETWORK_FOUNDING_INVITE_STEPS.map((step, index) => (
                    <li key={step}>
                      <span className="font-semibold text-ink">{index + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className={`${networkCard} p-6`}>
                <p className={networkEyebrowCompact}>Already invited?</p>
                <p className={`mt-4 ${networkBodySm}`}>
                  Open the invitation link from your email. It will look like{' '}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink">/network/invite/…</code>{' '}
                  or{' '}
                  <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink">
                    /network/invite?token=…
                  </code>
                  .
                </p>
                <Link to="/login" className={`mt-8 w-full ${networkPrimaryBtn}`}>
                  Sign in to continue
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-12 text-center text-xs text-ink-faint sm:px-6">
        <p>CogCare · Cognition Network founding launch · Invitation only · No fee</p>
        <p className="mt-3">
          <Link to="/" className="text-ink-muted underline underline-offset-2 hover:text-ink">
            Return to CogCare home
          </Link>
        </p>
      </footer>
    </div>
  )
}
