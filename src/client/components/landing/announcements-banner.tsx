/**
 * @file 배포된 공지/업데이트 노출 배너
 * @description 관리자가 배포(published)한 공지/업데이트를 랜딩페이지에 표시하는 배너.
 *
 * @spec F-LAND-4 (배포된 플랫폼 공지/업데이트 노출 영역) — P1
 *
 * @connects
 *  - src/server/actions/viewer-actions.ts (또는 별도 조회)  → announcements listPublished
 *  - src/shared/types/announcement.ts                        → Announcement 타입
 *
 * @data announcements 테이블 (status='published') 조회
 */
