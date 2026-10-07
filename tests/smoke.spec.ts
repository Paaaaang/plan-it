import { test, expect } from '@playwright/test';

// 라우트가 살아있는지만 본다. 화면 내용 검증은 해당 화면 스펙 테스트에서.
function assertNoConsoleErrors(path: string) {
  test(`${path} 렌더 + 콘솔 에러 없음`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));

    const res = await page.goto(path);
    expect(res?.status(), `${path} 응답 코드`).toBeLessThan(400);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    expect(errors, `${path} 콘솔 에러`).toEqual([]);
  });
}

assertNoConsoleErrors('/');

// /login은 desktop/mobile 프로젝트의 owner storageState로 그냥 열면 proxy가 `hasSession &&
// pathname === '/login'`에 걸려 /dashboard로 튕긴다 — 그러면 이 테스트는 /login이 아니라
// /dashboard의 콘솔 에러를 보면서 "/login 렌더 + 콘솔 에러 없음"이라는 이름으로 통과한다.
// 이 브랜치가 새로 쓴 유일한 화면이 그렇게 커버리지 0으로 남는다. storageState를 비워
// 실제로 로그아웃 상태에서 열어야 한다.
test.describe('비로그인', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  assertNoConsoleErrors('/login');
});
