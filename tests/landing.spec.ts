import { test, expect } from '@playwright/test';

test.describe('랜딩 — 비로그인', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('히어로 헤드라인과 CTA가 로그인으로 간다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('10분이면 네 것도.');
    const cta = page.getByRole('link', { name: '내 모임 만들기' }).first();
    await expect(cta).toHaveAttribute('href', '/login');
  });

  test('라이트 테마에서도 다크로 그려진다', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const bg = await page.getByTestId('landing').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(6, 11, 31)'); // --landing-void #060B1F
  });

  test('공개 일정이 LIVE_MIN(30) 미만이면 라이브 eyebrow를 그리지 않는다', async ({ page }) => {
    // seed의 공개 일정은 10개 안팎이다. 지어낸 숫자도, 대체 문구도 띄우지 않는다(명세 §9-5·§7-1).
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByTestId('hero-eyebrow')).toHaveCount(0);
  });

  test('CTA 글자는 어두운 색이다 — 흰 글자는 AA 대비 미달', async ({ page }) => {
    await page.goto('/');
    const color = await page.getByRole('link', { name: '내 모임 만들기' }).first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(6, 11, 31)');
  });

  test('모션 줄이기면 오로라가 멈춘다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const name = await page.getByTestId('aurora').evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe('none');
  });
});

test('로그인 상태에서 히어로 CTA를 누르면 대시보드로 간다 (F-LAND-6)', async ({ page }) => {
  // 프로젝트 기본 storageState가 owner 세션이다. proxy.ts가 /login → /dashboard로 보낸다.
  await page.goto('/');
  await page.getByRole('link', { name: '내 모임 만들기' }).first().click();
  await expect(page).toHaveURL(/\/dashboard/);
});
