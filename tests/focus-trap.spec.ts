import { test, expect } from '@playwright/test';

// 열린 모달에서 Tab이 배경으로 새면 참가자가 안 보이는 버튼을 누르게 된다.
test.describe('모달 포커스 가둠', () => {
  test('시트를 열면 초점이 패널 안으로 들어온다', async ({ page }) => {
    await page.goto('/ui');
    await page.getByRole('button', { name: '시트 열기' }).click();
    const panel = page.getByTestId('sheet-panel');
    await expect(panel).toBeVisible();
    // 초점이 패널 자신이거나 그 자손이어야 한다.
    await expect.poll(() => panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  });

  test('시트 안에서 Tab을 계속 눌러도 초점이 패널을 벗어나지 않는다', async ({ page }) => {
    await page.goto('/ui');
    await page.getByRole('button', { name: '시트 열기' }).click();
    const panel = page.getByTestId('sheet-panel');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
  });

  test('Shift+Tab도 패널을 벗어나지 않는다', async ({ page }) => {
    await page.goto('/ui');
    await page.getByRole('button', { name: '시트 열기' }).click();
    const panel = page.getByTestId('sheet-panel');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Shift+Tab');
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
  });

  test('닫으면 초점이 열었던 버튼으로 돌아온다', async ({ page }) => {
    await page.goto('/ui');
    const opener = page.getByRole('button', { name: '시트 열기' });
    await opener.click();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sheet-panel')).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test('다이얼로그도 같은 규칙을 지킨다', async ({ page }) => {
    await page.goto('/ui');
    const opener = page.getByRole('button', { name: '삭제 확인' });
    await opener.click();
    const panel = page.getByTestId('dialog-panel');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });
});
