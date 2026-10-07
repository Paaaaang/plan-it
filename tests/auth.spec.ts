import { test, expect } from '@playwright/test';
import type { Page, APIRequestContext } from '@playwright/test';
import { accessTokenFromCookies } from './support/sb-cookie';

test.skip(({ isMobile }) => isMobile, '콘솔은 데스크톱 서페이스다.');

const EDIT = '/dashboard/plans/editor-notice/edit';
/** DAL 체크(`verifySession()`)가 없는 정적 placeholder 페이지 — proxy 리다이렉트 단독의
 *  효과를 EDIT와 분리해서 보려고 쓴다(아래 "DAL 체크가 없는" 테스트 참고). */
const DASHBOARD = '/dashboard';

/**
 * fix-round 1 메모 — 왜 `Next-Action` 헤더로 직접 POST하던 이전 버전을 걷어냈나.
 *
 * 이전 버전은 "쓰기 액션을 직접 POST해도 거부된다"를 `Next-Action: x` 헤더로 EDIT에
 * POST해서 봤다. 사보타주 3건으로 직접 확인한 결과: 이 POST는 proxy의 쿠키 유무
 * 리다이렉트에 먼저 걸리거나(비로그인), Next가 그 action id를 못 찾아 애초에
 * `notice-actions.ts`의 코드를 **한 줄도 실행하지 않는다**(로그인 상태). 즉 그 테스트는
 * DAL도 RLS도 운동시키지 않으면서 "소유권 격리를 증명했다"는 이름을 달고 있었다 —
 * 증명 안 된 걸 증명됐다고 보이는 게 증명이 없는 것보다 나쁘다.
 *
 * 그래서 쓰기 격리는 **RLS가 실제로 사는 자리**에서 본다: Next 서버를 완전히 비켜
 * PostgREST(Kong 경유, 로컬 54321)를 직접 때린다. 로그인은 여전히 진짜로 한다(`/api/test
 * /session/*`가 발급하는 실제 Supabase 세션) — 그 세션의 JWT를 그대로 Authorization
 * 헤더에 실어서 보낸다. 이러면 빌드 산출물(action id)에 의존하지 않고, RLS 정책이
 * 걸러내는지를 정확히 그 정책이 걸리는 경로로 확인할 수 있다.
 *
 * 이 접근이 증명하는 것: `plans_owner_update`·`notices_owner_all` 정책이 남의 행을
 * 걸러낸다. 증명하지 않는 것: `actions/*.ts`의 자체 `getSessionUserId()` 체크 — RLS가
 * 최후 방어선이라 액션의 체크는 다중 방어의 한 겹일 뿐, 이 경로로는 운동시킬 수 없다
 * (가짜 action id로는 그 코드에 닿지 않고, 진짜 action id는 빌드마다 바뀌어 테스트에
 * 못 박을 수 없다 — 그 id를 긁어내는 것보다 RLS를 직접 보는 쪽이 더 튼튼하다).
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
// 로컬 CLI가 내놓는 고정 데모 anon 키다(CLAUDE.md §2와 동일) — 비밀이 아니고, 로컬
// 컨테이너 밖에서는 아무것도 열지 못한다. RLS 기본 거부가 이 키 자체를 무해하게 만든다.
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

/**
 * `sb-*` 쿠키에서 액세스 토큰 전체를 꺼낸다. 디코딩은 `support/sb-cookie.ts`가 한다 —
 * `tests/auth.setup.ts`의 `sessionUserId()`는 거기서 `sub`만 더 꺼내고, 여기는 그 JWT
 * 자체가 필요하다(PostgREST 호출의 Authorization 헤더로 그대로 쓴다).
 */
async function accessToken(page: Page): Promise<string> {
  const cookies = await page.context().cookies();
  const token = accessTokenFromCookies(cookies);
  if (!token) throw new Error('세션 쿠키가 없다 — 먼저 /api/test/session/*를 호출했는가?');
  return token;
}

