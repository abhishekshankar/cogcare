import { test, expect, devices } from '@playwright/test'
import {
  E2E_NETWORK_SESSION_EMAIL,
  E2E_INVITE_EXPIRED_TOKEN,
  E2E_INVITE_REVOKED_TOKEN,
  E2E_INVITE_ACCEPTED_TOKEN,
  E2E_NETWORK_INVITE_TOKEN,
  adminAuthInitScript,
  clearNetworkAuthInitScript,
  memberAuthInitScript,
  resetNetworkE2eState,
  setNetworkE2eScenario,
  wrongAccountAuthInitScript,
} from './helpers/networkE2e.js'

test.describe.configure({ mode: 'serial' })

test.describe('Physician — invitation entry and onboarding', () => {
  test('PHYS-INV-01 missing token shows unavailable state', async ({ page }) => {
    await page.goto('/network/invite')
    await expect(page.getByRole('heading', { name: /Invitation unavailable/i })).toBeVisible()
    await expect(page.getByText(/missing an invitation token/i)).toBeVisible()
  })

  test('PHYS-INV-02 invalid token shows unavailable state', async ({ page }) => {
    await page.goto('/network/invite/not-a-real-token')
    await expect(page.getByText(/not found|invalid/i)).toBeVisible()
  })

  test('PHYS-INV-03 expired invitation is blocked', async ({ page }) => {
    await page.goto(`/network/invite/${E2E_INVITE_EXPIRED_TOKEN}`)
    await expect(page.getByRole('heading', { name: 'Expired' })).toBeVisible()
    await expect(page.getByText('This invitation has expired.')).toBeVisible()
  })

  test('PHYS-INV-04 revoked invitation is blocked', async ({ page }) => {
    await page.goto(`/network/invite/${E2E_INVITE_REVOKED_TOKEN}`)
    await expect(page.getByText('This invitation has been revoked.')).toBeVisible()
  })

  test('PHYS-INV-05 already-accepted invitation is blocked', async ({ page }) => {
    await page.goto(`/network/invite/${E2E_INVITE_ACCEPTED_TOKEN}`)
    await expect(page.getByText('This invitation has already been accepted.')).toBeVisible()
  })

  test('PHYS-INV-06 email mismatch blocks acceptance when signed in as wrong account', async ({ page }) => {
    await page.addInitScript(wrongAccountAuthInitScript)
    await page.goto(`/network/invite/${E2E_NETWORK_INVITE_TOKEN}`)
    await expect(page.getByRole('heading', { name: /Email mismatch/i })).toBeVisible()
    await expect(page.getByText(E2E_NETWORK_SESSION_EMAIL)).toBeVisible()
    await expect(page.getByRole('link', { name: /Switch account/i })).toBeVisible()
  })

  test('PHYS-INV-07 terminal invitation links stop disclosing invitee email', async ({ request }) => {
    const revoked = await request.get('/__e2e__/network-public-data', {
      params: { token: E2E_INVITE_REVOKED_TOKEN },
    })
    const revokedBody = await revoked.json()
    expect(revokedBody.invitation.email).toBeUndefined()
    expect(revokedBody.invitation.inviteeName).toBeUndefined()

    const accepted = await request.get('/__e2e__/network-public-data', {
      params: { token: E2E_INVITE_ACCEPTED_TOKEN },
    })
    const acceptedBody = await accepted.json()
    expect(acceptedBody.invitation.email).toBeUndefined()
    expect(acceptedBody.invitation.consultantSlug).toBe('dr-pat-kim')

    const expired = await request.get('/__e2e__/network-public-data', {
      params: { token: E2E_INVITE_EXPIRED_TOKEN },
    })
    const expiredBody = await expired.json()
    expect(expiredBody.invitation.status).toBe('expired')
    expect(expiredBody.invitation.email).toBeUndefined()
    expect(expiredBody.invitation.inviteeName).toBeUndefined()
  })

  test('PHYS-ONB-01 busy specialist joins privately with passive defaults', async ({ page }) => {
    await page.addInitScript(memberAuthInitScript)
    await page.goto(`/network/invite/${E2E_NETWORK_INVITE_TOKEN}`)
    await expect(page.getByRole('heading', { name: /founding cohort/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/Physician/i)).toBeVisible()
    await page.locator('#onboard-name').fill('Dr. Pat Kim')
    await page.locator('#onboard-title').fill('Behavioral neurologist')
    await page.locator('#onboard-organization').fill('CogCare')
    await page.getByRole('checkbox', { name: /Join privately/i }).check()
    await page.getByRole('checkbox', { name: /Disclosure acknowledgement/i }).check()
    await page.getByRole('button', { name: /Review your invitation/i }).click()
    await expect(page.getByText(/Private — no public listing/i)).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/No network communications/i)).toBeVisible()
  })
})

