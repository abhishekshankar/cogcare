import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUserAttributes, signOut } from 'aws-amplify/auth'
import { LogOut, Shield, Users } from 'lucide-react'
import NetworkAdminPanel from '../components/dashboard/NetworkAdminPanel.jsx'
import { networkBody, networkCard, networkCardPad, networkPage } from '../components/network/networkUi.js'
import { E2E_NETWORK_MEMBER_EMAIL, getE2eNetworkSessionEmail, isE2eDashboardAuthBypass } from '../lib/e2eNetworkMocks.js'
import { useIsAdmin } from '../lib/useIsAdmin.js'
import NetworkMemberPortalPage from './NetworkMemberPortalPage.jsx'

export default function NetworkWorkspacePage({ admin = false }) {
  const navigate = useNavigate()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [email, setEmail] = useState(
    isE2eDashboardAuthBypass() ? getE2eNetworkSessionEmail() || E2E_NETWORK_MEMBER_EMAIL : '',
  )
  const [identityLoading, setIdentityLoading] = useState(!isE2eDashboardAuthBypass())

  useEffect(() => {
    if (isE2eDashboardAuthBypass()) return
    fetchUserAttributes()
      .then((attributes) => setEmail(attributes.email ?? ''))
      .finally(() => setIdentityLoading(false))
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/network')
  }

  const loading = identityLoading || (admin && adminLoading)

  return (
    <div className={networkPage}>
      <header className="border-b border-border bg-white/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link to="/network" className="flex items-center gap-2 font-serif text-lg italic text-forest">
            {admin ? <Shield className="h-5 w-5 text-clay" aria-hidden /> : <Users className="h-5 w-5 text-clay" aria-hidden />}
            Cognition Network
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-ink-muted sm:inline">{email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest hover:bg-surface"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Cognition Network" className="mx-auto flex max-w-6xl gap-6 px-4 pb-4 sm:px-6">
          <Link className="text-xs font-bold uppercase tracking-[0.12em] text-forest" to={admin ? '/network/admin' : '/network/member'}>
            {admin ? 'Administration' : 'Member workspace'}
          </Link>
          <Link className="text-xs uppercase tracking-[0.12em] text-ink-muted" to="/network">
            About the Network
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {loading ? (
          <p className="py-20 text-center text-sm text-forest" role="status">Loading Network workspace…</p>
        ) : admin && !isAdmin ? (
          <section className={`${networkCard} ${networkCardPad} mx-auto max-w-xl`}>
            <h1 className="font-serif text-3xl italic text-forest">Administrator access required</h1>
            <p className={`mt-4 ${networkBody}`}>This account is not assigned to the Cognition Network administrator group.</p>
          </section>
        ) : admin ? (
          <NetworkAdminPanel adminEmail={email} />
        ) : (
          <NetworkMemberPortalPage email={email} />
        )}
      </main>
    </div>
  )
}
