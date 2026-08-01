import { test, expect, devices } from '@playwright/test'
import {
  E2E_NETWORK_SESSION_EMAIL,
  adminAuthInitScript,
  memberAuthInitScript,
  resetNetworkE2eState,
} from './helpers/networkE2e.js'

const E2E_SESSION_EMAIL = E2E_NETWORK_SESSION_EMAIL

// The Vite E2E mock server holds one shared in-memory institutional workspace (see
// vite-plugin-e2e-network-mocks.js). Any test that mutates it (opportunity responses,
// attributions, introductions, events, admin authoring) races with every other such test
// under Playwright's fullyParallel workers unless the whole file runs in one worker.
test.describe.configure({ mode: 'serial' })

test.describe('Cognition Network — public landing and auth separation', () => {
  test('AUTO-NET-PUB-01 founding landing page loads', async ({ page }) => {
    await page.goto('/network')
    await expect(page.getByRole('heading', { name: /Cogcare Cognition Network/i })).toBeVisible()
    await expect(
      page.getByText('A trusted circle advancing better cognitive care.', { exact: true }).first(),
    ).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByText('Passive private association is valid', { exact: false }).first()).toBeVisible()
    await expect(page.getByText(/separate, recorded approval/i).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Member sign in' })).toHaveAttribute('href', '/network/login')
  })

  test('AUTO-NET-PUB-02 member sign-in is network branded', async ({ page }) => {
    await page.goto('/network/login')
    await expect(page.getByRole('heading', { name: 'Member sign in' })).toBeVisible()
    await expect(page.getByText(/Invitation-only access/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'New here' })).toHaveCount(0)
  })

  test('AUTO-NET-PUB-05 admin login shows administrator branding', async ({ page }) => {
    await page.goto('/network/login?returnTo=%2Fnetwork%2Fadmin&role=admin')
    await expect(page.getByRole('heading', { name: /Network administrator sign in/i })).toBeVisible()
    await expect(page.getByText(/Restricted operations access/i)).toBeVisible()
  })

  test('AUTO-NET-PUB-07 consultant profile route shows not found for unknown slug', async ({ page }) => {
    await page.goto('/dr/not-a-real-slug')
    await expect(
      page.getByRole('heading', { name: /Consultant not found|Something went wrong/i }),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('AUTO-NET-PUB-03 admin route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/network/admin')
    await expect(page).toHaveURL(/\/network\/login/)
    await expect(page.url()).toMatch(/role=admin/)
  })

  test('AUTO-NET-PUB-04 member portal redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page).toHaveURL(/\/network\/login/)
  })

  test('AUTO-NET-PUB-06 cross-venture return link when returnTo is sibling venture', async ({ page }) => {
    await page.goto('/network?returnTo=' + encodeURIComponent('https://cogtraining.org/cognition-network'))
    await expect(page.getByRole('link', { name: /Return to Cogtraining/i })).toBeVisible()
  })
})

test.describe('Cognition Network — invite entry', () => {
  test('AUTO-NET-INV-01 invite page without token shows unavailable state', async ({ page }) => {
    await page.goto('/network/invite')
    await expect(page.getByRole('heading', { name: /Invitation unavailable/i })).toBeVisible()
    await expect(page.getByText(/missing an invitation token/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /Understand the Network/i })).toBeVisible()
  })

  test('AUTO-NET-INV-02 invalid invite token shows unavailable state', async ({ page }) => {
    await page.goto('/network/invite/not-a-real-token')
    await expect(page.getByRole('heading', { name: /Invitation unavailable/i })).toBeVisible()
    await expect(page.getByText(/not found|invalid/i)).toBeVisible()
  })

  test('invite page accepts token from query string', async ({ page }) => {
    await page.goto('/network/invite?token=also-not-real')
    await expect(page.getByRole('heading', { name: /Invitation unavailable/i })).toBeVisible()
    await expect(page.getByText(/not found|invalid/i)).toBeVisible()
  })
})

