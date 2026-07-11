/**
 * @file 인증 서버 액션
 * @description Supabase Auth 기반 로그인/로그아웃/회원가입 처리.
 *
 * 'use server'
 *
 * @spec F-AUTH-1 (Supabase Auth 기반 로그인/로그아웃)
 *
 * @actions
 *  - signIn(email, password)    → 이메일 로그인
 *  - signUp(email, password)    → 회원가입
 *  - signOut()                  → 로그아웃
 *
 * @connects
 *  - lib/supabase/server.ts      → Supabase 서버 클라이언트
 *  - app/(auth)/login/page.tsx   → 로그인 페이지에서 호출
 *  - app/(auth)/signup/page.tsx  → 회원가입 페이지에서 호출
 */
