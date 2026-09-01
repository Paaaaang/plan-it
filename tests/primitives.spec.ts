import { test, expect } from '@playwright/test';

test.describe('Button', () => {
  test('primary는 브랜드 색으로 칠해져요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    const bg = await page.getByTestId('btn-primary')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(255, 107, 74)'); // #FF6B4A
  });

  test('다크에서 primary 글자는 흰색이 아니라 어두운 잉크예요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    const color = await page.getByTestId('btn-primary')
      .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(26, 14, 9)'); // #1A0E09
  });

  test('loading이면 눌리지 않고 상태를 알려줘요', async ({ page }) => {
    await page.goto('/ui');
    const btn = page.getByTestId('btn-loading');
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  test('disabled 버튼은 클릭 핸들러가 돌지 않아요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('btn-disabled').click({ force: true });
    await expect(page.getByTestId('click-count')).toHaveText('0');
  });

  test('활성 버튼은 클릭이 세져요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('btn-counter').click();
    await page.getByTestId('btn-counter').click();
    await expect(page.getByTestId('click-count')).toHaveText('2');
  });

  test('키보드 포커스가 눈에 보여요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('btn-counter').focus();
    const outline = await page.getByTestId('btn-counter')
      .evaluate((el) => getComputedStyle(el).outlineWidth);
    expect(outline).not.toBe('0px');
  });
});
