import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  /* Retries absorb flake against a shared public site; locally tests fail fast. */
  retries: process.env.CI ? 2 : 0,

  reporter: [['html', { open: 'never' }], ['list']],

  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'https://automationexercise.com',

    /* Diagnostics kept only for failures, so the report stays small. */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',

    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
