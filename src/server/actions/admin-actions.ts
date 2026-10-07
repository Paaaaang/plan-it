/**
 * @file 관리자 전용 서버 액션
 * @description KPI 집계, 모더레이션, 공지/업데이트 관리.
 *              role='admin' 서버 인가 재검증 (클라이언트 신뢰 금지).
 *
 * 'use server'
 *
 * @auth 관리자 권한 필요 (profiles.role='admin')
 *
 * @actions
 *  KPI:
 *  - getSummary(period)          → KPI 집계 (주간 생성/전환율/조회수/클릭률)
 *
 *  모더레이션:
 *  - listFlags(status?)          → 신고/자동 탐지 대기열 조회 (F-ADMIN-7)
 *  - reviewFlag(id, newStatus)   → 상태 처리: reviewing/resolved/hidden (F-ADMIN-8)
 *  - hidePlan(planId)            → 숨김 처리: 뷰어 비노출 + 캐시 무효화 (F-ADMIN-9)
 *
 *  공지/업데이트:
 *  - createAnnouncement(data)    → 공지/업데이트 생성 (F-ADMIN-11)
 *  - updateAnnouncement(id, data) → 수정
 *  - deleteAnnouncement(id)       → 삭제
 *  - publishAnnouncement(id)      → 배포 (F-ADMIN-13)
 *  - archiveAnnouncement(id)      → 보관
 *
 * @connects
 *  - src/server/supabase/server.ts  → 세션 + role 확인
 *  - src/server/supabase/admin.ts   → 서비스 롤 클라이언트 (집계/쓰기)
 *  - lib/utils/cache.ts      → hidePlan 시 캐시 무효화
 *  - src/shared/types/analytics.ts      → KPI 집계 타입
 *  - src/shared/types/moderation.ts     → ModerationFlag 타입
 *  - src/shared/types/announcement.ts   → Announcement 타입
 *  - app/(admin)/admin/*     → 관리자 페이지에서 호출
 */
