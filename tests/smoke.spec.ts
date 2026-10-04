import { test, expect } from '@playwright/test';

// 라우트가 살아있는지만 본다. 화면 내용 검증은 해당 화면 스펙 테스트에서.
const PUBLIC_ROUTES = ['/', '/login'];

for (const path of PUBLIC_ROUTES) {
  test(`${path} 렌더 + 콘솔 에러 없음`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));

    const res = await page.goto(path);
    expect(res?.status(), `${path} 응답 코드`).toBeLessThan(400);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    expect(errors, `${path} 콘솔 에러`).toEqual([]);
  });
}