test.describe('Physician — private passive portal', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('PHYS-PORT-01 overview shows physician role and passive membership without pressure', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByText(/Welcome, Dr\. Pat Kim/i)).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/Physician/i).first()).toBeVisible()
    await expect(page.getByText(/Passive membership/i)).toBeVisible()
    await expect(page.getByText(/Passive private association is valid/i).first()).toBeVisible()
  })

  test('PHYS-PORT-02 no patient dashboard or social directory copy', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('link', { name: 'My tests' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Consultations' })).toHaveCount(0)
    await expect(page.getByText(/leaderboard|member directory|follow/i)).toHaveCount(0)
  })

  test('PHYS-PORT-03 no membership record shows truthful guidance', async ({ page, request }) => {
    await setNetworkE2eScenario(request, 'physician-no-membership')
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /No membership record found/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/sign in with the email your invitation was sent to/i)).toBeVisible()
  })
})

test.describe('Physician — consent and professional profile', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('PHYS-CONSENT-01 public profile, name/bio, and communications are independent', async ({ page }) => {
    await page.goto('/network/member#profile')
    await expect(page.locator('#member-public-profile')).toBeVisible({ timeout: 15_000 })
    await page.locator('#member-public-profile').check()
    await page.locator('input[name="profileVisibility"][value="public"]').check()
    await expect(page.locator('#member-name-bio')).toBeVisible()
    await page.locator('#member-name-bio').check()
    await page.locator('#member-communications').uncheck()
    await page.getByRole('button', { name: /Save profile & consent/i }).click()
    await expect(page.getByText(/Your settings were saved/i)).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/No network communications/i).first()).toBeVisible()
  })

  test('PHYS-CONSENT-02 revoking public profile persists after reload', async ({ page }) => {
    await page.goto('/network/member#profile')
    await page.locator('#member-public-profile').uncheck()
    await page.getByRole('button', { name: /Save profile & consent/i }).click()
    await expect(page.getByText(/Your settings were saved/i)).toBeVisible()
    await page.reload()
    await expect(page.locator('#member-public-profile')).not.toBeChecked({ timeout: 15_000 })
    await expect(page.getByText(/Private — no public listing/i).first()).toBeVisible()
  })

  test('PHYS-CONSENT-03 empty name shows validation error', async ({ page }) => {
    await page.goto('/network/member#profile')
    await page.locator('#member-name').fill('')
    await page.getByRole('button', { name: /Save profile & consent/i }).click()
    await expect(page.getByText(/Please enter your name/i)).toBeVisible()
  })

  test('PHYS-CONSENT-04 unicode biography persists through membership profile API and reload', async ({
    page,
    request,
  }) => {
    const bio = 'Clinician-educator — café rounds, Zürich symposium, 40% prevention framing.'
    const save = await request.post('/api/network-member-profile', {
      data: {
        email: E2E_NETWORK_SESSION_EMAIL,
        consultantId: 'e2e-consultant-1',
        form: {
          name: 'Dr. Pat Kim',
          title: 'Behavioral neurologist',
          organization: 'CogCare',
          bio,
          participationMode: 'passive',
          ventureAssociations: ['cogcare'],
          publicProfileConsent: false,
          profileVisibility: 'private',
          nameBioConsent: false,
          communicationsConsent: false,
          communicationPreference: 'founding_updates',
        },
      },
    })
    expect(save.ok()).toBeTruthy()

    await page.goto('/network/member#profile')
    await expect(page.locator('#member-bio')).toHaveValue(bio, { timeout: 15_000 })
    await page.reload()
    await expect(page.locator('#member-bio')).toHaveValue(bio, { timeout: 15_000 })
  })
})

