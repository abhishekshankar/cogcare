import { defineConfig, devices } from '@playwright/test'

/** Dedicated port so tests do not race a developer's Vite on 5173. */
const e2ePort = Number(process.env.PLAYWRIGHT_PORT || '9323')
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${e2ePort}`
const e2eMocksEnv = [
  'COGCARE_E2E_MOCKS=1',
  'VITE_E2E_NETWORK_MOCKS=1',
  'VITE_USER_POOL_CLIENT_ID=e2e-client',
  'VITE_USER_POOL_ID=e2e-pool',
  `VITE_GRAPHQL_URL=${baseURL}/__e2e__/graphql`,
  'VITE_GRAPHQL_API_KEY=e2e-key',
  `VITE_ACCEPT_NETWORK_INVITATION_URL=${baseURL}/__e2e__/accept-network-invitation`,
  `VITE_NETWORK_PUBLIC_DATA_URL=${baseURL}/__e2e__/network-public-data`,
  `VITE_UPDATE_NETWORK_MEMBER_PROFILE_URL=${baseURL}/__e2e__/update-network-member-profile`,
].join(' ')

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
    command: `${e2eMocksEnv} npm run dev -- --port ${e2ePort} --strictPort --host 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
