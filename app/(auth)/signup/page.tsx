/**
 * @file 회원가입 페이지
 * @description Supabase Auth 기반 회원가입 페이지.
 *              가입 완료 후 로그인 → 대시보드로 이동.
 *
 * @route /signup
 * @spec F-AUTH-1
 *
 * @connects
 *  - actions/auth-actions.ts       → 회원가입 서버 액션 호출
 *  - lib/supabase/client.ts        → Supabase 클라이언트
 *  - app/(auth)/login/page.tsx     → 로그인 페이지 링크
 */
