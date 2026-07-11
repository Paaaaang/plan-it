/**
 * @file 일정 CRUD 서버 액션
 * @description 일정(Plan) 생성, 조회, 수정, 삭제, 상태 변경, 비밀번호 설정.
 *
 * 'use server'
 *
 * @auth 인증 필요 — owner_id = auth.uid() (RLS)
 *
 * @actions
 *  - listMyPlans()         → 본인 일정 목록 조회 (F-DASH-1)
 *  - createPlan()          → 빈 draft 생성 + slug 발급 (F-DASH-2, F-SHARE-1)
 *  - getPlan(id)           → 단일 일정 조회
 *  - updatePlan(id, data)  → 일정 수정 (F-EDIT-BASIC-1)
 *  - deletePlan(id)        → 일정 삭제 + cascade (F-DASH-3)
 *  - updateStatus(id, status) → 상태 변경 (F-STATE-2)
 *  - setPassword(id, pw)   → 비공개 비밀번호 설정 (F-STATE-2)
 *
 * @connects
 *  - lib/supabase/server.ts      → Supabase 서버 클라이언트 (RLS 적용)
 *  - lib/utils/slug.ts           → createPlan 시 slug 생성
 *  - lib/utils/cache.ts          → 저장/상태 변경 시 캐시 무효화
 *  - lib/utils/validation.ts     → 공개 전환 시 필수 항목 검증
 *  - types/plan.ts               → Plan 타입
 *  - app/(console)/dashboard/page.tsx            → 대시보드에서 호출
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx → 편집에서 호출
 */
