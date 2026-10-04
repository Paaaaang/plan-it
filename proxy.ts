/**
 * @file Next.js Proxy (구 middleware — Next 16에서 이름 변경)
 * @description 인증/권한 체크 + 라우팅
 *
 * @routing-rules
 *  1. /dashboard/* → 비인증 → /login 리다이렉트
 *  2. /admin/*     → 비인증 또는 role≠admin → 403 또는 리다이렉트
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
 * 프로덕션 안전밸브 — 카카오 provider가 설정되지 않은 동안 콘솔·관리자 경로를 막는다.
 *
 * 세션 검사가 진짜로 돌아도, 로그인 버튼이 동작하지 않는 동안 프로덕션 콘솔을 여는 것은
 * 말이 안 된다. 조건이 1단계의 "auth env 없음"에서 "카카오 키 없음"으로 바뀌었다.
 *
 * 이 블록을 지우는 조건: KAKAO_CLIENT_ID가 프로덕션 env에 있고, 2c단계가 /admin에
 * role 검사를 붙였을 때. 그 전에는 지우지 않는다.
 */
const KAKAO_WIRED = Boolean(process.env.KAKAO_CLIENT_ID);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === "production" && !KAKAO_WIRED) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // 세션 쿠키를 갱신한다. 인가 판정은 하지 않는다 — Next 문서가 proxy를 완전한 인가
  // 해결책으로 쓰지 말라고 명시한다(authentication.md). 진짜 판정은 lib/auth/dal.ts다.
  const response = await updateSession(request);

  // 낙관적 검사: 쿠키가 아예 없으면 보낸다. 쿠키가 있다는 것이 유효한 세션을 뜻하지는
  // 않지만, 없는 것은 확실히 비로그인이다.
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));

  if (!hasSession && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasSession && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
