import { Link } from 'react-router-dom'
import { NETWORK_SECONDARY_ACTION } from '../../../lib/networkIntro.js'
import { NETWORK_PUBLIC_ROUTES } from '../../../lib/networkRoutes.js'
import {
  networkBodySm,
  networkDisplaySm,
  networkEyebrow,
  networkSecondaryBtn,
} from './networkUi'

/**
 * Graceful empty/invalid invitation entry states.
 * @param {{
 *   title: string
 *   message: string
 *   messageRole?: 'alert' | 'status'
 *   children?: import('react').ReactNode
 * }} props
 */
export default function NetworkInviteUnavailable({ title, message, messageRole = 'alert', children }) {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center text-ink">
      <p className={networkEyebrow}>Cognition Network invitation</p>
      <h1 className={`mt-4 ${networkDisplaySm}`}>{title}</h1>
      <p className={`mt-5 ${networkBodySm}`} role={messageRole}>
        {message}
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
        {children}
        <Link to={NETWORK_PUBLIC_ROUTES.understand} className={networkSecondaryBtn}>
          {NETWORK_SECONDARY_ACTION}
        </Link>
      </div>
    </main>
  )
}
