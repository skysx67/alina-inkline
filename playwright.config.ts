import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'chrome-1440', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'edge-1280', use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1280, height: 800 } } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
    { name: 'chromium-360', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    ...(process.env.INCLUDE_FIREFOX
      ? [{ name: 'firefox-1280', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } }]
      : []),
  ],
})
