/**
 * @file AnalyticsEvent (KPI 이벤트) 타입 정의
 * @description analytics_events 테이블에 대응하는 TypeScript 타입.
 *
 * @table analytics_events
 * @fields id, plan_id, event_type, action_key, session_hash, occurred_at
 *
 * @event_types
 *  - plan_created   → 주간 생성 수
 *  - plan_published → 공유 전환율 (plan_published / plan_created)
 *  - plan_viewed    → 평균 조회수 (plan_viewed / plan)
 *  - action_click   → 실용 액션 클릭률 (action_click / plan_viewed)
 *    └ action_key: copy_address, open_map 등
 *
 * @used-by
 *  - src/server/actions/analytics-actions.ts   → logEvent
 *  - src/server/actions/admin-actions.ts       → getSummary (KPI 집계)
 *  - src/client/components/admin/kpi-widget.tsx → KPI 위젯
 */
