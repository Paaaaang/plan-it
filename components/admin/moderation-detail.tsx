/**
 * @file 모더레이션 상세 검토 패널
 * @description 대상 일정 상세 내용을 검토하고 처리(검토중/해결/숨김)하는 패널.
 *              숨김 처리 시 뷰어 비노출 + 캐시 무효화.
 *
 * @spec F-ADMIN-8~10 (검토, 숨김, 처리 이력)
 *
 * @connects
 *  - components/admin/moderation-queue.tsx → 대기열에서 선택 시 표시
 *  - actions/admin-actions.ts              → reviewFlag / hidePlan
 *  - lib/utils/cache.ts                    → 숨김 시 캐시 무효화
 *  - types/moderation.ts                   → ModerationFlag 타입
 */
