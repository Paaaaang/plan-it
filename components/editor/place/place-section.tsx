/**
 * @file 장소 섹션 컨테이너
 * @description 일정의 장소를 관리하는 섹션.
 *              고정 등록(대표 장소) 또는 타임테이블 유동 연동.
 *
 * @spec F-EDIT-PLACE-1~5 (장소 CRUD, 고정/유동, 좌표, 삭제 시 연결 정리)
 *
 * @connects
 *  - components/editor/place/place-item.tsx   → 개별 장소 항목 표시
 *  - components/editor/place/place-form.tsx   → 장소 추가/수정 폼
 *  - components/editor/place/map-embed.tsx    → 지도 임베드 미리보기
 *  - actions/place-actions.ts                  → CRUD + togglePin
 *  - types/place.ts                            → Place 타입
 *
 * @important
 *  - 고정 장소(is_pinned=true): 뷰어 "오시는 길"에 상시 노출
 *  - 유동 장소: 타임테이블 항목에 연결, 시간순 자동 정렬
 *  - 장소 삭제 시 연결된 타임테이블 항목의 place_id를 null로 정리
 */
