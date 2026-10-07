/**
 * @file 인증 상태 관리 훅
 * @description Supabase Auth의 로그인/로그아웃 상태를 구독·관리하는 커스텀 훅.
 *
 * @connects
 *  - src/client/supabase/client.ts                → Supabase 클라이언트 (onAuthStateChange)
 *  - src/client/components/landing/hero.tsx            → 로그인 상태에 따라 CTA 분기
 *  - src/client/components/landing/cta-section.tsx     → 로그인 상태 확인
 *  - app/(console)/layout.tsx              → 콘솔 레이아웃에서 사용자 정보 표시
 */
