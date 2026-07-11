/**
 * @file 로그인 페이지
 * @description Supabase Auth 기반 로그인 페이지.
 *              이메일/비밀번호 또는 소셜 로그인을 제공한다.
 *
 * @route /login
 * @spec F-AUTH-1 (Supabase Auth 기반 로그인/로그아웃)
 *
 * @connects
 *  - actions/auth-actions.ts       → 로그인 서버 액션 호출
 *  - lib/supabase/client.ts        → Supabase 클라이언트 (소셜 로그인 시)
 *  - app/(console)/dashboard/      → 로그인 성공 후 리다이렉트 대상
 *  - app/(auth)/signup/page.tsx    → 회원가입 페이지 링크
 */