test.describe('Physician — targeted content and opportunities', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('PHYS-CONTENT-01 physician-targeted briefing visible; researcher-only hidden', async ({ page }) => {
    await page.goto('/network/member#briefings')
    await expect(page.getByRole('heading', { name: 'E2E briefing' })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Researcher-only briefing')).toHaveCount(0)
  })

  test('PHYS-OPP-01 closed and future opportunities are not listed', async ({ page }) => {
    await page.goto('/network/member#opportunities')
    await expect(page.getByText('Closed physician opportunity')).toHaveCount(0)
    await expect(page.getByText('Future physician opportunity')).toHaveCount(0)
    await expect(page.getByText('E2E opportunity')).toBeVisible()
  })

  test('PHYS-OPP-02 venture-scoped NSO ask hidden until venture associated', async ({ page }) => {
    await page.goto('/network/member#opportunities')
    await expect(page.getByText('NSO venture opportunity')).toHaveCount(0)
  })

  test('PHYS-OPP-03 interest, quiet decline, withdraw, and re-entry', async ({ page }) => {
    await page.goto('/network/member#opportunities')
    await page.getByRole('button', { name: 'Express interest', exact: true }).click()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible()
    await page.getByRole('button', { name: 'Withdraw interest', exact: true }).click()
    await expect(page.getByText(/express interest again/i)).toBeVisible()
    await page.getByRole('button', { name: 'Decline quietly', exact: true }).click()
    await expect(page.getByText(/Declined — no further action expected/i)).toBeVisible()
  })

  test('PHYS-OPP-04 double-click express interest is idempotent', async ({ page }) => {
    await page.goto('/network/member#opportunities')
    const button = page.getByRole('button', { name: 'Express interest', exact: true })
    await button.dblclick()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Withdraw interest', exact: true })).toHaveCount(1)
  })
})

