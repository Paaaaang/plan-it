/**
 * @file Next.js 미들웨어
 * @description 인증/권한 체크 + 라우팅
 *
 * @routing-rules
 *  1. /(console)/* → 비인증 → /login 리다이렉트
 *  2. /(admin)/*   → 비인증 또는 role≠admin → 403 또는 리다이렉트
 *  3. /(auth)/*    → 이미 인증됨 → /dashboard 리다이렉트
 *  4. /p/[slug]    → 인증 체크 없음
 *  5. /            → 인증 체크 없음
 *
 * @spec F-AUTH-2, F-ADMIN-1
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: lib/supabase/middleware.ts 연동 — 세션 갱신 + 인증 체크
  // TODO: 콘솔 경로 비인증 리다이렉트
  // TODO: 관리자 경로 권한 체크
  // TODO: 인증 페이지 로그인 상태 리다이렉트

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(console)/:path*",
    "/(admin)/:path*",
    "/(auth)/:path*",
  ],
};
