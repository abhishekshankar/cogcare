import { defineConfig, devices } from '@playwright/test'

/** Dedicated port so tests do not race a developer's Vite on 5173. */
const e2ePort = Number(process.env.PLAYWRIGHT_PORT || '9323')
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${e2ePort}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev -- --port ${e2ePort} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
