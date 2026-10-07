/**
 * @file 일정 미리보기 렌더링
 * @description 스플릿뷰/바텀시트 내부에서 일정의 주요 정보를 요약 렌더링.
 *              "편집으로 이동" CTA 버튼 포함.
 *
 * @spec F-DASH-5 (렌더링된 항목 요약 + 편집 진입 CTA)
 *
 * @connects
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx → "편집으로 이동" 링크 대상
 *  - src/shared/types/plan.ts, src/shared/types/notice.ts, src/shared/types/schedule.ts → 미리보기용 데이터 타입
 */
