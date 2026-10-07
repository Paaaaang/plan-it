/**
 * @file 우측 스플릿뷰 (데스크톱)
 * @description 데스크톱 환경에서 목록 우측에 플로팅되는 미리보기 패널.
 *              다른 항목 클릭 시 패널 내용만 교체됨.
 *
 * @spec F-DASH-4 (데스크톱: 우측 스플릿뷰 미리보기)
 * @spec F-DASH-5 (미리보기에서 "편집" 진입 CTA)
 *
 * @connects
 *  - src/client/components/dashboard/plan-preview.tsx   → 내부에 미리보기 콘텐츠 렌더링
 *  - src/client/hooks/use-media-query.ts                → 데스크톱 여부 (모바일이면 BottomSheet 사용)
 */
