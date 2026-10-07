/**
 * @file 교통 안내 CRUD + 순서 변경 서버 액션
 * @description 대중교통/이동 안내(TransportInfo) CRUD.
 *
 * 'use server'
 *
 * @auth 인증 필요 (plan의 owner_id 확인)
 *
 * @actions
 *  - listTransport(planId)                → 교통 안내 목록
 *  - createTransport(planId, data)        → 교통 안내 추가
 *  - updateTransport(id, data)            → 교통 안내 수정
 *  - deleteTransport(id)                  → 교통 안내 삭제
 *  - reorderTransport(planId, orderedIds) → 순서 변경
 *
 * @connects
 *  - src/server/supabase/server.ts                     → Supabase 서버 클라이언트
 *  - src/shared/types/transport.ts                          → TransportInfo 타입
 *  - src/client/components/editor/transport-section.tsx     → 호출 원점
 */
