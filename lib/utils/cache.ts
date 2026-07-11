/**
 * @file Redis/ISR 캐시 무효화 헬퍼
 * @description 기획자 저장/상태 변경 시 Redis 캐시 삭제 + Next.js ISR revalidate 트리거.
 *
 * @spec 기능명세서 §2.3 (캐시 무효화: slug 키 Redis 삭제 + revalidate)
 * @spec F-STATE-4 (상태 변경 시 뷰어 캐시 무효화)
 *
 * @connects
 *  - actions/plan-actions.ts               → 일정 저장/상태 변경 시 호출
 *  - actions/admin-actions.ts              → hidePlan 시 캐시 무효화
 *  - components/editor/status-control.tsx  → 상태 변경 트리거
 *
 * @infra Redis + Cloudflare CDN + Next.js revalidatePath/revalidateTag
 */
