import {
  NETWORK_CORE_PROMISE,
  NETWORK_INTRO_TITLE,
  NETWORK_IS,
  NETWORK_IS_NOT,
  NETWORK_PARTICIPATION_POINTS,
} from '../../../lib/networkIntro.js'
import {
  networkBodySm,
  networkCard,
  networkDisplayMd,
  networkEyebrow,
  networkEyebrowCompact,
  networkPanel,
  networkSectionTitle,
} from './networkUi'

/**
 * Concise introduction to what the Cognition Network is and is not.
 * @param {{ variant?: 'full' | 'compact' }} props
 */
export default function NetworkIntroTutorial({ variant = 'full' }) {
  if (variant === 'compact') {
    return (
      <section className={`${networkPanel} p-6 sm:p-8`} aria-labelledby="network-intro-title">
        <p className={networkEyebrowCompact}>Before you begin</p>
        <h2 id="network-intro-title" className={`mt-3 ${networkSectionTitle}`}>
          {NETWORK_INTRO_TITLE}
        </h2>
        <ul className={`mt-6 space-y-4 ${networkBodySm}`}>
          {NETWORK_PARTICIPATION_POINTS.map((point) => (
            <li key={point.id}>
              <span className="font-medium text-ink">{point.title}.</span> {point.body}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="border-y border-border bg-white" aria-labelledby="network-intro-title">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <p className={networkEyebrow}>Start here</p>
        <h2 id="network-intro-title" className={`mt-4 ${networkDisplayMd}`}>
          {NETWORK_INTRO_TITLE}
        </h2>
        <p className="mt-4 max-w-2xl font-serif text-lg italic text-ink sm:text-xl">
          {NETWORK_CORE_PROMISE}
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className={`${networkPanel} p-8`}>
            <h3 className={networkEyebrowCompact}>What it is</h3>
            <ul className={`mt-5 space-y-4 ${networkBodySm}`}>
              {NETWORK_IS.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="font-medium text-forest-deep" aria-hidden>
                    +
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${networkPanel} p-8`}>
            <h3 className={networkEyebrowCompact}>What it is not</h3>
            <ul className={`mt-5 space-y-4 ${networkBodySm}`}>
              {NETWORK_IS_NOT.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="font-medium text-ink-faint" aria-hidden>
                    –
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {NETWORK_PARTICIPATION_POINTS.map((point) => (
            <div key={point.id} className={`${networkCard} p-6`}>
              <h3 className="font-serif text-base text-ink">{point.title}</h3>
              <p className={`mt-3 ${networkBodySm}`}>{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
