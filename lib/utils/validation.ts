/**
 * @file 입력값 검증 규칙
 * @description 일정 공개 전환 시 필수 항목 검증, 비밀번호 형식 검증 등.
 *
 * @spec 기능명세서 §5 (공개 전환: title·start_date·end_date 필수)
 *
 * @connects
 *  - components/editor/status-control.tsx              → 공개 전환 시 검증
 *  - components/editor/basic-info/basic-info-section.tsx → 입력 필드 검증
 *  - actions/plan-actions.ts                            → 서버 사이드 검증
 */
