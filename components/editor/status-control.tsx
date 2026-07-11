/**
 * @file 상태 설정 컴포넌트
 * @description 일정 상태(draft/public/private) 전환 UI.
 *              private 선택 시 비밀번호 설정/변경 폼 표시.
 *              공개 전환 시 필수 항목(제목/시작일/종료일) 검증.
 *
 * @spec F-STATE-1~4 (상태 3종, 전환 UI, 비밀번호, 캐시 무효화)
 *
 * @connects
 *  - actions/plan-actions.ts       → updateStatus / setPassword
 *  - lib/utils/validation.ts       → 공개 전환 시 필수 항목 검증
 *  - lib/utils/cache.ts            → 상태 변경 시 캐시 무효화 트리거
 *  - components/ui/modal.tsx       → 상태 변경 확인 다이얼로그
 *  - types/plan.ts                 → Plan.status, Plan.password_hash
 */
