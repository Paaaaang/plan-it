/**
 * @file Profile (사용자) 타입 정의
 * @description profiles 테이블에 대응하는 TypeScript 타입. Supabase auth.users 확장.
 *
 * @table profiles
 * @fields id (FK auth.users), display_name, role ('member'|'admin'), created_at
 *
 * @used-by
 *  - src/client/hooks/use-auth.ts           → 인증 상태 관리
 *  - app/(admin)/layout.tsx      → role='admin' 검증
 *  - proxy.ts                    → 권한 기반 라우팅
 */
