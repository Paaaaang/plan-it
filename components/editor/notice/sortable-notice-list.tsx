/**
 * @file 드래그 순서 변경 공지 목록
 * @description 공지 항목을 드래그 앤 드롭 또는 위/아래 버튼으로 순서 변경 가능한 목록.
 *
 * @spec F-EDIT-NOTICE-3 (드래그 및 버튼(위/아래) 순서 변경)
 *
 * @connects
 *  - components/editor/notice/notice-item.tsx  → 개별 공지 항목 렌더링
 *  - actions/notice-actions.ts                 → reorder (순서 저장)
 *  - types/notice.ts                           → Notice.display_order
 *
 * @notes 드래그 라이브러리 (예: @dnd-kit/sortable) 사용 고려
 */
