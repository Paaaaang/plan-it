import { test, expect, type Page } from '@playwright/test';

/** 프로브 요소의 계산된 CSS 변수 값을 읽는다. */
async function tokens(page: Page, names: string[]) {
  return page.evaluate((ns) => {
    const cs = getComputedStyle(document.documentElement);
    return Object.fromEntries(ns.map((n) => [n, cs.getPropertyValue(n).trim()]));
  }, names);
}

test.describe('디자인 토큰', () => {
  test('라이트 팔레트가 bare :root에 정의되어 있어요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    const t = await tokens(page, [
      '--coral-500', '--neutral-100', '--bg', '--surface',
      '--surface-sunken', '--text-primary', '--fill-brand', '--danger',
    ]);
    // Tailwind v4(Lightning CSS)가 색을 표준형으로 직렬화한다:
    // 헥스는 소문자로, #FFFFFF처럼 축약 가능한 값은 3자리(#fff)로 줄인다.
    // 값 자체는 브리프와 동일 — 대소문자/자릿수 표기만 다르다.
    expect(t['--coral-500']).toBe('#ff6b4a');
    expect(t['--neutral-100']).toBe('#f2f4f8');
    expect(t['--bg']).toBe('#f2f4f8');
    expect(t['--surface']).toBe('#fff');
    expect(t['--text-primary']).toBe('#161a23');
    expect(t['--fill-brand']).toBe('#ff6b4a');
    expect(t['--danger']).toBe('#d92d4e');
  });

  test('시스템 다크에서 팔레트가 뒤바뀌어요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    const t = await tokens(page, ['--bg', '--surface', '--surface-sunken', '--fill-brand', '--text-on-accent']);
    expect(t['--bg']).toBe('#101219');
    expect(t['--surface']).toBe('#1b1f29');
    expect(t['--fill-brand']).toBe('#ff8163');
    expect(t['--text-on-accent']).toBe('#1a0e09');
  });

  test('다크에서 입력 표면이 카드 표면보다 어두워요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    const t = await tokens(page, ['--surface', '--surface-sunken']);
    // #1B1F29(27,31,41) vs #131720(19,23,32) — sunken이 더 어두워야 한다
    // Lightning CSS가 #fff처럼 3자리로 축약할 수 있어 6자리로 편 뒤 파싱한다.
    const lum = (hex: string) => {
      const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1);
      return parseInt(h.slice(0, 2), 16) + parseInt(h.slice(2, 4), 16) + parseInt(h.slice(4, 6), 16);
    };
    expect(lum(t['--surface-sunken'])).toBeLessThan(lum(t['--surface']));
  });

  test('라이트에서는 입력 표면이 카드 표면보다 밝지 않아요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    const t = await tokens(page, ['--surface', '--surface-sunken']);
    const lum = (hex: string) => {
      const h = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1);
      return parseInt(h.slice(0, 2), 16) + parseInt(h.slice(2, 4), 16) + parseInt(h.slice(4, 6), 16);
    };
    expect(lum(t['--surface-sunken'])).toBeLessThan(lum(t['--surface']));
  });

  test('data-theme="light"가 시스템 다크를 이겨요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const t = await tokens(page, ['--bg']);
    expect(t['--bg']).toBe('#f2f4f8');
  });

  test('data-theme="dark"가 시스템 라이트를 이겨요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const t = await tokens(page, ['--bg']);
    expect(t['--bg']).toBe('#101219');
  });

  test('body가 토큰 배경을 명시적으로 칠해요', async ({ page }) => {
    await page.goto('/ui');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });
});
