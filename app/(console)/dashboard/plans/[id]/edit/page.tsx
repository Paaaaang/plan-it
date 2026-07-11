/**
 * @file 편집 페이지
 * @description 일정을 섹션 컴포넌트 단위로 편집하는 페이지.
 *              기본 정보 / 공지 / 타임테이블 / 장소 4개 섹션으로 구성.
 *              각 섹션은 독립적으로 편집·저장된다.
 *
 * @route /dashboard/plans/[id]/edit
 * @auth 인증 필요 + 본인 소유 일정만 접근 (F-AUTH-3, RLS)
 * @spec F-EDIT-BASIC, F-EDIT-NOTICE, F-EDIT-TT, F-EDIT-PLACE, F-STATE
 *
 * @connects
 *  - components/editor/editor-layout.tsx                → 편집 페이지 전체 레이아웃
 *  - components/editor/basic-info/basic-info-section.tsx → 기본 정보 섹션
 *  - components/editor/notice/notice-section.tsx         → 공지 섹션
 *  - components/editor/timetable/timetable-section.tsx   → 타임테이블 섹션
 *  - components/editor/place/place-section.tsx           → 장소 섹션
 *  - components/editor/transport-section.tsx             → 대중교통 안내 섹션
 *  - components/editor/status-control.tsx                → 상태 설정 (draft/public/private)
 *  - actions/plan-actions.ts                             → 일정 데이터 조회
 *  - hooks/use-plan.ts                                   → 일정 데이터 관리 훅
 *  - types/plan.ts, types/notice.ts, types/schedule.ts, types/place.ts → 타입들
 */