test.describe('Physician — institutional participation', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('PHYS-ATTR-01 approve attribution; cross-member item not shown', async ({ page, request }) => {
    await setNetworkE2eScenario(request, 'physician-cross-member-attribution')
    await page.goto('/network/member#institution')
    await expect(page.getByText(/Another member attribution/i)).toHaveCount(0)
    await page.getByRole('button', { name: /Approve this item/i }).click()
    await expect(page.getByText(/No attribution requests await your decision/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('PHYS-ATTR-02 decline attribution is terminal', async ({ page }) => {
    await page.goto('/network/member#institution')
    await page.getByRole('button', { name: 'Decline this item', exact: true }).click()
    await expect(page.getByText(/No attribution requests await your decision/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Approve this item/i })).toHaveCount(0)
  })

  test('PHYS-INTRO-01 consent without leaking contact details in institution panel', async ({ page }) => {
    await page.goto('/network/member#institution')
    const institution = page.locator('#institution')
    await expect(institution.getByText(/Contact details are not released/i)).toBeVisible({ timeout: 15_000 })
    await institution.getByRole('button', { name: /^Consent$/i }).click()
    await expect(page.getByText(/No introduction requests are pending/i)).toBeVisible({ timeout: 15_000 })
  })

  test('PHYS-INTRO-02 decline introduction quietly', async ({ page }) => {
    await page.goto('/network/member#institution')
    await page.getByRole('button', { name: 'Decline this introduction', exact: true }).click()
    await expect(page.getByText(/No introduction requests are pending/i)).toBeVisible()
  })

  test('PHYS-PROP-01 proposal with professional language succeeds; PHI rejected in feedback', async ({
    page,
    request,
  }) => {
    await page.goto('/network/member#institution')
    await page.getByPlaceholder('Proposal title').fill('Shorter briefing cadence')
    await page.getByLabel('Proposal summary').fill('A concise editorial suggestion for clinician onboarding.')
    await page.getByRole('button', { name: /Submit for review/i }).click()
    await expect(page.getByPlaceholder('Proposal title')).toHaveValue('', { timeout: 15_000 })

    await page.goto('/network/member#feedback')
    await page.locator('#network-feedback-message').fill('Patient name Jane Doe was confused.')
    await page.getByRole('button', { name: /Send feedback/i }).click()
    await expect(
      page.getByRole('alert').filter({ hasText: /must not contain patient or diagnostic/i }),
    ).toBeVisible()

    const res = await request.post('/__e2e__/network-member-api', {
      data: { operation: 'submitFeedback', message: 'Clear consent wording for busy clinicians.' },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('PHYS-EVENT-01 RSVP attending persists; full event waitlists', async ({ page, request }) => {
    await page.goto('/network/member#institution')
    const foundingSalon = page.locator('#institution li').filter({ hasText: 'Founding salon (E2E)' })
    await foundingSalon.getByRole('button', { name: /Request a place/i }).click()
    await expect(foundingSalon.getByText(/You requested a place — attendance is private/i)).toBeVisible({
      timeout: 15_000,
    })
    await page.reload()
    await expect(foundingSalon.getByText(/You requested a place — attendance is private/i)).toBeVisible()

    await setNetworkE2eScenario(request, 'physician-event-full')
    const waitlistRes = await request.post('/__e2e__/network-member-api', {
      data: { operation: 'respondEvent', eventId: 'e2e-event-full', response: 'attending' },
    })
    expect(waitlistRes.ok()).toBeTruthy()
    const waitlistBody = await waitlistRes.json()
    expect(waitlistBody.eventResponse.response).toBe('waitlist')

    await page.reload()
    const fullEventItem = page.locator('#institution li').filter({ hasText: 'Full-capacity salon (E2E)' })
    await expect(fullEventItem.getByText(/waitlist/i)).toBeVisible({ timeout: 15_000 })
  })

  test('PHYS-PREF-01 cadence gated on communications consent', async ({ page }) => {
    await page.goto('/network/member#institution')
    const cadence = page.locator('#institution select')
    await expect(cadence.locator('option[value="monthly"]')).toHaveAttribute('disabled', '')
    await page.goto('/network/member#profile')
    await page.locator('#member-communications').check()
    await page.getByRole('button', { name: /Save profile & consent/i }).click()
    await page.goto('/network/member#institution')
    await cadence.selectOption('monthly')
    await page.getByRole('button', { name: /Save preferences/i }).click()
    await expect(page.locator('#institution').getByText('Saved.', { exact: true })).toBeVisible()
  })
})

test.describe('Physician — empty states and verified activity', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request, 'physician-empty-workspace')
    await page.addInitScript(memberAuthInitScript)
  })

  test('PHYS-EMPTY-01 truthful zero-content states across workspace', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByText(/No briefings have been published/i)).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/No opportunities match your current venture/i)).toBeVisible()
    await expect(page.getByText(/No recorded contributions yet/i)).toBeVisible()
    await page.goto('/network/member#institution')
    await expect(page.getByText(/No attribution requests await your decision/i)).toBeVisible()
    await expect(page.getByText(/No introduction requests are pending/i)).toBeVisible()
    await expect(page.getByText(/No salons or events are currently open/i)).toBeVisible()
  })
})

