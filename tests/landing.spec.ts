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

  test('nav 앵커가 섹션으로 간다', async ({ page }) => {
    await page.goto('/');
    for (const id of ['how', 'cases']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.getByRole('heading', { level: 2, name: '세 단계면 끝나요.' })).toBeAttached();
    await expect(page.getByRole('heading', { level: 2, name: '이런 모임에 써요.' })).toBeAttached();
  });

  test('하단 CTA도 로그인으로 간다', async ({ page }) => {
    await page.goto('/');
    const ctas = page.getByRole('link', { name: '내 모임 만들기' });
    await expect(ctas).toHaveCount(2);
    await expect(ctas.last()).toHaveAttribute('href', '/login');
  });

  test('코랄은 3곳 이하다 (명세 §2-4)', async ({ page }) => {
    await page.goto('/');
    const n = await page.getByTestId('landing').evaluate((root) =>
      [root, ...root.querySelectorAll('*')].filter((el) => {
        const s = getComputedStyle(el);
        return [s.backgroundColor, s.backgroundImage, s.color, s.borderColor].some((v) => v.includes('255, 107, 74'));
      }).length,
    );
    expect(n).toBeLessThanOrEqual(3);
  });

  test('가로 스크롤이 생기지 않는다', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('지어낸 지표가 없다 — 조회수 문구 금지', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('landing')).not.toContainText('조회');
  });

  test('카드는 아이콘과 제목뿐이다 — 제목을 풀어 쓰는 본문 금지 (명세 §7-1)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#value li p')).toHaveCount(0);
    await expect(page.locator('#how li > p:not([data-mini])')).toHaveCount(0);
  });
});

test('로그인 상태에서 히어로 CTA를 누르면 대시보드로 간다 (F-LAND-6)', async ({ page }) => {
  // 프로젝트 기본 storageState가 owner 세션이다. proxy.ts가 /login → /dashboard로 보낸다.
  await page.goto('/');
  await page.getByRole('link', { name: '내 모임 만들기' }).first().click();
  await expect(page).toHaveURL(/\/dashboard/);
});
