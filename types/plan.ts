/**
 * @file Plan (일정) 타입 정의
 * @description plans 테이블에 대응하는 TypeScript 타입.
 *
 * @table plans
 * @fields id, owner_id, type, title, description, start_date, end_date,
 *         status ('draft'|'public'|'private'), password_hash, slug,
 *         cover_image_url, created_at, updated_at
 *
 * @used-by
 *  - actions/plan-actions.ts        → CRUD 반환 타입
 *  - components/dashboard/*         → 목록/미리보기
 *  - components/editor/*            → 편집 데이터
 *  - components/viewer/*            → 뷰어 데이터
 *  - hooks/use-plan.ts              → 데이터 관리
 */