test.describe('Physician — API resilience and session', () => {
  test('PHYS-API-01 401 and 500 member API errors surface safely', async ({ request }) => {
    await resetNetworkE2eState(request, 'api-401')
    let res = await request.post('/__e2e__/network-member-api', { data: { operation: 'workspace' } })
    expect(res.status()).toBe(401)

    await resetNetworkE2eState(request, 'api-500')
    res = await request.post('/__e2e__/network-member-api', { data: { operation: 'workspace' } })
    expect(res.status()).toBe(500)
  })

  test('PHYS-API-02 slow workspace load shows loading landmark then content', async ({ page, request }) => {
    await resetNetworkE2eState(request, 'api-slow')
    await page.addInitScript(memberAuthInitScript)
    await page.goto('/network/member')
    await expect(page.getByRole('status')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Cognition briefings/i })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('PHYS-API-03 401 during workspace load recovers via sign-in redirect', async ({ page, request }) => {
    await resetNetworkE2eState(request, 'api-401')
    await page.addInitScript(memberAuthInitScript)
    await page.goto('/network/member')
    await expect(page).toHaveURL(/\/network\/login/, { timeout: 15_000 })
  })

  test('PHYS-SESSION-01 sign out clears access; deep link requires login', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(clearNetworkAuthInitScript)
    await page.goto('/network/member#institution')
    await expect(page).toHaveURL(/\/network\/login/)
    await context.close()
  })

  test('PHYS-SESSION-02 back button after opportunity response keeps recorded state', async ({
    page,
    request,
  }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
    await page.goto('/network/member#opportunities')
    await page.getByRole('button', { name: 'Express interest', exact: true }).click()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible()
    await page.goto('/network/member#profile')
    await page.goBack()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible({ timeout: 15_000 })
  })
})

test.describe('Physician — accessibility and admin visibility', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('PHYS-A11Y-01 landmarks, live regions, and reduced-motion-friendly loading', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.locator('main')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('navigation', { name: 'Member workspace sections' })).toBeVisible()
    await expect(page.getByRole('status').first()).toBeAttached()
  })

  test('PHYS-A11Y-02 mobile viewport preserves section navigation', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await context.newPage()
    await page.addInitScript(memberAuthInitScript)
    await page.goto('/network/member')
    await expect(page.getByRole('navigation', { name: 'Member workspace sections' })).toBeVisible({
      timeout: 15_000,
    })
    await context.close()
  })

  test('PHYS-ADMIN-01 admin-authored opportunity visible to physician after publish', async ({
    browser,
    request,
  }) => {
    await resetNetworkE2eState(request)
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    await adminPage.addInitScript(adminAuthInitScript)
    await adminPage.goto('/network/admin')
    await adminPage.getByRole('tab', { name: /Operations/i }).click()
    const form = adminPage.locator('form').filter({
      has: adminPage.getByRole('heading', { name: /Create an opportunity/i }),
    })
    await form.getByLabel('Title').fill('Physician salon feedback')
    await form.getByLabel('Summary').fill('Scoped physician ask.')
    await form.getByLabel('Why this matters').fill('Improves clinician onboarding.')
    await form.getByLabel('State').selectOption('published')
    await form.getByRole('button', { name: /Save opportunity/i }).click()
    await expect(adminPage.getByText(/Opportunity saved/i)).toBeVisible({ timeout: 15_000 })
    await adminContext.close()

    const memberContext = await browser.newContext()
    const memberPage = await memberContext.newPage()
    await memberPage.addInitScript(memberAuthInitScript)
    await memberPage.goto('/network/member#opportunities')
    await expect(memberPage.getByText('Physician salon feedback')).toBeVisible({ timeout: 15_000 })
    await memberContext.close()
  })
})

test.describe('Physician — unauthenticated entry', () => {
  test('PHYS-AUTH-01 member portal redirects when session cleared', async ({ page }) => {
    await page.addInitScript(clearNetworkAuthInitScript)
    await page.goto('/network/member')
    await expect(page).toHaveURL(/\/network\/login/)
  })
})