/** 주어진 JWT(또는 anon 키 그 자체)로 PostgREST에 PATCH를 보내고 갱신된 행 배열을 돌려준다.
 *  RLS가 걸러내면 빈 배열이다 — "그런 행이 없다"와 구분되지 않는다(소유 여부를 안 알려준다). */
async function patchAsUser(
  request: APIRequestContext,
  table: 'plans' | 'notices',
  id: string,
  body: Record<string, unknown>,
  token: string,
): Promise<unknown[]> {
  const res = await request.patch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    data: body,
  });
  // 지금 RLS가 거부한 쓰기는 "200 + 빈 배열"로 온다(걸러진 행이 0개일 뿐이라 에러가
  // 아니다). 정책이 나중에 403을 돌려주도록 더 엄해져도 — 그건 보안이 나아진 것이다 —
  // 이 헬퍼가 그것 때문에 깨지면 안 된다. 403도 "거부됐다"는 유효한 결과로 받는다.
  if (res.status() === 403) return [];
  expect(res.ok(), `PostgREST 응답이 비정상이다: ${res.status()}`).toBe(true);
  return (await res.json()) as unknown[];
}

/** 같은 테이블·id를 GET으로 읽는다 — 쓰기 시도 전후 값을 owner 토큰으로 비교하는 데 쓴다. */
async function getAsUser(
  request: APIRequestContext,
  table: 'plans' | 'notices',
  id: string,
  token: string,
): Promise<Record<string, unknown> | undefined> {
  const res = await request.get(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  expect(res.ok(), `PostgREST 응답이 비정상이다: ${res.status()}`).toBe(true);
  const rows = (await res.json()) as Record<string, unknown>[];
  return rows[0];
}

test.describe('비로그인', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('콘솔에 들어가면 로그인으로 보낸다', async ({ page }) => {
    await page.goto(EDIT);
    await expect(page).toHaveURL(/\/login/);
  });

  /**
   * 위 테스트는 proxy와 DAL(EDIT 페이지 자신의 `verifySession()`) **둘 다**가 지켜도
   * 통과한다 — 그래서 fix-round 1에서 proxy의 리다이렉트만 지웠을 때 안 깨졌다(DAL이
   * 중복으로 막았다). 이 테스트는 그 중복을 쪼갠다: `/dashboard`는 정적 placeholder라
   * DAL 체크가 없다(`app/(console)/dashboard/page.tsx` 확인) — 그래서 이 라우트는
   * proxy의 쿠키 유무 리다이렉트가 **단독** 방어선이고, proxy를 지우면 이 테스트만
   * 깨진다(위 EDIT 테스트는 DAL이 여전히 막아 그대로 통과한다).
   */
  test('DAL 체크가 없는 /dashboard도 로그인으로 보낸다 — proxy 단독 방어', async ({ page }) => {
    await page.goto(DASHBOARD);
    await expect(page).toHaveURL(/\/login/);
  });

  /**
   * anon 롤에는 정책이 하나도 없다(RLS 기본 거부, `supabase/migrations/20261004000002
   * _rls_policies.sql` 머리말 참고) — 그래서 로그인 자체를 안 거친 요청은 Next를 거치든
   * 안 거치든 DB API를 직접 때려도 아무 행도 못 건드린다. 이전 라운드의 "비로그인 쓰기
   * POST"가 증명하지 못했던 것(그 POST는 proxy에 막혀 RLS까지 가지도 못했다)을 여기서는
   * RLS 그 자체로 직접 확인한다.
   */
  test('로그인 없이 DB API를 직접 때려도 공지를 고칠 수 없다 (anon, RLS)', async ({ request }) => {
    // n-n1은 '소유권 격리' describe와 editor.spec.ts의 공지 삭제 테스트도 건드리는 행이다
    // (둘 다 fullyParallel). 여기서 reseed를 또 하나 더하면 같은 slug를 reseed하는 호출이
    // 겹치는 창이 넓어질 뿐이다 — 실제로 해 보니 동시에 두 reseed가 겹치면 delete+insert가
    // "duplicate key" 에러로 깨진다(reseedPlan이 그 동시성까지는 안전하지 않다). 그래서
    // reseed 대신 owner 토큰으로 "지금 그 행이 있다"만 직접 확인한다 — 이 request 컨텍스트
    // 안에서만 쓰는 세션이라 비로그인 describe의 storageState(쿠키 없음)는 그대로다.
    const sessionRes = await request.post('/api/test/session/owner');
    expect(sessionRes.status(), 'owner 세션 발급').toBe(204);
    const ownerToken = accessTokenFromCookies((await request.storageState()).cookies);
    if (!ownerToken) throw new Error('owner 세션 쿠키가 없다');
    const before = await getAsUser(request, 'notices', 'n-n1', ownerToken);
    expect(before, '대상 행이 있어야 비교가 의미 있다').toBeDefined();

    const rows = await patchAsUser(request, 'notices', 'n-n1', { title: '익명 해킹 시도' }, SUPABASE_ANON_KEY);
    expect(rows, 'anon 쓰기는 0행이어야 한다').toHaveLength(0);
  });
});

