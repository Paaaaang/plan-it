/**
 * @file 기획자 콘솔 공통 레이아웃
 * @description 대시보드, 편집 페이지 등 기획자 콘솔에 공통 적용되는 레이아웃.
 *              좌측 내비게이션, 상단 헤더, 사용자 정보 표시 등.
 *
 * @auth 인증 필요 — middleware.ts에서 비인증 사용자 리다이렉트 처리
 * @spec F-AUTH-2 (인증된 사용자만 콘솔 접근)
 *
 * @connects
 *  - app/(console)/dashboard/page.tsx                  → 대시보드
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx  → 편집 페이지
 *  - hooks/use-auth.ts                                 → 인증 상태 확인
 *  - lib/supabase/server.ts                            → 서버에서 세션 확인
 */
