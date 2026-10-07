/**
 * @file KPI 위젯 컴포넌트
 * @description 운영 KPI를 카드 형태로 표시하는 위젯.
 *              주간 생성 수, 공유 전환율, 평균 조회수, 실용 액션 클릭률.
 *
 * @spec F-ADMIN-2~5 (KPI 위젯 4종)
 * @spec F-ADMIN-6 (기간 필터, 추세 그래프) — P2
 *
 * @connects
 *  - app/(admin)/admin/page.tsx  → 관리자 대시보드에서 렌더링
 *  - src/server/actions/admin-actions.ts    → getSummary (KPI 집계 API)
 *  - src/shared/types/analytics.ts          → AnalyticsEvent 타입
 *  - src/client/components/ui/card.tsx      → 카드 UI
 *
 * @data analytics_events 테이블 집계
 */
