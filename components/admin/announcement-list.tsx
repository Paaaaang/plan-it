/**
 * @file 공지/업데이트 목록
 * @description 플랫폼 공지 및 업데이트 콘텐츠 목록 표시.
 *              상태(draft/published/archived) 필터링.
 *
 * @spec F-ADMIN-11~13 (CRUD, 유형, 상태 관리)
 *
 * @connects
 *  - app/(admin)/admin/announcements/page.tsx  → 공지 관리 페이지에서 렌더링
 *  - components/admin/announcement-form.tsx     → 새 공지 작성 또는 편집
 *  - actions/admin-actions.ts                   → list / publish / archive / delete
 *  - types/announcement.ts                      → Announcement 타입
 */