test.describe('Cognition Network — onboarding', () => {
  test('AUTO-NET-ONB-01 private onboarding submission shows success confirmation', async ({ page }) => {
    await page.goto('/network/invite/e2e-founders-token')
    await expect(page.getByRole('heading', { name: /Welcome to the founding cohort/i })).toBeVisible({
      timeout: 15_000,
    })

    await page.locator('#onboard-name').fill('Dr. Pat Kim')
    await page.locator('#onboard-title').fill('Behavioral neurologist')
    await page.locator('#onboard-organization').fill('CogCare')
    await page.getByRole('checkbox', { name: /Join privately/i }).check()
    await expect(page.locator('#onboard-public-profile')).not.toBeChecked()
    await expect(page.locator('#onboard-communications')).not.toBeChecked()
    await page.getByRole('checkbox', { name: /Disclosure acknowledgement/i }).check()
    await page.getByRole('button', { name: /Review your invitation/i }).click()

    await expect(page.getByRole('heading', { name: /Welcome, Dr\./i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/Private — no public listing/i)).toBeVisible()
    await expect(page.getByText(/No network communications/i)).toBeVisible()
  })

  test('AUTO-NET-ONB-02 feedback form saves successfully after onboarding confirmation', async ({ page }) => {
    await page.goto('/network/invite/e2e-founders-token')
    await expect(page.getByRole('heading', { name: /Welcome to the founding cohort/i })).toBeVisible({
      timeout: 15_000,
    })

    await page.locator('#onboard-name').fill('Dr. Pat Kim')
    await page.locator('#onboard-title').fill('Behavioral neurologist')
    await page.locator('#onboard-organization').fill('CogCare')
    await page.getByRole('checkbox', { name: /Join privately/i }).check()
    await page.getByRole('checkbox', { name: /Disclosure acknowledgement/i }).check()
    await page.getByRole('button', { name: /Review your invitation/i }).click()

    await expect(page.getByRole('heading', { name: /Share feedback/i })).toBeVisible({ timeout: 15_000 })
    await page.locator('#network-feedback-message').fill('Clear consent wording.')
    await page.getByRole('button', { name: /Send feedback/i }).click()
    await expect(page.getByText(/feedback was saved for review/i)).toBeVisible()
  })
})

test.describe('Cognition Network — feedback API', () => {
  test('dev feedback endpoint accepts valid submission', async ({ request }) => {
    const res = await request.post('/api/network-feedback', {
      data: {
        message: 'Focused automated check.',
        memberEmail: E2E_SESSION_EMAIL,
        context: 'onboarding_success',
      },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.channel).toBe('local')
  })
})

test.describe('Cognition Network — member portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(memberAuthInitScript)
  })

  test('AUTO-NET-MEM-01 authenticated member portal shows overview and private defaults', async ({ page }) => {
    await page.goto('/network/member')
    await expect(
      page.getByRole('heading', { name: /trusted circle advancing better cognitive care/i }),
    ).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/Private — no public listing/i).first()).toBeVisible()
    await expect(page.getByText(/Passive private association is valid/i).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Cognition briefings/i })).toBeVisible()
  })

  test('AUTO-NET-MEM-02 workspace section navigation jumps to each portal section', async ({ page }) => {
    await page.goto('/network/member')
    const sectionNav = page.getByRole('navigation', { name: 'Member workspace sections' })
    await expect(sectionNav).toBeVisible({ timeout: 15_000 })

    for (const [label, targetId] of [
      ['Overview', 'overview'],
      ['Briefings', 'briefings'],
      ['Profile & consent', 'profile'],
      ['Matched opportunities', 'opportunities'],
      ['Activity', 'activity'],
      ['Institution', 'institution'],
      ['Feedback', 'feedback'],
    ]) {
      const link = sectionNav.getByRole('link', { name: label })
      await expect(link).toHaveAttribute('href', `#${targetId}`)
      await expect(page.locator(`#${targetId}`)).toHaveCount(1)
    }
  })

  test('AUTO-NET-MEM-03 venture cards show cross-venture navigation with independence copy', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /Your venture associations/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/does not carry over/i).first()).toBeVisible()
    await expect(page.getByText(/not employment, clinical endorsement/i).first()).toBeVisible()
  })

  test('AUTO-NET-NAV-01 member portal shows no patient dashboard navigation', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /Profile & consent/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('link', { name: 'My tests' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'More tests' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Consultations' })).toHaveCount(0)
  })

  test('AUTO-NET-NAV-02 member shell has no social directory or ranking copy', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByText(/leaderboard|follow|like this/i)).toHaveCount(0)
    await expect(page.getByText(/member directory/i)).toHaveCount(0)
  })

  test('AUTO-NET-INS-01 briefings section shows editorial content', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /Cognition briefings/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'E2E briefing' })).toBeVisible()
    await expect(page.getByText('Founding cohort orientation note.')).toBeVisible()
  })

  test('AUTO-NET-INS-02 opportunities explain rationale', async ({ page }) => {
    await page.goto('/network/member')
    await expect(
      page.getByRole('heading', { name: 'Matched contribution opportunities', exact: true }),
    ).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Why:').first()).toBeVisible()
  })

  test('AUTO-NET-INS-04 activity shows verified contributions', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /Verified contributions & impact/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/Onboarding copy review/i)).toBeVisible()
    await expect(page.getByText(/do not infer participation from membership alone/i)).toBeVisible()
  })

  test('AUTO-NET-INS-08 member portal feedback saves successfully', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /Share feedback/i })).toBeVisible({ timeout: 15_000 })
    await page.locator('#network-feedback-message').fill('Portal navigation is clear.')
    await page.getByRole('button', { name: /Send feedback/i }).click()
    await expect(page.getByText(/feedback was saved for review/i)).toBeVisible()
  })

  test('AUTO-NET-INS-09 consent update keeps private visibility when public profile is unchecked', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.getByRole('heading', { name: /Profile & consent/i })).toBeVisible({ timeout: 15_000 })
    await page.locator('#member-public-profile').uncheck()
    await page.getByRole('button', { name: /Save profile & consent/i }).click()
    await expect(page.getByText(/Your settings were saved/i)).toBeVisible()
    await expect(page.getByText(/Private — no public listing/i).first()).toBeVisible()
  })

  test('AUTO-NET-INS-09 communications consent is independent from visibility', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.locator('#member-public-profile')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('#member-communications')).toBeVisible()
    await page.locator('#member-communications').check()
    await expect(page.getByText(/founding updates|email/i).first()).toBeVisible()
  })
})

