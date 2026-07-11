/**
 * @file 비공개 비밀번호 입력 게이트
 * @description private 상태 일정에 접근 시 비밀번호를 입력받는 게이트 화면.
 *              서버 검증 → 통과 시 뷰어 렌더링, 실패 시 재시도(rate-limit).
 *
 * @spec F-VIEW-1 (private: 암호 통과 후 열람)
 *
 * @connects
 *  - actions/viewer-actions.ts  → verifyPassword (서버 검증)
 *  - components/ui/input.tsx    → 비밀번호 입력 필드
 *  - lib/supabase/server.ts     → Redis rate-limit 연동 (서버 사이드)
 *
 * @notes
 *  - 비밀번호 검증은 서버에서 해시 비교
 *  - 통과 시 단기 세션 토큰(Redis) 발급
 *  - 다회 실패 시 rate-limit 적용 (Redis 카운터)
 */
