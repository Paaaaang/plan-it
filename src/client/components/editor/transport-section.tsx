/**
 * @file 대중교통/이동 안내 섹션
 * @description 일정의 대중교통 이동 안내를 편집하는 섹션.
 *              수단(KTX/시외버스/차량 등), 출발/도착, 소요시간, 메모.
 *
 * @spec F-VIEW-6 (뷰어에서 대중교통 정보 렌더링) — 데이터 편집은 여기서
 *
 * @connects
 *  - src/client/components/editor/transport-item-form.tsx  → 교통 항목 추가/수정 폼
 *  - src/server/actions/transport-actions.ts               → CRUD + reorder
 *  - src/shared/types/transport.ts                         → TransportInfo 타입
 */
