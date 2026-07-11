/**
 * @file Day/ScheduleItem CRUD + 장소 연결 서버 액션
 * @description Day 자동 생성/조정, 타임테이블 항목 CRUD, 장소 연결.
 *
 * 'use server'
 *
 * @auth 인증 필요 (plan의 owner_id 확인)
 *
 * @actions
 *  - syncDays(planId, startDate, endDate) → 기간 변경 시 Day 자동 생성/조정 (F-EDIT-BASIC-2)
 *  - listScheduleItems(dayId)             → 일정 항목 목록
 *  - createScheduleItem(dayId, data)      → 항목 추가 (F-EDIT-TT-2)
 *  - updateScheduleItem(id, data)         → 항목 수정
 *  - deleteScheduleItem(id)               → 항목 삭제
 *  - linkPlace(itemId, placeId)           → 장소 연결 (F-EDIT-TT-5)
 *  - reorderScheduleItems(dayId, orderedIds) → 순서 변경 (F-EDIT-TT-4)
 *
 * @connects
 *  - lib/supabase/server.ts                                 → Supabase 서버 클라이언트
 *  - lib/utils/cache.ts                                      → 캐시 무효화
 *  - types/schedule.ts                                       → Day, ScheduleItem 타입
 *  - components/editor/basic-info/basic-info-section.tsx    → syncDays 호출
 *  - components/editor/timetable/timetable-section.tsx      → CRUD 호출
 *  - components/editor/timetable/place-linker.tsx           → linkPlace 호출
 */
