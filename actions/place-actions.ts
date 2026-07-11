/**
 * @file 장소 CRUD + 고정 토글 서버 액션
 * @description 장소(Place) 등록, 수정, 삭제, 고정(pinned) 토글.
 *
 * 'use server'
 *
 * @auth 인증 필요 (plan의 owner_id 확인)
 *
 * @actions
 *  - listPlaces(planId)          → 장소 목록 조회
 *  - createPlace(planId, data)   → 장소 등록 (F-EDIT-PLACE-1)
 *  - updatePlace(id, data)       → 장소 수정
 *  - deletePlace(id)             → 장소 삭제 + 연결된 항목 place_id 정리 (F-EDIT-PLACE-5)
 *  - togglePin(id)               → 고정/유동 토글 (F-EDIT-PLACE-2)
 *
 * @connects
 *  - lib/supabase/server.ts                             → Supabase 서버 클라이언트
 *  - lib/utils/cache.ts                                  → 캐시 무효화
 *  - types/place.ts                                      → Place 타입
 *  - components/editor/place/place-section.tsx           → 호출 원점
 *  - components/editor/timetable/place-linker.tsx       → 목록 조회 + 신규 생성
 *
 * @important deletePlace 시 schedule_items.place_id = null 처리 필요
 */
