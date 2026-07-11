/**
 * @file 뷰어 헤더
 * @description 일정 제목, 기간, 기간 요약(N박 M일)을 표시하는 뷰어 상단 헤더.
 *
 * @spec F-VIEW-2 (헤더: 제목·기간·기간요약)
 *
 * @connects
 *  - app/p/[slug]/page.tsx  → 뷰어 페이지에서 렌더링
 *  - lib/utils/date.ts      → N박 M일 계산
 *  - types/plan.ts          → Plan.title, start_date, end_date
 */
