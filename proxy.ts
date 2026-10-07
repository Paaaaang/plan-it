/**
 * @file Next.js Proxy (구 middleware — Next 16에서 이름 변경)
 * @description 인증/권한 체크 + 라우팅
 *
 * @routing-rules
 *  1. /dashboard/* → 비인증 → /login 리다이렉트
 *  2. /admin/*     → 2c(role 검사) 전까지 프로덕션에서 무조건 404. 그 뒤엔 비인증 또는
 *                    role≠admin → 403 또는 리다이렉트
 *  3. /login       → 이미 인증됨 → /dashboard 리다이렉트
 *  4. /p/[slug]    → 인증 체크 없음
 *  5. /            → 인증 체크 없음
 *
 * matcher는 **URL 세그먼트**를 쓴다. `(console)` 같은 라우트 그룹은 URL에
 * 나타나지 않으므로 매칭 대상이 될 수 없다 — path-to-regexp에서 그건 리터럴
 * "console"을 잡는 캡처 그룹이라 `/console/...`에만 맞고 실제 라우트인
 * `/dashboard/...`는 절대 못 잡는다(app/(console)/dashboard/... 트리 확인).
 *
 * @spec F-AUTH-2, F-ADMIN-1
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

/**
 * 프로덕션 안전밸브 — 카카오 provider가 설정되지 않은 동안 콘솔 경로를 막는다.
 *
 * 세션 검사가 진짜로 돌아도, 로그인 버튼이 동작하지 않는 동안 프로덕션 콘솔을 여는 것은
 * 말이 안 된다. 조건이 1단계의 "auth env 없음"에서 "카카오 키 없음"으로 바뀌었다.
 *
 * /admin은 **이 플래그에 묶지 않는다** — 카카오 키를 넣는 건 로그인을 켜려고 반드시
 * 하는 일인데, 그걸로 role 검사 없는 /admin까지 열리면 밸브의 존재 이유(사람의 기억에
 * 의존하지 않는 것)가 사라진다. /admin은 아래 별도 블록에서 무조건 막는다.
 *
 * 이 블록을 지우는 조건: KAKAO_CLIENT_ID가 프로덕션 env에 있을 때. 그 전에는 지우지 않는다.
 */
const KAKAO_WIRED = Boolean(process.env.KAKAO_CLIENT_ID);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin: 2c가 role 검사를 붙이기 전까지 무조건 막는다. KAKAO_WIRED와 독립이다 —
  // 카카오 키 유무가 이 경로를 열고 닫는 조건이 되면 안 된다.
  if (process.env.NODE_ENV === "production" && pathname.startsWith("/admin")) {
    return new NextResponse(null, { status: 404 });
  }

  if (process.env.NODE_ENV === "production" && !KAKAO_WIRED && pathname.startsWith("/dashboard")) {
    return new NextResponse(null, { status: 404 });
  }

  // 세션 쿠키를 갱신한다. 인가 판정은 하지 않는다 — Next 문서가 proxy를 완전한 인가
  // 해결책으로 쓰지 말라고 명시한다(authentication.md). 진짜 판정은 lib/auth/dal.ts다.
  const response = await updateSession(request);

  // 낙관적 검사: 쿠키가 아예 없으면 보낸다. 쿠키가 있다는 것이 유효한 세션을 뜻하지는
  // 않지만, 없는 것은 확실히 비로그인이다.
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));

  if (!hasSession && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone();
    return redirectWithCookies(url, "/login", response);
  }

  if (hasSession && pathname === "/login") {
    const url = request.nextUrl.clone();
    return redirectWithCookies(url, "/dashboard", response);
  }

  return response;
}

/**
 * 리다이렉트 응답에 updateSession()이 회전시킨 쿠키를 옮긴다.
 *
 * NextResponse.redirect()는 응답을 새로 만든다 — updateSession()이 토큰을 갱신하며
 * `from`에 실어 둔 Set-Cookie가 그 새 응답엔 없다. 복사하지 않으면 회전된 리프레시
 * 토큰이 브라우저에 전달되지 않고, 브라우저는 이미 교체된 옛 토큰을 다시 보낸다 —
 * Supabase의 재사용 유예(기본 10초)를 넘기면 세션이 폐기된다. Supabase SSR 문서가
 * 명시 경고로 두는 지점이다.
 */
function redirectWithCookies(url: URL, pathname: string, from: NextResponse): NextResponse {
  url.pathname = pathname;
  const res = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
