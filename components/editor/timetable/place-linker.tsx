/**
 * @file 장소 연결 선택기
 * @description 타임테이블 항목에서 장소 섹션의 장소를 선택하거나 즉시 신규 장소를 생성하는 UI.
 *
 * @spec F-EDIT-TT-5 (장소 선택 연결 또는 신규 장소 즉시 생성)
 *
 * @connects
 *  - components/editor/place/place-form.tsx   → 신규 장소 즉시 생성 시 폼 재사용
 *  - actions/place-actions.ts                  → 장소 목록 조회 / 신규 생성
 *  - actions/schedule-actions.ts               → linkPlace (항목에 장소 연결)
 *  - types/place.ts                            → Place 타입
 *  - types/schedule.ts                         → ScheduleItem.place_id
 */
