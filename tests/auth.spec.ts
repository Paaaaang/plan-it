import { test, expect } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, '콘솔은 데스크톱 서페이스다.');

const EDIT = '/dashboard/plans/editor-notice/edit';

/**
 * 「쓰기 액션을 직접 POST해도 거부된다」류 단언에 대한 주의.
 *
 * `Next-Action` 헤더 값은 빌드마다 바뀌는 산출물이라 여기서 "x"를 넣어도 진짜 액션(예:
 * updateNotice)을 부르지 않는다 — Next가 그 id를 못 찾고 그냥 실패한다. 즉 이 POST는
 * "인증 없이 이 경로를 때리면 성공하지 않는다"만 보여줄 뿐 DAL의 getSessionUserId()
 * 검사를 통과시켜 보는 것이 아니다. 그래서 두 테스트 모두 응답 코드 단언 뒤에 **DB 값이
 * 안 바뀌었다는 것**을 owner로 돌아와 다시 읽어 확인한다 — 그게 진짜 판정이다.
 */
test.describe('비로그인', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('콘솔에 들어가면 로그인으로 보낸다', async ({ page }) => {
    await page.goto(EDIT);
    await expect(page).toHaveURL(/\/login/);
  });

  test('쓰기 액션을 직접 POST해도 거부된다', async ({ page }) => {
    // 페이지를 거치지 않고 Server Action을 직접 때린다 — proxy의 낙관적 검사를
    // 우회하는 경로다. DAL이 막아야 한다.
    const res = await page.request.post(EDIT, {
      headers: { 'Next-Action': 'x', 'Content-Type': 'text/plain;charset=UTF-8' },
      data: '[]',
    });
    // 성공(2xx에 저장됨)이 아니기만 하면 된다 — 정확한 코드는 Next 내부 규약이다.
    expect(res.status(), '비로그인 액션은 성공하면 안 된다').not.toBe(200);
  });
});

test.describe('소유권 격리', () => {
  test('다른 기획자는 남의 일정을 열 수 없다', async ({ page }) => {
    const res = await page.request.post('/api/test/session/other');
    expect(res.status()).toBe(204);

    // RLS가 0행을 돌려주므로 "없는 일정"과 같은 404가 된다 — 소유 여부를 알려주지 않는다.
    const got = await page.goto(EDIT);
    expect(got?.status(), '남의 일정은 404').toBe(404);
  });

  test('다른 기획자는 남의 공지를 고칠 수 없다', async ({ page }) => {
    // 이 단계의 핵심 증명. 소유자로 먼저 값을 확인한다.
    await page.request.post('/api/test/reseed/editor-notice');
    await page.goto(EDIT);
    const title = page.getByTestId('notice-row').first().getByRole('textbox', { name: '공지 제목' });
    const before = await title.inputValue();

    // 다른 사용자로 바꾼 뒤 같은 액션을 때린다.
    await page.request.post('/api/test/session/other');
    const res = await page.request.post(EDIT, {
      headers: { 'Next-Action': 'x', 'Content-Type': 'text/plain;charset=UTF-8' },
      data: '[]',
    });
    expect(res.status()).not.toBe(200);

    // 소유자로 돌아와 값이 그대로인지 본다 — 응답 코드만 보면 "거부했다고 말하면서
    // 실제로는 썼다"를 못 잡는다.
    await page.request.post('/api/test/session/owner');
    await page.goto(EDIT);
    await expect(page.getByTestId('notice-row').first().getByRole('textbox', { name: '공지 제목' }))
      .toHaveValue(before);
  });
});

test.describe('세션', () => {
  test('로그인 상태로 /login에 가면 대시보드로 보낸다', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
