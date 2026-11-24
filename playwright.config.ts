import { defineConfig, devices } from '@playwright/test';

const isCi = process.env['CI'] !== undefined;
const port = 4173;
const baseURL = `http://localhost:${String(port)}`;

export default defineConfig({
  testDir: './apps/web/e2e',
  // `.e2e.ts` instead of `.spec.ts` so Jest does not pick these files up.
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  ...(isCi && { workers: 1 }),
  reporter: isCi ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Serves the production build of the web app.
  webServer: {
    command: `npm run build --workspace=@lootopia/web && npm run preview --workspace=@lootopia/web -- --port ${String(port)} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
