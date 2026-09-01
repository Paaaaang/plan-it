import { test, expect } from '@playwright/test';

/**
 * 갤러리 전체를 스냅샷으로 잠근다.
 * 토큰이나 프리미티브가 의도치 않게 바뀌면 여기서 걸린다.
 * 의도한 변경이면 `npx playwright test tests/visual.spec.ts --update-snapshots`.
 */
test.skip(
  !!process.env.CI,
  '시각 회귀는 로컬 전용이에요. 플랫폼마다 폰트 렌더링이 달라 CI에서는 기준 이미지가 맞지 않아요.',
);

for (const scheme of ['light', 'dark'] as const) {
  test(`UI 갤러리 — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/ui');
    // 폰트가 자리잡을 때까지 기다린다 — 안 그러면 스냅샷이 흔들린다
    await page.evaluate(() => document.fonts.ready);
    // Next dev 오버레이는 제품 화면이 아니다. 기준 이미지에서 뺀다.
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important }' });
    await expect(page).toHaveScreenshot(`gallery-${scheme}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
