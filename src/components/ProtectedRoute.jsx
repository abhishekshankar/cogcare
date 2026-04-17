import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { isAmplifyConfigured } from '../lib/amplifyConfigure'
import { hasPendingNewPasswordFlag } from '../lib/authFlags'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [state, setState] = useState(() => {
    if (!isAmplifyConfigured()) return 'unauthenticated'
    if (hasPendingNewPasswordFlag()) return 'pending_password'
    return 'checking'
  })

  useEffect(() => {
    if (!isAmplifyConfigured()) return
    if (hasPendingNewPasswordFlag()) return
    getCurrentUser()
      .then(() => setState('authenticated'))
      .catch(() => setState('unauthenticated'))
  }, [])

  if (state === 'checking') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#FDFBF7] text-[#3D4B3E]">
        <p className="text-sm font-medium">Loading…</p>
      </div>
    )
  }

  if (state === 'unauthenticated') {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  // pending_password: Cognito new-password challenge; dashboard shows CreatePasswordCard
  return children
}
