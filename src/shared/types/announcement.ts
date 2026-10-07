/**
 * @file Announcement (플랫폼 공지/업데이트) 타입 정의
 * @description announcements 테이블에 대응하는 TypeScript 타입.
 *
 * @table announcements
 * @fields id, type ('notice'|'update'), title, body,
 *         status ('draft'|'published'|'archived'),
 *         audience ('all'|'planners'), publish_at, created_by, created_at, updated_at
 *
 * @used-by
 *  - src/server/actions/admin-actions.ts                          → CRUD + publish + archive
 *  - src/client/components/admin/announcement-list.tsx            → 관리자 목록
 *  - src/client/components/admin/announcement-form.tsx            → 관리자 폼
 *  - src/client/components/landing/announcements-banner.tsx       → 랜딩페이지 노출
 */
