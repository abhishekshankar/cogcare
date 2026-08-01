import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { isE2eAdminAuthBypass } from './e2eNetworkMocks.js'

/**
 * True when the signed-in user is in the Cognito `admin` group.
 * Returns { isAdmin, loading } so callers can render a spinner instead of
 * flashing the non-admin redirect on every nav.
 */
export function useIsAdmin() {
  const [state, setState] = useState({ isAdmin: false, loading: true })

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (isE2eAdminAuthBypass()) {
        if (!cancelled) setState({ isAdmin: true, loading: false })
        return
      }
      try {
        const session = await fetchAuthSession()
        // Cognito groups live in the ID token claim cognito:groups.
        const groups =
          session.tokens?.idToken?.payload?.['cognito:groups'] ?? []
        const isAdmin = Array.isArray(groups) && groups.includes('admin')
        if (!cancelled) setState({ isAdmin, loading: false })
      } catch {
        if (!cancelled) setState({ isAdmin: false, loading: false })
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
