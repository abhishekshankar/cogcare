/** Shared Playwright / VITE_E2E_NETWORK_MOCKS flag — invite flow + member portal. */

export function isE2eNetworkMocksEnabled() {
  return import.meta.env.VITE_E2E_NETWORK_MOCKS === '1'
}

export const E2E_NETWORK_MEMBER_EMAIL = 'founder@example.com'
export const E2E_NETWORK_MEMBER_SUB = 'e2e-member-sub'

const E2E_DASHBOARD_AUTH_KEY = 'cogcare:e2eDashboardAuth'

/** Opt-in dashboard auth bypass for member-portal Playwright tests only. */
export function isE2eDashboardAuthBypass() {
  if (!isE2eNetworkMocksEnabled()) return false
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(E2E_DASHBOARD_AUTH_KEY) === '1'
  } catch {
    return false
  }
}

const E2E_ADMIN_AUTH_KEY = 'cogcare:e2eAdminAuth'

/** Opt-in admin bypass for network intelligence Playwright tests only. */
export function isE2eAdminAuthBypass() {
  if (!isE2eNetworkMocksEnabled()) return false
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(E2E_ADMIN_AUTH_KEY) === '1'
  } catch {
    return false
  }
}

