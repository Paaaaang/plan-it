/**
 * @file Supabase 미들웨어 클라이언트
 * @description Next.js 미들웨어에서 사용하는 Supabase 클라이언트.
 *              request/response 쿠키를 통한 세션 갱신 처리.
 *
 * @connects
 *  - middleware.ts → Next.js 미들웨어에서 세션 확인 및 갱신
 *
 * @env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
