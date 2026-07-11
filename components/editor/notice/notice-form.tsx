/**
 * @file 공지 생성/수정 폼
 * @description 공지 항목의 아이콘, 제목, 본문(핵심 공지/준비물/유의사항)을 입력하는 폼.
 *
 * @spec F-EDIT-NOTICE-2 (아이콘, 제목, 본문)
 * @spec F-EDIT-NOTICE-4 (아이콘 프리셋 세트) — P1
 *
 * @connects
 *  - components/ui/icon.tsx          → 아이콘 프리셋 선택 UI
 *  - components/ui/input.tsx         → 제목/본문 입력
 *  - actions/notice-actions.ts       → create / update
 *  - types/notice.ts                 → Notice 타입
 */
