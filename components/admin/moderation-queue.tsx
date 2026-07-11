/**
 * @file 모더레이션 대기열 목록
 * @description 신고/자동 탐지된 콘텐츠(moderation_flags status=open) 대기열 표시.
 *
 * @spec F-ADMIN-7 (신고/자동 탐지 대기열 조회)
 *
 * @connects
 *  - app/(admin)/admin/moderation/page.tsx     → 모더레이션 페이지에서 렌더링
 *  - components/admin/moderation-detail.tsx     → 항목 클릭 시 상세 검토
 *  - actions/admin-actions.ts                   → listFlags
 *  - types/moderation.ts                        → ModerationFlag 타입
 */
