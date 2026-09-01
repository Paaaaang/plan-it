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

test.describe('TextField', () => {
  test('라벨이 입력과 연결돼요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByLabel('일정 제목').fill('제주 워크샵');
    await expect(page.getByLabel('일정 제목')).toHaveValue('제주 워크샵');
  });

  test('오류가 있으면 문구와 aria-invalid가 함께 나와요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByTestId('field-error').getByRole('textbox');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('field-error')).toContainText('제목을 입력해 주세요');
  });

  test('오류 메시지가 aria-describedby로 연결돼요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByTestId('field-error').getByRole('textbox');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('제목을 입력해 주세요');
  });

  test('다크에서 입력 표면이 카드보다 어두워요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    const bg = await page.getByLabel('일정 제목')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(19, 23, 32)'); // #131720
  });

  test('multiline은 textarea로 렌더돼요', async ({ page }) => {
    await page.goto('/ui');
    const el = page.getByLabel('메모');
    expect(await el.evaluate((n) => n.tagName)).toBe('TEXTAREA');
  });

  test('오류가 없으면 힌트가 보이고 aria-invalid는 안 붙어요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByLabel('메모');
    await expect(input).not.toHaveAttribute('aria-invalid', /.*/);
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('참가자에게 보여요');
  });

  test('입력 포커스가 눈에 보여요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByLabel('일정 제목');
    await input.focus();
    const ring = await input.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(ring).not.toBe('none');
  });
});

test.describe('DateField', () => {
  test('네이티브 날짜 입력을 써요', async ({ page }) => {
    await page.goto('/ui');
    const el = page.getByLabel('시작일');
    expect(await el.getAttribute('type')).toBe('date');
  });

  test('값이 YYYY-MM-DD로 들어가요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByLabel('시작일').fill('2026-10-24');
    await expect(page.getByLabel('시작일')).toHaveValue('2026-10-24');
  });
});
