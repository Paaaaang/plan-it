/**
 * @file Day, ScheduleItem (타임테이블) 타입 정의
 * @description days, schedule_items 테이블에 대응하는 TypeScript 타입.
 *
 * @table days
 * @fields id, plan_id, day_number, date
 *
 * @table schedule_items
 * @fields id, day_id, start_time, duration_min, activity_name,
 *         memo, place_id (FK places, nullable), display_order
 *
 * @used-by
 *  - actions/schedule-actions.ts                       → Day/ScheduleItem CRUD
 *  - components/editor/timetable/*                     → 타임테이블 편집
 *  - components/editor/basic-info/basic-info-section.tsx → 기간 → Day 연동
 *  - components/viewer/timeline.tsx · timeline-item.tsx → 뷰어 렌더링 (types/viewer.ts::ViewerItem 경유)
 *
 * @relations
 *  - ScheduleItem.place_id → Place (선택적 연결, 유동 장소)
 *  - Day.plan_id → Plan
 */
