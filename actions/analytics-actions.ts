/**
 * @file KPI 이벤트 로깅 서버 액션
 * @description analytics_events 테이블에 KPI 이벤트를 기록.
 *              서비스 롤로 기록 (클라이언트 직접 쓰기 차단).
 *
 * 'use server'
 *
 * @actions
 *  - logEvent(planId, eventType, actionKey?, sessionHash?)
 *    → event_type: plan_created | plan_published | plan_viewed | action_click
 *    → action_key: copy_address | open_map 등 (action_click 시)
 *
 * @connects
 *  - lib/supabase/admin.ts                   → 서비스 롤 클라이언트
 *  - types/analytics.ts                       → AnalyticsEvent 타입
 *  - app/p/[slug]/page.tsx                    → plan_viewed 이벤트
 *  - actions/plan-actions.ts                  → plan_created, plan_published 이벤트
 *
 * @important Phase 1(MVP)에 선행 구축 필요 → 관리자 KPI에서 집계 데이터 필요
 */
