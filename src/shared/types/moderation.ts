/**
 * @file ModerationFlag (콘텐츠 신고/검토) 타입 정의
 * @description moderation_flags 테이블에 대응하는 TypeScript 타입.
 *
 * @table moderation_flags
 * @fields id, plan_id, source ('report'|'auto'), reason,
 *         status ('open'|'reviewing'|'resolved'|'hidden'),
 *         reviewed_by (FK profiles), created_at, resolved_at
 *
 * @used-by
 *  - src/server/actions/admin-actions.ts                    → listFlags / reviewFlag / hidePlan
 *  - src/client/components/admin/moderation-queue.tsx       → 대기열 목록
 *  - src/client/components/admin/moderation-detail.tsx      → 상세 검토
 */
