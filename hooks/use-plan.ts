/**
 * @file 일정 데이터 관리 훅
 * @description 일정(Plan) 데이터를 로드하고 상태를 관리하는 커스텀 훅.
 *              편집 페이지에서 일정 전체 데이터(공지/타임테이블/장소 포함)를 관리.
 *
 * @connects
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx → 편집 페이지에서 사용
 *  - actions/plan-actions.ts                           → 일정 데이터 조회
 *  - lib/supabase/client.ts                            → 실시간 구독 (필요 시)
 *  - types/plan.ts, types/notice.ts, types/schedule.ts, types/place.ts → 타입들
 */
