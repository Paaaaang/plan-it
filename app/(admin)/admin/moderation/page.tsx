/**
 * @file 콘텐츠 모더레이션 페이지
 * @description 신고/자동 탐지된 콘텐츠를 검토하고 처리(검토중/해결/숨김)하는 관리 페이지.
 *              숨김 처리 시 해당 slug 뷰어 비노출 + 캐시 무효화.
 *
 * @route /admin/moderation
 * @auth 관리자 권한 필요
 * @spec F-ADMIN-7~10 (신고 대기열, 검토, 숨김, 처리 이력)
 *
 * @connects
 *  - components/admin/moderation-queue.tsx   → 신고/자동 탐지 대기열 목록
 *  - components/admin/moderation-detail.tsx  → 대상 일정 상세 검토 패널
 *  - actions/admin-actions.ts               → listFlags / reviewFlag / hidePlan
 *  - lib/utils/cache.ts                     → 숨김 처리 시 캐시 무효화
 *  - types/moderation.ts                    → ModerationFlag 타입
 */
