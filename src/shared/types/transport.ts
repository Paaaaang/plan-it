/**
 * @file TransportInfo (대중교통/이동 안내) 타입 정의
 * @description transport_info 테이블에 대응하는 TypeScript 타입.
 *
 * @table transport_info
 * @fields id, plan_id, mode, from_label, to_label, duration_label, note, display_order
 *
 * @used-by
 *  - src/server/actions/transport-actions.ts                  → CRUD + reorder
 *  - src/client/components/editor/transport-section.tsx       → 교통 편집
 *  - src/shared/types/viewer.ts::ViewerTransport              → 뷰어 DTO. 렌더링 컴포넌트는 아직 없다
 */
