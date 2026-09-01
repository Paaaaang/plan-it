/**
 * @file 기본 정보 섹션
 * @description 일정의 제목, 기간(시작일·종료일), 설명을 입력·수정·저장하는 섹션.
 *              기간 저장 시 Day 슬롯을 자동 생성/조정 (예: 2박3일 → Day 1~3).
 *
 * @spec F-EDIT-BASIC-1 (제목/기간/설명 입력·수정·저장)
 * @spec F-EDIT-BASIC-2 (기간 저장 시 Day 자동 생성/조정)
 * @spec F-EDIT-BASIC-3 (기간 축소 시 항목 있는 Day 삭제 경고) — P1
 *
 * @connects
 *  - components/editor/basic-info/date-range-picker.tsx  → 날짜 범위 선택 UI
 *  - actions/plan-actions.ts                              → update (제목/기간/설명 저장)
 *  - actions/schedule-actions.ts                          → Day 자동 생성/조정 트리거
 *  - components/editor/timetable/timetable-section.tsx    → 기간 ↔ Day 단일 소스 연동
 *  - components/ui/dialog.tsx                             → 기간 축소 시 경고 모달
 *  - types/plan.ts                                        → Plan.title, start_date, end_date
 *
 * @important 기간은 타임테이블 섹션의 Day와 "단일 소스(Single Source of Truth)"로 연동됨
 */
