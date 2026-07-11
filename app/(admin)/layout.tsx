/**
 * @file 관리자 콘솔 공통 레이아웃
 * @description role='admin' 사용자만 접근 가능한 관리자 콘솔의 공통 레이아웃.
 *              관리자 사이드바, 헤더 등 공통 UI를 포함.
 *
 * @auth 관리자 권한 필요 — middleware.ts + 서버 인가 재검증
 * @spec F-ADMIN-1 (profiles.role='admin' 검증, 비관리자 403/리다이렉트)
 *
 * @connects
 *  - components/admin/admin-sidebar.tsx       → 관리자 사이드바 내비게이션
 *  - lib/supabase/server.ts                   → 서버에서 세션 + role 확인
 *  - app/(admin)/admin/page.tsx               → KPI 모니터링 대시보드
 *  - app/(admin)/admin/moderation/page.tsx    → 콘텐츠 모더레이션
 *  - app/(admin)/admin/announcements/page.tsx → 공지/업데이트 관리
 */
