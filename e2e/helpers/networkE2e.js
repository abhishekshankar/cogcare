export const E2E_NETWORK_SESSION_EMAIL = 'founder@example.com'
export const E2E_NETWORK_INVITE_TOKEN = 'e2e-founders-token'
export const E2E_INVITE_EXPIRED_TOKEN = 'e2e-invite-expired'
export const E2E_INVITE_REVOKED_TOKEN = 'e2e-invite-revoked'
export const E2E_INVITE_ACCEPTED_TOKEN = 'e2e-invite-accepted'
export const E2E_WRONG_ACCOUNT_EMAIL = 'other-physician@example.com'

/** Reset shared Vite institutional mock state between serial tests. */
export async function resetNetworkE2eState(request, scenario = 'default') {
  await request.post('/__e2e__/network-reset', { data: { scenario } })
}

/** Apply a physician-focused mock scenario without a full reset. */
export async function setNetworkE2eScenario(request, scenario) {
  await request.post('/__e2e__/network-scenario', { data: { scenario } })
}

/** Playwright init script: authenticated Network member (not admin). */
export function memberAuthInitScript() {
  sessionStorage.setItem('cogcare:e2eDashboardAuth', '1')
  sessionStorage.removeItem('cogcare:e2eAdminAuth')
  sessionStorage.removeItem('cogcare:e2eNetworkEmail')
}

/** Playwright init script: authenticated Network administrator. */
export function adminAuthInitScript() {
  sessionStorage.setItem('cogcare:e2eDashboardAuth', '1')
  sessionStorage.setItem('cogcare:e2eAdminAuth', '1')
  sessionStorage.removeItem('cogcare:e2eNetworkEmail')
}

/** Signed-in as a different email than the invitation target (email mismatch flows). */
export function wrongAccountAuthInitScript() {
  sessionStorage.setItem('cogcare:e2eDashboardAuth', '1')
  sessionStorage.removeItem('cogcare:e2eAdminAuth')
  sessionStorage.setItem('cogcare:e2eNetworkEmail', 'other-physician@example.com')
}

/** Clear Network E2E auth (sign-out / deep-link return without session). */
export function clearNetworkAuthInitScript() {
  sessionStorage.removeItem('cogcare:e2eDashboardAuth')
  sessionStorage.removeItem('cogcare:e2eAdminAuth')
  sessionStorage.removeItem('cogcare:e2eNetworkEmail')
}

/** Set a React-controlled input/textarea value and sync component state. */
export async function setReactFieldValue(page, selector, value) {
  await page.locator(selector).evaluate((el, next) => {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set
    setter?.call(el, next)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}
