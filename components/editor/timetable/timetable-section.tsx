/**
 * @file 타임테이블 섹션 컨테이너
 * @description 기본 정보의 날짜와 연동된 Day별 타임테이블을 편집하는 섹션.
 *              Day 탭/스와이프 전환, 일정 항목 CRUD, 장소 연결.
 *
 * @spec F-EDIT-TT-1~5 (Day 탭, 항목 CRUD, 장소 연결)
 *
 * @connects
 *  - components/editor/timetable/day-tabs.tsx           → Day 탭 전환 UI
 *  - components/editor/timetable/schedule-item.tsx      → 개별 일정 항목
 *  - components/editor/timetable/schedule-item-form.tsx → 항목 추가/수정 폼
 *  - components/editor/basic-info/basic-info-section.tsx → 기간 → Day 연동 (단일 소스)
 *  - actions/schedule-actions.ts                         → CRUD + reorder + linkPlace
 *  - types/schedule.ts                                   → Day, ScheduleItem 타입
 *  - components/viewer/timeline.tsx                       → 뷰어에서 이 데이터를 렌더링
 */
