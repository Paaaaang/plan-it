import { test as setup, expect } from '@playwright/test';
import { SEED_OWNER_ID } from '../src/server/store/seed-sql';
import { accessTokenFromCookies, subFromAccessToken } from './support/sb-cookie';

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

/**
 * @supabase/ssr가 심는 `sb-*` 쿠키에서 액세스 토큰의 sub만 꺼낸다. 디코딩 자체는
 * `support/sb-cookie.ts`로 뺐다 — 우리가 보는 건 가운데 payload뿐이고, 꺼내는 것도
 * 사용자 id 하나뿐이다(토큰을 통째로 들고 있지 않는다).
 */
function sessionUserId(cookies: { name: string; value: string }[]): string | undefined {
  const token = accessTokenFromCookies(cookies);
  return token ? subFromAccessToken(token) : undefined;
}

/**
 * 두 번째 정체성(other)이 실제로 쓸 수 있는지를 매번 확인한다. owner와 달리 아직
 * storageState를 만들지 않는다 — 소비하는 테스트가 없는데 파일만 만들면 "이걸 누가
 * 쓰나"가 남는다. 소유권 격리를 시험하는 테스트가 생기면 그때 OTHER_STATE를 더한다.
 *
 * 이 테스트가 지키는 버그: other는 호출마다 createUser를 다시 시도하는데, 두 번째
 * 호출부터는 email_exists로 실패한다. 그 에러를 삼키면 204는 그대로 나와서 "우연히"
 * 통과한 것처럼 보이지만 세션이 비어 있을 수 있다 — 204 하나만 보는 테스트는 이 차이를
 * 못 잡는다. 그래서 매 호출마다 쿠키의 sub을 까서 owner와 다른 실제 사용자인지,
 * 두 번째 호출도 같은 사용자로 로그인되는지까지 본다.
 */
setup('두 번째 정체성(other)이 owner와 구분되는 세션을 발급한다', async ({ page }) => {
  const res1 = await page.request.post('/api/test/session/other');
  expect(res1.status(), 'other 세션 발급(1차)').toBe(204);

  const otherId = sessionUserId(await page.context().cookies());
  expect(otherId, 'other 세션의 사용자 id').toBeTruthy();
  expect(otherId, 'owner와 다른 사용자여야 한다').not.toBe(SEED_OWNER_ID);

  // 재호출 — createUser가 email_exists로 떨어지는, 이번에 고친 경로.
  await page.context().clearCookies();
  const res2 = await page.request.post('/api/test/session/other');
  expect(res2.status(), 'other 세션 발급(2차)').toBe(204);

  const otherId2 = sessionUserId(await page.context().cookies());
  expect(otherId2, '2차 호출도 같은 사용자의 진짜 세션이어야 한다').toBe(otherId);
});
