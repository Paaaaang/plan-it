/**
 * @file 장소 등록/수정 폼
 * @description 장소의 이름, 주소, 좌표(lat/lng), 메모를 입력하는 폼.
 *
 * @spec F-EDIT-PLACE-1 (이름/주소/좌표/메모)
 * @spec F-EDIT-PLACE-4 (좌표 입력/검색 — 지도 provider 연동) — P1
 *
 * @connects
 *  - components/editor/place/map-embed.tsx           → 좌표 선택 시 지도 미리보기
 *  - components/editor/timetable/place-linker.tsx    → 타임테이블에서 신규 장소 즉시 생성 시 재사용
 *  - actions/place-actions.ts                         → create / update
 *  - types/place.ts                                   → Place 타입
 */
