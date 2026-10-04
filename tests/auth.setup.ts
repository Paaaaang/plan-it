import { test as setup, expect } from '@playwright/test';

/**
 * 시드 소유자로 로그인해 세션을 저장한다. 262개 대부분이 이걸 재사용하므로
 * 로그인 왕복이 실행당 한 번이다.
 *
 * DB 상태는 여기서 건드리지 않는다 — 그건 각 테스트의 beforeEach(reseed) 몫이다.
 * 세션과 데이터를 한 자리에서 다루면 "처음 상태"가 두 개가 된다(1단계에서 배운 것).
 */
const OWNER_STATE = 'tests/.auth/owner.json';

setup('시드 소유자 세션을 저장한다', async ({ page }) => {
  const res = await page.request.post('/api/test/session/owner');
  expect(res.status(), '세션 발급').toBe(204);

  // 쿠키가 실제로 심겼는지 본다 — 204만 보고 넘어가면 빈 storageState를 저장한다.
  const cookies = await page.context().cookies();
  expect(cookies.some((c) => c.name.startsWith('sb-')), 'Supabase 세션 쿠키').toBe(true);

  await page.context().storageState({ path: OWNER_STATE });
});
