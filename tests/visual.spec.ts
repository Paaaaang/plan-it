import { test, expect } from '@playwright/test';

/**
 * 갤러리 전체를 스냅샷으로 잠근다.
 * 토큰이나 프리미티브가 의도치 않게 바뀌면 여기서 걸린다.
 * 의도한 변경이면 `npx playwright test tests/visual.spec.ts --update-snapshots`.
 */
for (const scheme of ['light', 'dark'] as const) {
  test(`UI 갤러리 — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/ui');
    // 폰트가 자리잡을 때까지 기다린다 — 안 그러면 스냅샷이 흔들린다
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`gallery-${scheme}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
