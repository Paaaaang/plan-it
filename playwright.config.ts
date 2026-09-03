import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // 뷰어 레일은 "오늘"을 KST로 정의한다(lib/fixtures/viewer.ts의 dayOffset과 짝).
    // CI 러너는 UTC라 못박지 않으면 자정 부근에서 날짜가 어긋나 레일 테스트가 흔들린다.
    timezoneId: 'Asia/Seoul',
  },

  // planner/admin = 데스크톱, viewer = 모바일. 두 뷰포트만 본다.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
