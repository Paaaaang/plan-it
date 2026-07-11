/**
 * @file slug 생성·검증 유틸리티
 * @description 일정 공유용 랜덤 slug 생성, 유일성 검증, 충돌 시 재시도 로직.
 *
 * @spec F-SHARE-1 (랜덤 slug 부여 후 고정)
 * @spec F-SHARE-2 (전역 유일, 충돌 시 재생성 재시도)
 *
 * @connects
 *  - actions/plan-actions.ts                   → create 시 slug 생성
 *  - components/dashboard/create-plan-button.tsx → 새 일정 생성 시 호출
 *
 * @open-issue slug 문자셋·길이(엔트로피)와 커스텀 slug 허용 여부 (PRD §9.2)
 */
