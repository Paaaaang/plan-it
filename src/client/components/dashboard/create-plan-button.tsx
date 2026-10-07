/**
 * @file 새 일정 생성 버튼
 * @description 빈 draft 일정을 생성하고 편집 페이지로 이동하는 버튼.
 *              생성 즉시 slug 발급·고정.
 *
 * @spec F-DASH-2 (새 일정 생성: 빈 draft 생성 후 편집 진입)
 * @spec F-SHARE-1 (일정 생성 시 랜덤 slug 부여 후 고정)
 *
 * @connects
 *  - src/server/actions/plan-actions.ts                            → create (빈 draft 생성)
 *  - lib/utils/slug.ts                                  → slug 생성 로직
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx  → 생성 후 편집 페이지로 이동
 */
