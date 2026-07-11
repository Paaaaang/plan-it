/**
 * @file Notice (공지) 타입 정의
 * @description notices 테이블에 대응하는 TypeScript 타입.
 *
 * @table notices
 * @fields id, plan_id, icon, title, body, display_order
 *
 * @used-by
 *  - actions/notice-actions.ts                    → CRUD + reorder
 *  - components/editor/notice/*                   → 공지 편집
 *  - components/viewer/viewer-notice.tsx          → 공지 렌더링
 */
