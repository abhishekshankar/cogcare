import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { isAmplifyConfigured } from './amplifyConfigure'

/**
 * @typedef {'loading' | 'signedOut' | 'signedIn'} AuthIdentityState
 */

/**
 * Client-side session probe for public pages (e.g. home nav).
 * @returns {AuthIdentityState}
 */
export function useAuthIdentity() {
  const [state, setState] = useState(() => (!isAmplifyConfigured() ? 'signedOut' : 'loading'))

  useEffect(() => {
    if (!isAmplifyConfigured()) return
    let cancelled = false
    getCurrentUser()
      .then(() => {
        if (!cancelled) setState('signedIn')
      })
      .catch(() => {
        if (!cancelled) setState('signedOut')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
