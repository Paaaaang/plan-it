/**
 * @file 대시보드 페이지
 * @description 기획자의 일정 목록을 관리하는 메인 대시보드.
 *              일정 목록 조회(CRUD), 스플릿뷰/바텀시트 미리보기, 상태 관리, 공유 링크 확인.
 *
 * @route /dashboard
 * @auth 인증 필요
 * @spec F-DASH-1~7 (일정 목록 CRUD, 미리보기, 상태 배지, 링크 복사)
 *
 * @connects
 *  - actions/plan-actions.ts                            → 일정 목록 조회, 생성, 삭제
 *  - components/dashboard/plan-list.tsx                  → 일정 목록 컨테이너
 *  - components/dashboard/split-view.tsx                 → 데스크톱 우측 스플릿뷰
 *  - components/dashboard/plan-preview.tsx               → 미리보기 렌더링
 *  - components/ui/bottom-sheet.tsx                      → 모바일 바텀시트
 *  - hooks/use-media-query.ts                            → 데스크톱/모바일 분기
 *  - app/(console)/dashboard/plans/[id]/edit/page.tsx   → 편집 페이지로 이동
 *  - types/plan.ts                                       → Plan 타입
 */
