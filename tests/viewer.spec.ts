import { test, expect } from '@playwright/test';

test.describe('공개 뷰어', () => {
  test('커버·공지·탭·타임라인이 보인다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await expect(page.getByRole('heading', { name: '제주 워크샵 2026', level: 1 })).toBeVisible();
    await expect(page.getByTestId('cover')).toHaveAttribute('data-cover', 'photo');
    await expect(page.getByTestId('notice-bar')).toBeVisible();
    await expect(page.getByRole('tab', { name: '타임테이블' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('timeline-row')).toHaveCount(4);
  });

  test('공지 바는 접힘이 기본이고 탭하면 목록으로 펼쳐진다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const bar = page.getByTestId('notice-bar');
    await expect(bar).toHaveAttribute('data-open', 'false');
    // 요약은 각 공지의 첫 구절을 · 로 이은 것이다
    await expect(bar).toContainText('집결 시간을 꼭 지켜주세요 · 준비물 · 회비');
    await bar.getByRole('button').click();
    await expect(bar).toHaveAttribute('data-open', 'true');
    await expect(bar.getByRole('heading', { name: '준비물' })).toBeVisible();
  });

  test('공지 바 버튼의 접근성 이름은 펼쳐도 바뀌지 않는다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const button = page.getByTestId('notice-bar').getByRole('button', { name: '공지 3개' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    // 이름이 그대로여야 같은 버튼을 다시 잡을 수 있다
    await expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('일차 칩으로 날짜를 바꾸면 타임라인이 바뀐다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await expect(page.getByTestId('timeline-row')).toHaveCount(4);
    await page.getByRole('button', { name: '2일차', exact: true }).click();
    await expect(page.getByTestId('timeline-row')).toHaveCount(3);
  });

  test('하루짜리 일정에는 일차 칩이 없다', async ({ page }) => {
    await page.goto('/p/team-offsite');
    await expect(page.getByTestId('day-chips')).toHaveCount(0);
    await expect(page.getByTestId('cover')).toHaveAttribute('data-cover', 'fallback');
  });

  test('장소 탭으로 넘어가면 레일이 사라진다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await page.getByRole('tab', { name: '장소' }).click();
    await expect(page.getByTestId('progress-rail')).toHaveCount(0);
    await expect(page.getByText('제주국제공항').first()).toBeVisible();
  });

  test('레일은 오늘 날짜에서만 진행 상태를 그린다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const rail = page.getByTestId('progress-rail');
    // 1일차는 오늘이다 — 코랄이 섞인 그라데이션.
    // useNow가 마운트 후에야 시각을 주므로(첫 페인트는 null = 회색) poll로 기다린다.
    // timeout은 dev 서버 콜드 컴파일까지 감안한 값이다 — 기본 5초는 첫 실행에서 모자란다.
    await expect
      .poll(() => rail.evaluate((el) => getComputedStyle(el).backgroundImage), { timeout: 15_000 })
      .toContain('gradient');
    // 3일차는 미래다 — 진행 없음
    await page.getByRole('button', { name: '3일차', exact: true }).click();
    const future = await page.getByTestId('progress-rail').evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(future).not.toContain('gradient');
  });

  test('없는 slug는 404다', async ({ page }) => {
    const res = await page.goto('/p/nope-not-here');
    expect(res?.status()).toBe(404);
  });

  test('하단 CTA가 마지막 항목을 가리지 않는다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const cta = page.getByTestId('viewer-cta');
    await expect(cta).toBeVisible();
    await page.getByTestId('timeline-row').last().scrollIntoViewIfNeeded();
    const row = await page.getByTestId('timeline-row').last().boundingBox();
    const bar = await cta.boundingBox();
    expect(row!.y + row!.height).toBeLessThanOrEqual(bar!.y + 1);
  });
});
