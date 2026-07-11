/**
 * @file 공유 링크 확인·복사 컴포넌트
 * @description 일정의 공유 URL(/p/{slug})을 표시하고 클립보드 복사 기능 제공.
 *              시스템 공유 시트 호출도 지원.
 *
 * @spec F-SHARE-3 (URL 형식: https://planit.app/p/{slug})
 * @spec F-SHARE-4 (링크 복사 및 시스템 공유 시트 호출)
 *
 * @connects
 *  - hooks/use-toast.ts → 복사 완료 토스트 알림
 *  - types/plan.ts      → Plan.slug
 */
