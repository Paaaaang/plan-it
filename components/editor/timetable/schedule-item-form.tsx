/**
 * @file 일정 항목 생성/수정 폼
 * @description 타임테이블 항목의 시작 시간, 소요시간, 활동명, 메모를 입력하는 폼.
 *              장소 연결 선택기(place-linker) 포함.
 *
 * @spec F-EDIT-TT-2~3, F-EDIT-TT-5
 *
 * @connects
 *  - components/editor/timetable/place-linker.tsx → 장소 선택/신규 생성
 *  - actions/schedule-actions.ts                   → create / update / linkPlace
 *  - types/schedule.ts                             → ScheduleItem 타입
 */
