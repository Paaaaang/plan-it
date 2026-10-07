/**
 * @file 공지/업데이트 작성 폼
 * @description 공지/업데이트 콘텐츠의 유형, 제목, 본문, 노출 대상, 예약 배포 시각을 입력하는 폼.
 *
 * @spec F-ADMIN-11 (생성·수정·삭제)
 * @spec F-ADMIN-12 (유형: notice / update)
 * @spec F-ADMIN-13 (상태: draft→published→archived, 예약 배포)
 * @spec F-ADMIN-14 (노출 대상: all / planners 등) — P2
 *
 * @connects
 *  - src/client/components/admin/announcement-list.tsx → 목록에서 편집 클릭 시 열림
 *  - src/server/actions/admin-actions.ts               → create / update / publish
 *  - src/shared/types/announcement.ts                  → Announcement 타입
 *
 * @notes 배포(published)된 콘텐츠는 다음에서 소비:
 *  - src/client/components/landing/announcements-banner.tsx (랜딩페이지)
 */
