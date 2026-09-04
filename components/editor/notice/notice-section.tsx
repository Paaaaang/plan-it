/**
 * @file 공지 섹션 컨테이너
 * @description 일정의 공지(하이라이트) 목록을 관리하는 섹션.
 *              추가/수정/삭제, 드래그 및 버튼으로 순서 변경.
 *
 * @spec F-EDIT-NOTICE-1~4 (공지 CRUD, 아이콘/제목/본문, 순서 변경, 아이콘 프리셋)
 *
 * @connects
 *  - components/editor/notice/sortable-notice-list.tsx → 순서 변경 가능한 목록
 *  - components/editor/notice/notice-form.tsx          → 공지 추가/수정 폼
 *  - actions/notice-actions.ts                         → CRUD + reorder
 *  - types/notice.ts                                   → Notice 타입
 *  - components/viewer/notice-bar.tsx                   → 뷰어에서 이 데이터를 렌더링
 */