test.describe('Cognition Network — opportunity responses', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('AUTO-NET-OPP-01 member can express interest and it persists across reload', async ({ page }) => {
    await page.goto('/network/member')
    await expect(
      page.getByRole('heading', { name: 'Matched contribution opportunities', exact: true }),
    ).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Express interest', exact: true }).click()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Withdraw interest', exact: true })).toBeVisible()
    await page.reload()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible({ timeout: 15_000 })
  })

  test('AUTO-NET-OPP-02 member can decline a contribution opportunity quietly, terminally', async ({ page }) => {
    await page.goto('/network/member')
    await expect(
      page.getByRole('heading', { name: 'Matched contribution opportunities', exact: true }),
    ).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Decline quietly', exact: true }).click()
    await expect(page.getByText(/Declined — no further action expected/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Withdraw interest', exact: true })).toHaveCount(0)
  })

  test('AUTO-NET-OPP-03 member can withdraw interest and respond again', async ({ page }) => {
    await page.goto('/network/member')
    await page.getByRole('button', { name: 'Express interest', exact: true }).click()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Withdraw interest', exact: true }).click()
    await expect(page.getByText(/you can express interest again/i)).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('button', { name: 'Express interest', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Decline quietly', exact: true })).toBeVisible()
  })
})

test.describe('Cognition Network — institutional member sections', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
  })

  test('AUTO-NET-ATTR-01 member can approve pending attribution', async ({ page }) => {
    await page.goto('/network/member#institution')
    await expect(page.getByRole('heading', { name: /Institutional participation/i })).toBeVisible({
      timeout: 15_000,
    })
    await page.getByRole('button', { name: /Approve this item/i }).click()
    await expect(page.getByText(/No attribution requests await your decision/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('AUTO-NET-ATTR-02 attribution empty state after decline', async ({ page }) => {
    await page.goto('/network/member#institution')
    await page.getByRole('button', { name: 'Decline this item', exact: true }).click()
    await expect(page.getByText(/No attribution requests await your decision/i)).toBeVisible({ timeout: 15_000 })
  })

  test('AUTO-NET-INTRO-01 member can consent to pending introduction', async ({ page }) => {
    await page.goto('/network/member#institution')
    await expect(page.getByText(/Discuss accessibility review cadence/i)).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: /^Consent$/i }).click()
    await expect(page.getByText(/No introduction requests are pending/i)).toBeVisible({ timeout: 15_000 })
  })

  test('AUTO-NET-INTRO-02 member can decline introduction quietly', async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.goto('/network/member#institution')
    await page.getByRole('button', { name: 'Decline this introduction', exact: true }).click()
    await expect(page.getByText(/No introduction requests are pending/i)).toBeVisible({ timeout: 15_000 })
  })

  test('AUTO-NET-INS-05 member can submit a proposal', async ({ page }) => {
    await page.goto('/network/member#institution')
    await page.getByPlaceholder('Proposal title').fill('Shorter briefing cadence')
    await page.getByLabel('Proposal summary').fill('A concise editorial suggestion.')
    await page.getByRole('button', { name: /Submit for review/i }).click()
    await expect(page.getByPlaceholder('Proposal title')).toHaveValue('', { timeout: 15_000 })
  })

  test('AUTO-NET-INS-06 member can RSVP to salon and see persistent recorded status', async ({ page, request }) => {
    await resetNetworkE2eState(request)
    await page.goto('/network/member#institution')
    const foundingSalon = page.locator('#institution li').filter({ hasText: 'Founding salon (E2E)' })
    await expect(foundingSalon.getByText(/Attendance is private/i)).toBeVisible({ timeout: 15_000 })
    await foundingSalon.getByRole('button', { name: /Request a place/i }).click()
    await expect(foundingSalon.getByText(/You requested a place — attendance is private/i)).toBeVisible({
      timeout: 15_000,
    })
    await expect(foundingSalon.getByRole('button', { name: /Request a place/i })).toHaveCount(0)
    await page.reload()
    await expect(foundingSalon.getByText(/You requested a place — attendance is private/i)).toBeVisible({
      timeout: 15_000,
    })
  })

  test('AUTO-NET-INS-07 non-none email cadence disabled without communications consent', async ({ page }) => {
    await page.goto('/network/member#institution')
    const cadence = page.locator('#institution select')
    await expect(cadence.locator('option[value="important_only"]')).toHaveAttribute('disabled', '')
    await expect(cadence.locator('option[value="monthly"]')).toHaveAttribute('disabled', '')
  })

  test('AUTO-NET-INS-07 preferences save when cadence is none', async ({ page }) => {
    await page.goto('/network/member#institution')
    await page.getByRole('button', { name: /Save preferences/i }).click()
    await expect(page.locator('#institution')).toBeVisible({ timeout: 15_000 })
  })
})

