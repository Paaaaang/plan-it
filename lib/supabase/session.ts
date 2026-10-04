/**
 * @file Supabase 미들웨어 클라이언트
 * @description Next.js 미들웨어에서 사용하는 Supabase 클라이언트.
 *              request/response 쿠키를 통한 세션 갱신 처리.
 *
 * @connects
 *  - proxy.ts → Next.js Proxy에서 세션 확인 및 갱신
 *
 * @env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createServerClient as createSSRClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 세션 쿠키를 갱신하고 그 쿠키가 실린 응답을 돌려준다.
 *
 * 갱신이 여기 있는 이유: 액세스 토큰이 만료되면 쿠키를 **다시 써야** 하는데
 * Server Component는 쿠키를 쓸 수 없다. 쓸 수 있는 자리가 proxy뿐이다.
 *
 * 인가 판정은 하지 않는다 — Next 문서가 proxy를 "완전한 인가 해결책"으로 쓰지 말라고
 * 명시한다(authentication.md의 Optimistic checks 절). 판정은 lib/auth/dal.ts가 한다.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createSSRClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser()가 토큰을 검증하고 필요하면 갱신한다. getSession()은 쿠키를 그대로 믿으므로
  // 여기서 쓰지 않는다 — 위조된 쿠키를 통과시킨다.
  await supabase.auth.getUser();
  return response;
}
