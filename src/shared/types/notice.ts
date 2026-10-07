/**
 * @file Notice (공지) 타입 정의
 * @description notices 테이블에 대응하는 TypeScript 타입.
 *
 * @table notices
 * @fields id, plan_id, icon, title, body, display_order
 *
 * @used-by
 *  - src/server/actions/notice-actions.ts                    → CRUD + reorder
 *  - src/client/components/editor/notice/*                   → 공지 편집
 *  - src/client/components/viewer/notice-bar.tsx             → 뷰어 렌더링 (src/shared/types/viewer.ts::ViewerNotice 경유)
 */