test.describe('Cognition Network — security API mocks', () => {
  test('AUTO-NET-SEC-01 member API requires configured endpoint', async ({ request }) => {
    const res = await request.post('/__e2e__/network-member-api', { data: { operation: 'workspace' } })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.workspace).toBeTruthy()
  })

  test('AUTO-NET-SEC-06 member API rejects PHI in feedback', async ({ request }) => {
    const res = await request.post('/__e2e__/network-member-api', {
      data: { operation: 'submitFeedback', message: 'Patient name Jane Doe was confused.' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/patient|diagnostic/i)
  })

  test('AUTO-NET-NOTIF-01 admin queue refuses member without communication consent', async ({ request }) => {
    const res = await request.post('/__e2e__/network-admin-api', {
      data: {
        operation: 'queueNotification',
        memberId: 'e2e-consultant-1',
        kind: 'briefing',
        subject: 'Should fail',
        message: 'No consent.',
      },
    })
    expect(res.status()).toBe(409)
  })
})

test.describe('Cognition Network — admin workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(adminAuthInitScript)
  })

  test('AUTO-NET-ADM-01 admin intelligence tab shows privacy-minimized metrics', async ({ page }) => {
    await page.goto('/network/admin')
    await page.getByRole('tab', { name: /Intelligence/i }).click()
    await expect(page.getByRole('heading', { name: /Network intelligence/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/First 10/i).first()).toBeVisible()
    await expect(page.getByText(/Invitation states/i)).toBeVisible()
    await expect(page.getByText(/Consent coverage/i)).toBeVisible()
  })

  test('AUTO-NET-ADM-02 operations tab loads institution operations shell', async ({ page }) => {
    await page.goto('/network/admin')
    await page.getByRole('tab', { name: /Operations/i }).click()
    await expect(page.getByRole('heading', { name: /Institution operations/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/not member rankings/i)).toBeVisible()
  })

  test('AUTO-NET-ADM-03 admin authoring forms for briefing and opportunity', async ({ page }) => {
    await page.goto('/network/admin')
    await page.getByRole('tab', { name: /Operations/i }).click()
    await expect(page.getByRole('heading', { name: /Author a briefing/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('heading', { name: /Create an opportunity/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Save briefing/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Save opportunity/i })).toBeVisible()
  })

  test('AUTO-NET-ADM-04 admin operations include contribution, introduction, event, attribution, notification', async ({
    page,
  }) => {
    await page.goto('/network/admin')
    await page.getByRole('tab', { name: /Operations/i }).click()
    await expect(page.getByRole('heading', { name: /Verified contribution or impact/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByRole('heading', { name: /Consent-mediated introduction/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Controlled salon or event/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Consent-enforced notification/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Request item-specific attribution/i })).toBeVisible()
  })

  test('AUTO-NET-ADM-05 non-admin member sees administrator access required', async ({ page }) => {
    await page.addInitScript(memberAuthInitScript)
    await page.goto('/network/admin')
    await expect(page.getByRole('heading', { name: /Administrator access required/i })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('AUTO-NET-ADM-06 admin-published opportunity becomes visible in the member workspace', async ({
    browser,
    request,
  }) => {
    await resetNetworkE2eState(request)
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    await adminPage.addInitScript(adminAuthInitScript)
    await adminPage.goto('/network/admin')
    await adminPage.getByRole('tab', { name: /Operations/i }).click()
    const opportunityForm = adminPage.locator('form').filter({ has: adminPage.getByRole('heading', { name: /Create an opportunity/i }) })
    await opportunityForm.getByLabel('Title').fill('E2E admin-authored opportunity')
    await opportunityForm.getByLabel('Summary').fill('Admin authored summary.')
    await opportunityForm.getByLabel('Why this matters').fill('Admin authored rationale.')
    await opportunityForm.getByLabel('State').selectOption('published')
    await opportunityForm.getByRole('button', { name: /Save opportunity/i }).click()
    await expect(adminPage.getByText(/Opportunity saved/i)).toBeVisible({ timeout: 15_000 })
    await adminContext.close()

    const memberContext = await browser.newContext()
    const memberPage = await memberContext.newPage()
    await memberPage.addInitScript(memberAuthInitScript)
    await memberPage.goto('/network/member')
    await expect(memberPage.getByText('E2E admin-authored opportunity')).toBeVisible({ timeout: 15_000 })
    await memberContext.close()
  })

  test('AUTO-NET-ADM-07 admin-recorded contribution becomes visible in member activity', async ({
    browser,
    request,
  }) => {
    await resetNetworkE2eState(request)
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    await adminPage.addInitScript(adminAuthInitScript)
    await adminPage.goto('/network/admin')
    await adminPage.getByRole('tab', { name: /Operations/i }).click()
    const recordForm = adminPage.locator('form').filter({ has: adminPage.getByRole('heading', { name: /Verified contribution or impact/i }) })
    await recordForm.getByLabel('Member record ID').fill('e2e-consultant-1')
    await recordForm.getByLabel('Title').fill('E2E admin-recorded contribution')
    await recordForm.getByLabel('Verified description').fill('Recorded by an administrator for E2E verification.')
    await recordForm.getByRole('button', { name: /Record verified work/i }).click()
    await expect(adminPage.getByText(/Verified record added/i)).toBeVisible({ timeout: 15_000 })
    await adminContext.close()

    const memberContext = await browser.newContext()
    const memberPage = await memberContext.newPage()
    await memberPage.addInitScript(memberAuthInitScript)
    await memberPage.goto('/network/member')
    await expect(memberPage.getByText('E2E admin-recorded contribution')).toBeVisible({ timeout: 15_000 })
    await memberContext.close()
  })
})

test.describe('Cognition Network — accessibility and responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(memberAuthInitScript)
  })

  test('AUTO-NET-A11Y-01 member portal exposes main landmark and live regions', async ({ page }) => {
    await page.goto('/network/member')
    await expect(page.locator('main')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('navigation', { name: 'Member workspace sections' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Cognition Network' })).toBeVisible()
  })

  test('AUTO-NET-A11Y-02 mobile viewport preserves section navigation', async ({ browser, request }) => {
    const context = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await context.newPage()
    await resetNetworkE2eState(request)
    await page.addInitScript(memberAuthInitScript)
    await page.goto('/network/member')
    await expect(page.getByRole('navigation', { name: 'Member workspace sections' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByRole('link', { name: 'Institution' })).toBeVisible()
    await context.close()
  })
})
