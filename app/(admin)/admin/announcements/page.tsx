/**
 * @file 공지/업데이트 관리 페이지
 * @description 플랫폼 공지 및 업데이트 콘텐츠를 생성, 수정, 배포, 보관하는 관리 페이지.
 *              draft → published → archived 상태 관리, 예약 배포 지원.
 *
 * @route /admin/announcements
 * @auth 관리자 권한 필요
 * @spec F-ADMIN-11~15 (공지/업데이트 CRUD, 상태관리, 예약배포, 노출대상)
 *
 * @connects
 *  - components/admin/announcement-list.tsx  → 공지/업데이트 목록
 *  - components/admin/announcement-form.tsx  → 공지/업데이트 작성/수정 폼
 *  - actions/admin-actions.ts               → create/update/delete/publish/archive
 *  - types/announcement.ts                  → Announcement 타입
 *
 * @notes
 *  - 배포(published)된 공지는 랜딩페이지 및 콘솔에 반영됨.
 *    → components/landing/announcements-banner.tsx 에서 소비
 */
