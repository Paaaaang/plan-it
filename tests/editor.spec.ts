import { test, expect } from '@playwright/test';

/**
 * 편집기는 데스크톱 서페이스다(스펙 §5.2 — 1024px 미만은 1단으로 접히고 미리보기가
 * 하단 시트로 내려간다). iPhone 14 프로젝트에서 같은 단언을 두 번 돌릴 이유가 없고,
 * 두 프로젝트가 같은 dev 서버의 **같은 메모리 스토어**를 병렬로 때리면 아래 쓰기
 * 테스트가 서로를 오염시킨다.
 */
test.skip(({ isMobile }) => isMobile, '편집기는 데스크톱 서페이스다.');

/**
 * 테스트 격리 — 스토어는 프로세스 메모리다(lib/store/plans.ts). `resetStore()`는
 * 서버 프로세스 안에서만 부를 수 있어 E2E가 쓸 수 없다. 그래서 두 겹으로 막는다:
 *
 *  1. **쓰기는 전용 slug(`editor-demo`)에만** 한다. 뷰어 스펙이 쓰는 slug
 *     (jeju-workshop-2026 · team-offsite · long-day · secret-party · gone)를 건드리지 않는다.
 *     읽기만 하는 단언은 시안 값 그대로 jeju를 쓴다.
 *  2. 그 전용 slug를 여러 테스트가 나눠 쓰므로 **serial**로 돌린다. CI는 재시도까지 하므로
 *     각 쓰기 테스트는 끝나기 전에 바꾼 값을 되돌린다 — 재시도가 처음부터 다시 돌아도 된다.
 */
test.describe.configure({ mode: 'serial' });

const JEJU = '/dashboard/plans/jeju-workshop-2026/edit';
const DEMO = '/dashboard/plans/editor-demo/edit';

test.describe('편집기 상단 바', () => {
  test('제목·저장 상태·상태 세그먼트·공유 링크가 보인다', async ({ page }) => {
    await page.goto(JEJU);
    await expect(page.getByRole('link', { name: '대시보드' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '일정 제목' })).toHaveValue('제주 워크샵 2026');
    await expect(page.getByTestId('save-status')).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: '공개 상태' })).toBeVisible();
    await expect(page.getByText('/p/jeju-workshop-2026')).toBeVisible();
  });

  test('상태 세그먼트를 화살표 키로 옮길 수 있다', async ({ page }) => {
    await page.goto(DEMO);
    const group = page.getByRole('radiogroup', { name: '공개 상태' });
    await group.getByRole('radio', { name: '공개', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(group.getByRole('radio', { name: '비공개' })).toHaveAttribute('aria-checked', 'true');

    // 되돌린다 — 이 slug를 뒤 테스트가 이어 쓴다.
    await group.getByRole('radio', { name: '공개', exact: true }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
  });

  test('제목을 바꾸면 저장 상태가 바뀐다', async ({ page }) => {
    await page.goto(DEMO);
    const title = page.getByRole('textbox', { name: '일정 제목' });
    await title.fill('편집 데모 2027');
    await title.blur();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    // 되돌린다.
    await title.fill('편집 데모');
    await title.blur();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
  });

  test('빈 제목은 서버가 거부하고 이유를 보여준다', async ({ page }) => {
    // 거부되므로 스토어가 바뀌지 않는다 — jeju를 그대로 써도 안전하다.
    await page.goto(JEJU);
    const title = page.getByRole('textbox', { name: '일정 제목' });
    await title.fill('   ');
    await title.blur();
    await expect(page.getByText('제목을 입력해 주세요.')).toBeVisible();
  });
});

/**
 * 상태 세그먼트가 장식이 아니라는 판정.
 * `setStatus`가 스토어에 쓰고, 뷰어(`getBySlug`)가 그 상태를 읽어야 성립한다.
 */
test.describe('상태가 뷰어를 막는다', () => {
  test('임시저장으로 바꾸면 공개 링크가 닫히고, 공개로 되돌리면 다시 열린다', async ({ page }) => {
    await page.goto(DEMO);
    const group = page.getByRole('radiogroup', { name: '공개 상태' });

    await group.getByRole('radio', { name: '임시저장' }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
    expect((await page.goto('/p/editor-demo'))?.status(), '임시저장 = 기획자만 본다').toBe(404);

    await page.goto(DEMO);
    await group.getByRole('radio', { name: '공개', exact: true }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
    expect((await page.goto('/p/editor-demo'))?.status(), '공개로 되돌리면 다시 열린다').toBe(200);
  });
});
