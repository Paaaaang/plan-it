/**
 * @file 뷰어 데이터 조회 + 비밀번호 검증 서버 액션
 * @description 공개 뷰어용 일정 데이터 조회, 비공개 비밀번호 검증.
 *              서비스 롤 키를 사용하여 RLS 우회 조회 (slug + status 조건).
 *
 * 'use server'
 *
 * @auth 불필요 (뷰어는 익명 접근)
 *
 * @actions
 *  - getBySlug(slug)              → slug로 일정 전체 데이터 조회 (plan + notices + days + items + places + transport)
 *  - verifyPassword(slug, pw)     → 비공개 비밀번호 검증 → 세션 토큰 발급
 *
 * @connects
 *  - lib/supabase/admin.ts                   → 서비스 롤 클라이언트 (RLS 우회)
 *  - lib/utils/cache.ts                       → Redis 캐시 조회/적재
 *  - app/p/[slug]/page.tsx                    → 뷰어 페이지에서 호출
 *  - components/viewer/password-gate.tsx      → 비밀번호 검증 호출
 *  - types/plan.ts, notice.ts, schedule.ts, place.ts, transport.ts → 반환 타입
 *
 * @cache slug 키로 Redis 조회 → 미스 시 Postgres → 캐시 적재
 * @security 비밀번호 검증은 해시 비교, 시도 횟수 Redis rate-limit
 */
