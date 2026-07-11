/**
 * @file 일정 항목 표시
 * @description 타임테이블의 개별 일정 항목을 표시.
 *              시작 시간, 소요시간, 활동명, 메모, 연결된 장소 정보 표시.
 *
 * @spec F-EDIT-TT-3 (시작 시간, 소요시간, 활동명, 메모, 장소 연결)
 *
 * @connects
 *  - components/editor/timetable/timetable-section.tsx → 목록 내 개별 항목
 *  - types/schedule.ts                                  → ScheduleItem 타입
 *  - types/place.ts                                     → Place (연결된 장소)
 */
