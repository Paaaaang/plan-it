/**
 * @file 뷰어 공지 카드
 * @description 공지(하이라이트) 목록을 아이콘+제목+본문 카드로 렌더링.
 *              저장된 display_order 순서대로 노출.
 *
 * @spec F-VIEW-3 (공지: 아이콘+제목+본문 카드, 저장 순서대로 노출)
 *
 * @connects
 *  - app/p/[slug]/page.tsx   → 뷰어 페이지에서 렌더링
 *  - components/ui/icon.tsx  → 공지 아이콘 렌더링
 *  - components/ui/card.tsx  → 카드 UI
 *  - types/notice.ts         → Notice 타입
 */
