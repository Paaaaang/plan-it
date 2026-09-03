import { test, expect } from '@playwright/test';

// 열린 모달에서 Tab이 배경으로 새면 참가자가 안 보이는 버튼을 누르게 된다.
test.describe('모달 포커스 가둠', () => {
  test('시트를 열면 초점이 패널 안으로 들어온다', async ({ page }) => {
    await page.goto('/ui');
    // SSR 마크업이 하이드레이션 전에 도달 가능하다 — 클라이언트 포커스 훅(useFocusTrap의
    // focusin 리스너)이 붙기 전에 상호작용하면 트리거 초점이 훅에 기록되지 않는다.
    // WebKit은 JS 파싱/하이드레이션이 느려 이 경합이 훨씬 잦게 드러난다.
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '시트 열기' }).click();
    const panel = page.getByTestId('sheet-panel');
    await expect(panel).toBeVisible();
    // 초점이 패널 자신이거나 그 자손이어야 한다.
    await expect.poll(() => panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  });

  test('시트 안에서 Tab을 계속 눌러도 초점이 패널을 벗어나지 않는다', async ({ page }) => {
    await page.goto('/ui');
    // SSR 마크업이 하이드레이션 전에 도달 가능하다 — 클라이언트 포커스 훅(useFocusTrap의
    // focusin 리스너)이 붙기 전에 상호작용하면 트리거 초점이 훅에 기록되지 않는다.
    // WebKit은 JS 파싱/하이드레이션이 느려 이 경합이 훨씬 잦게 드러난다.
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '시트 열기' }).click();
    const panel = page.getByTestId('sheet-panel');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
  });

  test('Shift+Tab도 패널을 벗어나지 않는다', async ({ page }) => {
    await page.goto('/ui');
    // SSR 마크업이 하이드레이션 전에 도달 가능하다 — 클라이언트 포커스 훅(useFocusTrap의
    // focusin 리스너)이 붙기 전에 상호작용하면 트리거 초점이 훅에 기록되지 않는다.
    // WebKit은 JS 파싱/하이드레이션이 느려 이 경합이 훨씬 잦게 드러난다.
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '시트 열기' }).click();
    const panel = page.getByTestId('sheet-panel');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Shift+Tab');
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
  });

  test('닫으면 초점이 열었던 버튼으로 돌아온다', async ({ page }) => {
    await page.goto('/ui');
    // SSR 마크업이 하이드레이션 전에 도달 가능하다 — 클라이언트 포커스 훅(useFocusTrap의
    // focusin 리스너)이 붙기 전에 상호작용하면 트리거 초점이 훅에 기록되지 않는다.
    // WebKit은 JS 파싱/하이드레이션이 느려 이 경합이 훨씬 잦게 드러난다.
    await page.waitForLoadState('networkidle');
    const opener = page.getByRole('button', { name: '시트 열기' });
    // WebKit은 클릭으로 버튼에 초점을 주지 않는다(실제 Safari 동작). 초점 복원은
    // 키보드 사용자를 위한 기능이므로 키보드로 열어 트리거에 초점이 실제로 있게 한다.
    await opener.focus();
    await opener.press('Enter');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sheet-panel')).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test('다이얼로그도 같은 규칙을 지킨다', async ({ page }) => {
    await page.goto('/ui');
    // SSR 마크업이 하이드레이션 전에 도달 가능하다 — 클라이언트 포커스 훅(useFocusTrap의
    // focusin 리스너)이 붙기 전에 상호작용하면 트리거 초점이 훅에 기록되지 않는다.
    // WebKit은 JS 파싱/하이드레이션이 느려 이 경합이 훨씬 잦게 드러난다.
    await page.waitForLoadState('networkidle');
    const opener = page.getByRole('button', { name: '삭제 확인' });
    await opener.focus();
    await opener.press('Enter');
    const panel = page.getByTestId('dialog-panel');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });

  // 회귀: 하이드레이션 전에 트리거에 초점이 있고 하이드레이션 후에 열면, 닫을 때 초점이 돌아와야 한다.
  // useFocusTrap의 focusin 리스너는 하이드레이션 후에야 붙으므로, 그 전에 생긴 초점을 놓치면
  // restoreRef가 비어 닫을 때 초점이 body로 떨어진다(실제 사용자 시나리오: 로딩 중 Tab → Enter).
  for (const [opener, panel] of [['sheet-open', 'sheet-panel'], ['dialog-open', 'dialog-panel']]) {
    test(`하이드레이션 전에 잡은 초점도 복원된다 — ${opener}`, async ({ page }) => {
      await page.route('**/*.js**', async (route) => {
        await new Promise((r) => setTimeout(r, 800));
        await route.continue();
      });
      await page.goto('/ui', { waitUntil: 'commit' });
      const trigger = page.locator(`[data-testid="${opener}"]`);
      await trigger.waitFor({ state: 'attached' });
      await trigger.evaluate((el: HTMLElement) => el.focus());
      await page.waitForLoadState('networkidle');
      await trigger.press('Enter');
      await expect(page.getByTestId(panel)).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId(panel)).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
});
