import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { COMMUNICATION_PREFERENCES, PARTICIPATION_MODES } from '../../../lib/networkOnboarding.js'
import { NETWORK_SECONDARY_ACTION } from '../../../lib/networkIntro.js'
import { NETWORK_PUBLIC_ROUTES } from '../../../lib/networkRoutes.js'
import NetworkOnboardingFeedback from './NetworkOnboardingFeedback'
import {
  networkBodySm,
  networkDisplaySm,
  networkEyebrow,
  networkPrimaryBtn,
  networkSecondaryBtn,
  networkSuccessPanel,
} from './networkUi'

/**
 * @param {{
 *   memberEmail?: string
 *   slug?: string
 *   onboarding: {
 *     name?: string
 *     profileVisibility?: string
 *     publicProfileConsent?: boolean
 *     communicationsConsent?: boolean
 *     communicationPreference?: string
 *     participationMode?: string
 *   }
 *   alreadyAccepted?: boolean
 * }} props
 */
export default function NetworkOnboardingSuccess({
  memberEmail,
  slug,
  onboarding,
  alreadyAccepted = false,
}) {
  const isPrivate = onboarding.profileVisibility === 'private' || !onboarding.publicProfileConsent
  const isDirectory = onboarding.profileVisibility === 'directory'
  const participationLabel =
    PARTICIPATION_MODES.find((m) => m.id === onboarding.participationMode)?.label ||
    onboarding.participationMode
  const commsLabel =
    onboarding.communicationsConsent
      ? COMMUNICATION_PREFERENCES.find((c) => c.id === onboarding.communicationPreference)?.label ||
        onboarding.communicationPreference
      : 'No network communications'

  return (
    <div className="mt-10 space-y-8" role="status" aria-live="polite">
      <div className={`${networkSuccessPanel} p-6 sm:p-8`}>
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-forest-deep" aria-hidden />
          <div>
            <p className={networkEyebrow}>
              {alreadyAccepted ? 'Already accepted' : 'You’re in'}
            </p>
            <h2 className={`mt-3 ${networkDisplaySm}`}>
              {alreadyAccepted
                ? 'Your membership is confirmed'
                : `Welcome, ${onboarding.name?.split(' ')[0] || 'founding member'}`}
            </h2>
            <p className={`mt-4 ${networkBodySm}`}>
              {alreadyAccepted
                ? 'This invitation was already accepted. Your choices below are still in effect.'
                : 'Thank you for accepting your founding Cognition Network invitation. You can update visibility and communications anytime.'}
            </p>
          </div>
        </div>

        <ul className={`mt-8 space-y-3 ${networkBodySm}`}>
          <li className="flex gap-2">
            <span className="font-medium text-ink">Membership:</span>
            <span>{isPrivate ? 'Private — no public listing' : isDirectory ? 'Directory only' : 'Public profile'}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-ink">Participation:</span>
            <span>{participationLabel || 'Passive'}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-ink">Communications:</span>
            <span>{commsLabel}</span>
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!isPrivate && slug ? (
            <Link to={`/dr/${slug}`} className={networkPrimaryBtn}>
              View your profile
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
          <Link to="/dashboard/consultants" className={networkSecondaryBtn}>
            Go to dashboard
          </Link>
          <Link to={NETWORK_PUBLIC_ROUTES.understand} className={networkSecondaryBtn}>
            {NETWORK_SECONDARY_ACTION}
          </Link>
        </div>
      </div>

      <NetworkOnboardingFeedback memberEmail={memberEmail} slug={slug} />
    </div>
  )
}
