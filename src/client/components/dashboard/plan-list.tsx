/**
 * @file 일정 목록 컨테이너
 * @description 기획자의 일정 목록을 렌더링하는 컨테이너 컴포넌트.
 *              정렬/필터(상태·최근 수정순) 기능 포함.
 *
 * @spec F-DASH-1 (본인 일정 목록 조회), F-DASH-7 (정렬/필터)
 *
 * @connects
 *  - src/client/components/dashboard/plan-list-item.tsx  → 개별 일정 항목 렌더링
 *  - src/client/components/dashboard/create-plan-button.tsx → 새 일정 생성 버튼
 *  - src/server/actions/plan-actions.ts                   → 일정 목록 조회 (list)
 *  - src/shared/types/plan.ts                             → Plan 타입
 */
