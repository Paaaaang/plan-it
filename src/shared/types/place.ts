/**
 * @file Place (장소) 타입 정의
 * @description places 테이블에 대응하는 TypeScript 타입.
 *
 * @table places
 * @fields id, plan_id, name, address, lat, lng, memo, is_pinned
 *
 * @used-by
 *  - src/server/actions/place-actions.ts                       → CRUD + togglePin
 *  - src/client/components/editor/place/*                      → 장소 편집
 *  - src/client/components/editor/timetable/place-linker.tsx  → 타임테이블 장소 연결
 *  - src/client/components/viewer/place-list.tsx · place-sheet.tsx → 뷰어 렌더링 (src/shared/types/viewer.ts::ViewerPlace 경유)
 *
 * @important
 *  - is_pinned=true: 고정(대표) 장소 → 뷰어 "오시는 길" 상시 노출
 *  - is_pinned=false: 유동 장소 → 타임테이블 시간순 표기
 */
