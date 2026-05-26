/**
 * Playwright E2E 테스트 예시
 *
 * 최초 1회 브라우저 설치 필요:
 * pnpm exec playwright install
 *
 * 실행:
 * pnpm test:e2e
 * pnpm test:e2e:ui  (인터랙티브 UI 모드)
 */

import { expect, test } from '@playwright/test';

test.describe('홈 페이지', () => {
  test('페이지가 정상적으로 로드됩니다', async ({ page }) => {
    await page.goto('/');

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/Next\.js/);
  });

  test('메인 컨텐츠가 표시됩니다', async ({ page }) => {
    await page.goto('/');

    // Next.js 로고 이미지 확인
    const logo = page.getByAltText('Next.js logo');
    await expect(logo).toBeVisible();
  });

  test('외부 링크가 올바릅니다', async ({ page }) => {
    await page.goto('/');

    const docsLink = page.getByRole('link', { name: /docs/i }).first();
    await expect(docsLink).toHaveAttribute('href', /nextjs\.org/);
  });
});

test.describe('접근성', () => {
  test('키보드 네비게이션이 작동합니다', async ({ page }) => {
    await page.goto('/');

    // Tab 키로 첫 번째 링크로 이동
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
