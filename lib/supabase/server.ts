/**
 * @file Supabase 서버 클라이언트
 * @description Server Component, Server Action, Route Handler에서 사용하는 Supabase 클라이언트.
 *              쿠키 기반 세션 관리. RLS 정책이 적용됨.
 *
 * @usage Server Component, actions/*.ts 에서 import하여 사용
 *
 * @connects
 *  - lib/auth/dal.ts  → getSessionUserId()/verifySession() — 인가 판정의 단일 지점이
 *                        여기 클라이언트로 getUser()를 검증한다
 *  - actions/{plan,notice,place,schedule,transport,auth}-actions.ts → 사용자 JWT로
 *    쓴다. RLS가 owner_id = auth.uid()를 지킨다
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx, app/auth/callback/route.ts,
 *    app/api/test/session/[userKey]/route.ts
 *
 *  (viewer-actions.ts는 **여기가 아니라** lib/supabase/admin.ts를 쓴다 — 로그인이
 *  없어 auth.uid()가 없다. app/(console)/layout.tsx는 supabase를 전혀 import하지
 *  않는다 — 세션 확인은 각 페이지의 verifySession()이 한다.)
 *
 * @env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import "server-only";
import { createServerClient as createSSRClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 콘솔 경로용 클라이언트. **사용자 JWT를 들고 돌아 RLS가 적용된다.**
 *
 * 서비스 롤(admin.ts)과의 차이가 이 단계의 핵심이다: 여기서 나간 쿼리는 정책이
 * `owner_id = auth.uid()`를 강제하므로, 앱이 필터를 한 군데 빠뜨려도 남의 행에 닿지 않는다.
 *
 * 요청마다 새로 만든다 — 쿠키가 요청에 묶여 있어 모듈 캐시를 쓰면 사용자가 섞인다
 * (admin.ts가 캐시해도 되는 이유는 거기엔 세션이 없기 때문이다).
 */
export async function createServerClient(): Promise<SupabaseClient> {
  const jar = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // 값을 로그에 남기지 않는다. 이름만 말한다(admin.ts와 같은 규칙).
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.");

  return createSSRClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        // Server Component에서는 쿠키를 쓸 수 없다(Next 제약). 거기서 갱신이 필요하면
        // 던지는 대신 조용히 넘긴다 — 갱신은 proxy가 맡는다(session.ts).
        try {
          list.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // Server Component 렌더 중. 의도된 경로다.
        }
      },
    },
  });
}
