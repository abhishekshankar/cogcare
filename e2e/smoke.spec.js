import { test, expect } from '@playwright/test'

test.describe('BHI + auth smoke', () => {
  test('home loads and BHI assessment opens with first question', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Dementia is/i })).toBeVisible()

    await page.getByRole('button', { name: 'Begin Assessment' }).click()
    await expect(page.getByText('Brain Health Index').first()).toBeVisible()
    await expect(page.getByText('Question').first()).toBeVisible()
    await expect(
      page.getByText('Does the person have difficulty staying focused on a task for more than 15 minutes?'),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Not at all' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(
      page.getByText('Does the person feel mentally exhausted or'),
    ).toBeVisible()
  })

  test('login page shows sign-in UI or sandbox setup message', async ({ page }) => {
    await page.goto('/login')
    const signInHeading = page.getByRole('heading', { name: 'Sign in' })
    const notConfigured = page.getByText('Authentication is not configured in this build')
    await expect(signInHeading.or(notConfigured)).toBeVisible()
  })

  test('dashboard redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('optional Cognito sign-in', () => {
  test('signs in and reaches dashboard when E2E_EMAIL and E2E_PASSWORD are set', async ({
    page,
  }) => {
    const email = process.env.E2E_EMAIL
    const password = process.env.E2E_PASSWORD
    test.skip(!email || !password, 'Set E2E_EMAIL and E2E_PASSWORD for full auth smoke')

    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 45_000 })
    await expect(
      page.getByText('Brain credit').first().or(page.getByRole('heading', { name: 'Create your password' })),
    ).toBeVisible({ timeout: 20_000 })
  })
})
