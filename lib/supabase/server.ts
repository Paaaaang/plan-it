/**
 * @file Supabase 서버 클라이언트
 * @description Server Component, Server Action, Route Handler에서 사용하는 Supabase 클라이언트.
 *              쿠키 기반 세션 관리. RLS 정책이 적용됨.
 *
 * @usage Server Component, actions/*.ts 에서 import하여 사용
 *
 * @connects
 *  - actions/plan-actions.ts      → 일정 CRUD (owner_id = auth.uid() RLS)
 *  - actions/viewer-actions.ts    → 뷰어 데이터 조회 (서비스 롤 또는 제한적 쿼리)
 *  - app/(console)/layout.tsx     → 세션 확인
 *
 * @env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
