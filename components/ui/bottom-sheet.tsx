/**
 * @file 모바일 BottomSheet 컴포넌트
 * @description 모바일 환경에서 화면 하단에서 슬라이드 업하는 시트 컴포넌트.
 *              스와이프 다운 또는 배경 탭으로 닫힘.
 *
 * @spec F-DASH-4 (모바일에서 BottomSheet로 미리보기 오픈)
 *
 * @connects
 *  - hooks/use-bottom-sheet.ts              → BottomSheet 열기/닫기 제어
 *  - hooks/use-media-query.ts               → 모바일 여부 판단
 *  - components/dashboard/plan-preview.tsx  → BottomSheet 내부에 미리보기 렌더링
 */