test.describe('소유권 격리', () => {
  // 세 테스트 모두 같은 slug(editor-notice)의 plans·notices 행을 beforeEach에서 reseed하고
  // 읽는다 — fullyParallel 기본값대로 두면 한 테스트의 reseed가 다른 테스트의 읽기 중간에
  // 끼어들 수 있다(editor.spec.ts가 같은 이유로 serial을 쓴다).
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(({ page }) => page.request.post('/api/test/reseed/editor-notice').then((res) => {
    expect(res.status(), '픽스처를 다시 세우지 못했다').toBe(204);
  }));

  test('다른 기획자는 남의 일정을 열 수 없다', async ({ page }) => {
    const res = await page.request.post('/api/test/session/other');
    expect(res.status()).toBe(204);

    // RLS가 0행을 돌려주므로 "없는 일정"과 같은 404가 된다 — 소유 여부를 알려주지 않는다.
    const got = await page.goto(EDIT);
    expect(got?.status(), '남의 일정은 404').toBe(404);
  });

  /**
   * 이 단계의 핵심 증명 — 부모 테이블. owner 토큰으로 먼저 값을 읽고(before), other의
   * **진짜** JWT로 PostgREST를 직접 쳐서 0행 갱신을 확인하고, owner로 다시 읽어(after)
   * DB 값이 그대로인지 본다. 응답이 빈 배열이라는 것만으로도 충분한 증거지만, "거부했다고
   * 말하면서 실제로는 썼다"는 불일치를 놓치지 않으려고 값 비교까지 한다.
   */
  test('다른 기획자는 남의 일정 행을 DB API로 직접 고칠 수 없다 (RLS)', async ({ page, request }) => {
    const ownerToken = await accessToken(page);
    const before = await getAsUser(request, 'plans', 'editor-notice', ownerToken);
    // before가 undefined면 after도 undefined일 뿐이라 아래 toBe 비교가 "둘 다 없다"로
    // 공허하게 통과한다 — 비교가 뭔가를 증명하려면 비교 대상이 실제로 있어야 한다.
    expect(before, '대상 행이 있어야 비교가 의미 있다').toBeDefined();

    const switched = await page.request.post('/api/test/session/other');
    expect(switched.status()).toBe(204);
    const otherToken = await accessToken(page);

    const rows = await patchAsUser(request, 'plans', 'editor-notice', { title: '해킹된 제목' }, otherToken);
    expect(rows, '남의 plans 행은 0건 갱신이어야 한다').toHaveLength(0);

    const after = await getAsUser(request, 'plans', 'editor-notice', ownerToken);
    expect(after?.title, 'DB 값이 그대로여야 한다').toBe(before?.title);
  });

  /**
   * 같은 증명을 자식 테이블로 — `notices_owner_all`은 `plan_id`로 부모를 서브쿼리해
   * `owner_id`를 본다. 부모(plans)와 코드 경로가 달라서(1단계 때 schedule_items의 2단
   * 조인처럼) 따로 깨질 수 있으니 자식도 하나는 직접 확인한다.
   */
  test('다른 기획자는 남의 공지(자식 행)를 DB API로 직접 고칠 수 없다 (RLS)', async ({ page, request }) => {
    const ownerToken = await accessToken(page);
    const before = await getAsUser(request, 'notices', 'n-n1', ownerToken);
    expect(before, '대상 행이 있어야 비교가 의미 있다').toBeDefined();

    const switched = await page.request.post('/api/test/session/other');
    expect(switched.status()).toBe(204);
    const otherToken = await accessToken(page);

    const rows = await patchAsUser(request, 'notices', 'n-n1', { title: '해킹된 공지' }, otherToken);
    expect(rows, '남의 notices 행은 0건 갱신이어야 한다').toHaveLength(0);

    const after = await getAsUser(request, 'notices', 'n-n1', ownerToken);
    expect(after?.title, 'DB 값이 그대로여야 한다').toBe(before?.title);
  });
});

