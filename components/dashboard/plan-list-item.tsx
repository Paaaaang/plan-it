/**
 * @file 일정 목록 개별 항목
 * @description 일정 하나를 표시하는 목록 행 컴포넌트.
 *              상태 배지, 제목, 기간, 최근 수정일 표시.
 *              클릭 시 스플릿뷰/바텀시트 미리보기 오픈.
 *
 * @spec F-DASH-4 (클릭 시 미리보기 오픈), F-DASH-6 (상태 배지·링크)
 *
 * @connects
 *  - components/dashboard/status-badge.tsx  → 상태 배지 표시
 *  - components/dashboard/share-link.tsx    → 공유 링크 복사
 *  - components/dashboard/split-view.tsx    → 클릭 시 스플릿뷰 미리보기 트리거
 *  - types/plan.ts                          → Plan 타입
 */
