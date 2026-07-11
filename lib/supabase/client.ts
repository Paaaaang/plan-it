/**
 * @file Supabase 브라우저 클라이언트
 * @description Client Component에서 사용하는 Supabase 클라이언트.
 *              소셜 로그인 등 브라우저 사이드 인증에 사용.
 *
 * @usage Client Component ('use client')에서 import하여 사용
 *
 * @connects
 *  - app/(auth)/login/page.tsx   → 소셜 로그인 시
 *  - hooks/use-auth.ts           → 클라이언트 사이드 인증 상태 구독
 *  - hooks/use-plan.ts           → 실시간 구독 (필요 시)
 *
 * @env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
