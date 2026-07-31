import { ExternalLink } from 'lucide-react'
import { memberVentureCards } from '../../../lib/networkVentureAssociation.js'
import { VENTURE_INDEPENDENCE_DISCLAIMER } from '../../../lib/ventureRegistry.js'
import {
  networkBodySm,
  networkCaption,
  networkCard,
  networkCardPad,
  networkEyebrow,
  networkPanel,
  networkSectionTitle,
  networkStackTight,
} from './networkUi.js'

/**
 * @param {{
 *   ventureAssociations: string[]
 *   memberPortalReturnTo?: string
 * }} props
 */
export default function NetworkVentureCards({
  ventureAssociations,
  memberPortalReturnTo = '/dashboard/cognition-network',
}) {
  const cards = memberVentureCards(ventureAssociations, { memberPortalReturnTo })

  if (!cards.length) return null

  return (
    <section className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-ventures-title">
      <p className={networkEyebrow}>Cross-venture navigation</p>
      <h2 id="network-member-ventures-title" className={`mt-3 ${networkSectionTitle}`}>
        Your venture associations
      </h2>
      <p className={`mt-2 ${networkBodySm}`}>
        Portable links open each venture in its own site. Your CogCare session does not carry over — there is
        no shared sign-in across domains.
      </p>

      <ul className={`mt-6 ${networkStackTight}`}>
        {cards.map((card) => (
          <li key={card.id} className={`${networkPanel} p-5`}>
            <p className={networkEyebrow}>{card.label}</p>
            {card.tagline ? <p className={`mt-2 ${networkBodySm}`}>{card.tagline}</p> : null}
            {card.entryUrl ? (
              <a
                href={card.entryUrl}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest hover:bg-surface"
                rel="noopener noreferrer"
              >
                Visit {card.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : null}
          </li>
        ))}
      </ul>

      <p className={`mt-6 ${networkCaption}`}>{VENTURE_INDEPENDENCE_DISCLAIMER}</p>
    </section>
  )
}
