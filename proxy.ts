/**
 * @file Next.js Proxy (구 middleware — Next 16에서 이름 변경)
 * @description 인증/권한 체크 + 라우팅
 *
 * @routing-rules
 *  1. /dashboard/* → 비인증 → /login 리다이렉트
 *  2. /admin/*     → 비인증 또는 role≠admin → 403 또는 리다이렉트
 *  3. /login,/signup → 이미 인증됨 → /dashboard 리다이렉트
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

/**
 * 프로덕션 안전밸브 — 아래 TODO 4개가 아직 스텁이라 이 proxy는 실제로
 * 아무것도 막지 않는다. 인증이 붙기 전까지 콘솔·관리자 경로가 배포되는 일이
 * 없게 한다.
 *
 * "인증이 설정됐는가"의 판정: `lib/supabase/session.ts`가 세션을 확인하려면
 * `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 둘 다
 * 있어야 한다(그 파일 헤더의 @env). 지금 그 파일은 비어 있어 이 변수가
 * 있어도 실제로 세션을 검사하는 코드는 없지만, 이 값의 존재가 "다음 사람이
 * 인증 배선을 시작했다"는 가장 이른 신호다 — 값이 없으면 확실히 안 붙은
 * 것이고, 그 확실한 쪽만 막는다.
 *
 * 개발·테스트(`next dev`, NODE_ENV=development)는 절대 막지 않는다 — 211개
 * Playwright 테스트가 편집기를 무인증으로 연다(webServer가 `npm run dev`를
 * 띄운다). `next build && next start`로 띄운 프로덕션에서만, 그리고 위 변수가
 * 없을 때만 막는다. 404를 쓰는 이유: 링크만 아는 사람에게 경로의 존재 자체를
 * 알리지 않는다 — 로그인 리다이렉트(302)는 "여기 뭔가 있다"는 걸 알려준다.
 *
 * 실제 세션 검사가 이 함수 안에 들어가는 순간(아래 TODO 4개 해소) 이 블록은
 * 지운다 — 그때부터는 진짜 인증이 401/리다이렉트로 막는다.
 */
const AUTH_WIRED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !AUTH_WIRED) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // TODO: lib/supabase/session.ts 연동 — 세션 갱신 + 인증 체크
  // TODO: 콘솔 경로 비인증 리다이렉트
  // TODO: 관리자 경로 권한 체크
  // TODO: 인증 페이지 로그인 상태 리다이렉트

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
