/**
 * @file Supabase 관리자/서비스 롤 클라이언트
 * @description RLS를 우회하는 서비스 롤 키 기반 클라이언트.
 *              뷰어 데이터 조회(공개 읽기), analytics 이벤트 기록,
 *              관리자 작업(모더레이션/공지) 등 서버 전용 작업에 사용.
 *
 * @security 서버 사이드에서만 사용. 절대 클라이언트에 노출 금지.
 *
 * @connects
 *  - actions/viewer-actions.ts     → getBySlug (서비스 롤로 slug + status 조건 조회)
 *  - actions/analytics-actions.ts  → logEvent (서비스 롤로 이벤트 기록)
 *  - actions/admin-actions.ts      → 관리자 전용 작업
 *
 * @env SUPABASE_SERVICE_ROLE_KEY (서버 전용, NEXT_PUBLIC_ 아님)
 */
