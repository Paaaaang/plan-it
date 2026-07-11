/**
 * @file Next.js 미들웨어
 * @description 모든 요청에 대해 인증/권한을 체크하고 적절한 라우팅을 수행.
 *
 * @routing-rules
 *  1. /(console)/* (대시보드/편집): 비인증 → /login 리다이렉트
 *  2. /(admin)/*   (관리자 콘솔):  비인증 또는 role≠admin → 403 또는 리다이렉트
 *  3. /(auth)/*    (로그인/회원가입): 이미 인증됨 → /dashboard 리다이렉트
 *  4. /p/[slug]    (뷰어): 인증 체크 없음 (공개)
 *  5. /            (랜딩): 인증 체크 없음 (공개)
 *
 * @connects
 *  - lib/supabase/middleware.ts → 미들웨어용 Supabase 클라이언트 (세션 갱신)
 *  - types/user.ts              → Profile.role 확인
 *
 * @spec F-AUTH-2 (인증된 사용자만 콘솔 접근)
 * @spec F-ADMIN-1 (role='admin' 검증, 비관리자 차단)
 *
 * @config matcher: ['/(console)/:path*', '/(admin)/:path*', '/(auth)/:path*']
 */
