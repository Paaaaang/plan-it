/**
 * @file Day 탭/스와이프 전환
 * @description 기본 정보의 기간에서 파생된 Day(Day 1, Day 2...) 탭을 표시.
 *              클릭 또는 스와이프로 Day 전환.
 *
 * @spec F-EDIT-TT-1 (기본 정보 날짜 연동 Day 탭/스와이프 전환)
 *
 * @connects
 *  - components/editor/timetable/timetable-section.tsx → 부모 섹션에서 사용
 *  - types/schedule.ts                                  → Day 타입 (day_number, date)
 *  - lib/utils/date.ts                                  → 날짜 포맷
 */
