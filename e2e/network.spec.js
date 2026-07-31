import { test, expect } from '@playwright/test'
import { E2E_NETWORK_SESSION_EMAIL } from './helpers/networkE2e.js'

const E2E_SESSION_EMAIL = E2E_NETWORK_SESSION_EMAIL

test.describe('Cognition Network routes', () => {
  test('founding landing page loads', async ({ page }) => {
    await page.goto('/network')
    await expect(page.getByRole('heading', { name: /Cogcare Cognition Network/i })).toBeVisible()
    await expect(
      page.getByText('A trusted circle advancing better cognitive care.', { exact: true }).first(),
    ).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(
      page.getByText('Passive private association is valid', { exact: false }).first(),
    ).toBeVisible()
    await expect(
      page.getByText(/separate, recorded approval/i).first(),
    ).toBeVisible()
  })

  test('consultant profile route shows not found for unknown slug', async ({ page }) => {
    await page.goto('/dr/not-a-real-slug')
    await expect(
      page.getByRole('heading', { name: /Consultant not found|Something went wrong/i }),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('dashboard network route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard/network')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Cognition Network invite entry', () => {
  test('invite page without token shows unavailable state', async ({ page }) => {
    await page.goto('/network/invite')
    await expect(page.getByRole('heading', { name: /Invitation unavailable/i })).toBeVisible()
    await expect(page.getByText(/missing an invitation token/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /Understand the Network/i })).toBeVisible()
  })

  test('invite page with invalid route token shows unavailable state', async ({ page }) => {
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

test.describe('Cognition Network onboarding submission', () => {
  test('private onboarding submission shows success confirmation', async ({ page }) => {
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

    await expect(page.getByRole('heading', { name: /Welcome, Dr\./i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/Private — no public listing/i)).toBeVisible()
    await expect(page.getByText(/No network communications/i)).toBeVisible()
  })

  test('feedback form saves successfully after onboarding confirmation', async ({ page }) => {
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

    await expect(page.getByRole('heading', { name: /Share feedback/i })).toBeVisible({
      timeout: 15_000,
    })

    await page.locator('#network-feedback-message').fill('Clear consent wording.')
    await page.getByRole('button', { name: /Send feedback/i }).click()
    await expect(page.getByText(/feedback was saved for review/i)).toBeVisible()
  })
})

test.describe('Cognition Network feedback API', () => {
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

test.describe('Cognition Network member portal auth', () => {
  test('member portal redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Cognition Network member portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('cogcare:e2eDashboardAuth', '1')
    })
  })

  test('authenticated member portal shows overview and private defaults', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(page.getByRole('heading', { name: /trusted circle advancing better cognitive care/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/Private — no public listing/i).first()).toBeVisible()
    await expect(page.getByText(/Passive private association is valid/i).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Cognition briefings/i })).toBeVisible()
  })

  test('member can express interest in a contribution opportunity', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(
      page.getByRole('heading', { name: 'Contribution opportunities', exact: true }),
    ).toBeVisible({
      timeout: 15_000,
    })
    await page.getByRole('button', { name: /Express interest/i }).first().click()
    await expect(page.getByText(/Interest recorded/i)).toBeVisible()
  })

  test('member can decline a contribution opportunity quietly', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(
      page.getByRole('heading', { name: 'Contribution opportunities', exact: true }),
    ).toBeVisible({
      timeout: 15_000,
    })
    await page.getByRole('button', { name: /Decline quietly/i }).nth(1).click()
    await expect(page.getByText(/Declined — no further action expected/i)).toBeVisible()
  })

  test('member portal feedback saves successfully', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(page.getByRole('heading', { name: /Share feedback/i })).toBeVisible({
      timeout: 15_000,
    })
    await page.locator('#network-feedback-message').fill('Portal navigation is clear.')
    await page.getByRole('button', { name: /Send feedback/i }).click()
    await expect(page.getByText(/feedback was saved for review/i)).toBeVisible()
  })

  test('consent update keeps private visibility when public profile is unchecked', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(page.getByRole('heading', { name: /Profile & consent/i })).toBeVisible({ timeout: 15_000 })
    await page.locator('#member-public-profile').uncheck()
    await page.getByRole('button', { name: /Save profile & consent/i }).click()
    await expect(page.getByText(/Your settings were saved/i)).toBeVisible()
    await expect(page.getByText(/Private — no public listing/i).first()).toBeVisible()
  })

  test('venture cards show cross-venture navigation with independence copy', async ({ page }) => {
    await page.goto('/dashboard/cognition-network')
    await expect(page.getByRole('heading', { name: /Your venture associations/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/does not carry over/i).first()).toBeVisible()
    await expect(page.getByText(/not employment, clinical endorsement/i).first()).toBeVisible()
  })
})

test.describe('Cognition Network cross-venture return link', () => {
  test('founding page shows return link when returnTo is a sibling venture', async ({ page }) => {
    await page.goto(
      '/network?returnTo=' + encodeURIComponent('https://cogtraining.org/cognition-network'),
    )
    await expect(page.getByRole('link', { name: /Return to Cogtraining/i })).toBeVisible()
  })
})

test.describe('Cognition Network admin intelligence', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('cogcare:e2eDashboardAuth', '1')
      sessionStorage.setItem('cogcare:e2eAdminAuth', '1')
    })
  })

  test('admin network tab shows intelligence metrics', async ({ page }) => {
    await page.goto('/dashboard/network')
    await page.getByRole('tab', { name: /Intelligence/i }).click()
    await expect(page.getByRole('heading', { name: /Network intelligence/i })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText(/First 10/i).first()).toBeVisible()
    await expect(page.getByText(/Invitation states/i)).toBeVisible()
    await expect(page.getByText(/Consent coverage/i)).toBeVisible()
  })
})
