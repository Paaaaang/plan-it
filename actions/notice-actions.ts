/**
 * @file 공지 CRUD + 순서 변경 서버 액션
 * @description 공지(Notice) 추가, 수정, 삭제, 순서 변경.
 *
 * 'use server'
 *
 * @auth 인증 필요 (plan의 owner_id 확인)
 *
 * @actions
 *  - listNotices(planId)               → 공지 목록 조회
 *  - createNotice(planId, data)        → 공지 추가 (F-EDIT-NOTICE-1)
 *  - updateNotice(id, data)            → 공지 수정
 *  - deleteNotice(id)                  → 공지 삭제
 *  - reorderNotices(planId, orderedIds) → 순서 변경 (F-EDIT-NOTICE-3)
 *
 * @connects
 *  - lib/supabase/server.ts                          → Supabase 서버 클라이언트
 *  - lib/utils/cache.ts                               → 저장 시 캐시 무효화
 *  - types/notice.ts                                  → Notice 타입
 *  - components/editor/notice/notice-section.tsx      → 호출 원점
 *  - components/editor/notice/sortable-notice-list.tsx → reorder 호출
 */
