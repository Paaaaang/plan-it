/**
 * @file 반응형 미디어 쿼리 훅
 * @description 데스크톱/모바일 등 화면 크기를 감지하는 커스텀 훅.
 *              SplitView(데스크톱) vs BottomSheet(모바일) 분기에 사용.
 *
 * @connects
 *  - app/(console)/dashboard/page.tsx       → 대시보드 미리보기 분기
 *  - components/dashboard/split-view.tsx    → 데스크톱 여부 판단
 *  - components/ui/bottom-sheet.tsx         → 모바일 여부 판단
 */
