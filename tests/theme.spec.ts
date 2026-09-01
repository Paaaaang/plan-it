import { test, expect } from '@playwright/test';

test.describe('테마 전환', () => {
  test('기본값은 시스템 — html에 data-theme이 없어요', async ({ page }) => {
    await page.goto('/ui');
    const attr = await page.locator('html').getAttribute('data-theme');
    expect(attr).toBeNull();
  });

  test('다크를 고르면 html에 data-theme="dark"가 붙어요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('선택이 새로고침 뒤에도 남아요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('시스템으로 되돌리면 속성이 사라져요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByTestId('theme-system').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
  });

  test('첫 페인트에 깜빡임이 없어요 — 서버가 속성을 심어요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    // 새 요청의 HTML 응답 본문에 이미 속성이 들어 있어야 한다 (클라이언트 스크립트가 아니라)
    const res = await page.request.get('/ui');
    const html = await res.text();
    expect(html).toContain('data-theme="dark"');
  });

  test('조작된 쿠키 값은 시스템으로 떨어져요', async ({ page, context, baseURL }) => {
    await context.addCookies([
      { name: 'planit-theme', value: '<script>', url: baseURL! },
    ]);
    await page.goto('/ui');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
  });
});
