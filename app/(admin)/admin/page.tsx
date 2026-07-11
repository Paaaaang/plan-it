/**
 * @file 관리자 대시보드 — KPI 모니터링
 * @description 운영 KPI 위젯을 표시하는 관리자 메인 페이지.
 *              주간 생성 수, 공유 전환율, 평균 조회수, 실용 액션 클릭률.
 *
 * @route /admin
 * @auth 관리자 권한 필요
 * @spec F-ADMIN-2~6 (KPI 위젯: 주간 생성 수/공유 전환율/평균 조회수/실용 액션 클릭률)
 *
 * @connects
 *  - components/admin/kpi-widget.tsx    → KPI 위젯 컴포넌트
 *  - actions/admin-actions.ts           → getSummary (KPI 집계 데이터)
 *  - types/analytics.ts                 → AnalyticsEvent 타입
 *
 * @data analytics_events 테이블 집계
 *  - plan_created → 주간 생성 수
 *  - plan_published / plan_created → 공유 전환율
 *  - plan_viewed / plan → 평균 조회수
 *  - action_click / plan_viewed → 실용 액션 클릭률
 */
