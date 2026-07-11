/**
 * @file Place (장소) 타입 정의
 * @description places 테이블에 대응하는 TypeScript 타입.
 *
 * @table places
 * @fields id, plan_id, name, address, lat, lng, memo, is_pinned
 *
 * @used-by
 *  - actions/place-actions.ts                       → CRUD + togglePin
 *  - components/editor/place/*                      → 장소 편집
 *  - components/editor/timetable/place-linker.tsx  → 타임테이블 장소 연결
 *  - components/viewer/viewer-directions.tsx        → 오시는 길 렌더링
 *  - components/viewer/action-buttons.tsx           → 주소 복사
 *
 * @important
 *  - is_pinned=true: 고정(대표) 장소 → 뷰어 "오시는 길" 상시 노출
 *  - is_pinned=false: 유동 장소 → 타임테이블 시간순 표기
 */