test.describe('세션', () => {
  test('로그인 상태로 /login에 가면 대시보드로 보낸다', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('위조 세션', () => {
  /**
   * proxy는 쿠키 "유무"만 본다(§1-3 머리말) — 이름이 sb-로 시작하기만 하면 그 값이
   * 뭐든 /login으로 안 보낸다. 그래서 편집기 페이지의 verifySession()을 지워도 proxy의
   * 다른 리다이렉트가 가려 전 스위트가 초록으로 남는 간극이 있었다(§2 "DAL 단독 커버
   * 없음"). 이 테스트는 그 간극을 단독으로 잡는다: 형식만 맞는 위조 쿠키로 proxy는
   * 통과시키되, DAL의 verifySession() → getUser()가 진짜 세션인지 Supabase에 확인하고
   * /login으로 리다이렉트를 건다.
   *
   * 브라우저로 끝까지 따라가지 않고 `maxRedirects: 0`으로 **첫 응답만** 본다. 끝까지
   * 따라가면 proxy의 "이미 로그인됨 && pathname === '/login'" 분기가 **같은 위조
   * 쿠키**를 또 보고 /login을 다시 /dashboard로 튕긴다 — 그건 proxy가 쿠키 유무만
   * 보는 낙관적 검사라는, 이미 알고 있는 별개의 사실이고(§1-3) 이 테스트가 묻는 질문
   * ("DAL이 EDIT 요청 자체를 막는가")과 무관하다. 그 2차 바운스에 가려 첫 리다이렉트의
   * 목적지를 못 보는 쪽이 오히려 이 테스트의 의도를 놓친다.
   */
  test.use({ storageState: { cookies: [], origins: [] } });

  test('위조 세션 쿠키는 proxy를 통과하지만 DAL이 단독으로 /login을 돌려보낸다', async ({ request }) => {
    const res = await request.get(EDIT, {
      headers: { Cookie: 'sb-test-auth-token=base64-bogus' },
      maxRedirects: 0,
    });
    expect([301, 302, 303, 307, 308]).toContain(res.status());
    const location = res.headers()['location'];
    expect(location, 'Location 헤더가 있어야 한다').toBeTruthy();
    // 상대 경로("/login")로 올 수도 있어 base를 준다 — 절대 URL이면 base는 무시되고
    // pathname만 보므로 base의 origin 자체는 어차피 안 쓴다.
    expect(new URL(location!, 'http://localhost').pathname).toBe('/login');
  });
});
