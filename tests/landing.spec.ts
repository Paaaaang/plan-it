import { test, expect } from '@playwright/test';

test.describe('랜딩 — 비로그인', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('헤더: 로그인은 /login, 내비는 세 섹션으로', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
    // 내비는 960px 이상에서만 보인다 — 모바일에서도 DOM의 연결은 확인한다
    for (const href of ['#try', '#tour', '#cases']) {
      await expect(page.locator(`nav[aria-label="주요 메뉴"] a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('라이트 테마에서도 우주색 다크로 그려진다 — 오버스크롤 바탕까지', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const bg = await page.getByTestId('landing').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(1, 8, 40)'); // --landing-space #010828
    const html = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
    expect(html).toBe('rgb(1, 8, 40)');
  });

  test('마지막 CTA는 로그인으로 간다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 2, name: /다음 모임/ })).toBeAttached();
    await expect(page.getByRole('link', { name: '내 모임 만들기' }).last()).toHaveAttribute('href', '/login');
  });

  test('CTA 글자는 어두운 색이다 — 크림 글자는 코랄 위에서 대비 미달', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: '내 모임 만들기' }).last();
    const { color, ink } = await cta.evaluate((el) => {
      // 토큰은 하드코딩하지 않고 페이지에서 풀어 본다 — 값이 바뀌어도 같은 약속을 잰다
      const probe = document.createElement('i');
      probe.style.color = 'var(--ink-on-coral)';
      document.body.append(probe);
      const ink = getComputedStyle(probe).color;
      probe.remove();
      return { color: getComputedStyle(el).color, ink };
    });
    expect(color).toBe(ink);
  });

  test('가로 스크롤이 생기지 않는다', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('배경 영상이 막혀도 그려지고 에러가 없다', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.route('**/*.mp4', (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('video')).toHaveCount(0, { timeout: 10_000 }); // 오류 난 영상은 치운다
    await expect(page.getByRole('heading', { level: 2, name: /다음 모임/ })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('지어낸 지표가 없다 — 조회수 문구 금지', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('landing')).not.toContainText('조회');
  });
});
