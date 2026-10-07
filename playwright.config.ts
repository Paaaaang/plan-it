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
    // 뷰어 레일은 "오늘"을 KST로 정의한다(src/shared/fixtures/viewer.ts의 dayOffset과 짝).
    // CI 러너는 UTC라 못박지 않으면 자정 부근에서 날짜가 어긋나 레일 테스트가 흔들린다.
    timezoneId: 'Asia/Seoul',
    // 네이티브 위젯(<input type="date">)의 표기는 문서 lang이 아니라 **브라우저 로캘**을
    // 따른다. 기본값(en-US)으로 두면 스냅샷이 `01/01/2026`으로 굳어, 실제 사용자가 보는
    // `2026. 01. 01.`과 다른 화면을 기준 이미지로 지키게 된다. 한국 서비스라 여기 맞춘다.
    locale: 'ko-KR',
    // 로캘만으로는 부족하다: Chromium의 날짜 위젯은 컨텍스트 로캘이 아니라 **브라우저 UI
    // 언어**를 따른다(브라우저 프로세스 시작 시 정해진다). 그래서 실행 인자로도 넘긴다.
    launchOptions: { args: ['--lang=ko-KR'] },
  },

  // planner/admin = 데스크톱, viewer = 모바일. 두 뷰포트만 본다.
  // setup이 시드 소유자 세션을 한 번 저장하고(auth.setup.ts), desktop/mobile은 그걸
  // 재사용한다 — 262개 대부분이 매번 로그인 왕복을 타면 그 자체가 또 다른 전역 상태다.
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/owner.json' },
      dependencies: ['setup'],
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'], storageState: 'tests/.auth/owner.json' },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
