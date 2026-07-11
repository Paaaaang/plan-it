/**
 * @file 장소 항목 표시
 * @description 개별 장소 정보(이름/주소/좌표/메모)와 고정(pinned) 상태를 표시.
 *              수정/삭제/고정 토글 액션.
 *
 * @connects
 *  - components/editor/place/place-section.tsx → 부모 섹션에서 렌더링
 *  - actions/place-actions.ts                   → togglePin / delete
 *  - types/place.ts                             → Place 타입 (is_pinned)
 */
