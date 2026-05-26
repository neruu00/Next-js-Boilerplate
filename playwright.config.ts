/**
 * Playwright E2E 테스트 설정
 *
 * 브라우저에서 실제 사용자 행동을 시뮬레이션하는 E2E 테스트 설정입니다.
 * 테스트 파일은 `e2e/` 디렉토리에 작성하세요.
 *
 * 브라우저 설치 (최초 1회):
 * ```bash
 * pnpm exec playwright install
 * ```
 *
 * @see https://playwright.dev/docs/test-configuration
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,

  /** CI 환경에서만 실패 시 종료 */
  forbidOnly: !!process.env.CI,

  /** CI에서는 재시도 2회 */
  retries: process.env.CI ? 2 : 0,

  /** CI에서는 단일 워커 (로컬은 자동) */
  workers: process.env.CI ? 1 : undefined,

  /** HTML 리포트 생성 */
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',

    /** 실패 시 트레이스 수집 */
    trace: 'on-first-retry',

    /** 스크린샷 — 실패 시만 */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /** 모바일 테스트 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /** E2E 실행 전 개발 서버 자동 시작 */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
