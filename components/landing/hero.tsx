/**
 * @file 랜딩 히어로 섹션
 * @description 서비스 한 줄 정의와 주요 CTA(시작하기/로그인)를 포함하는 히어로 영역.
 *              로그인 상태면 CTA를 "대시보드로 이동"으로 전환.
 *
 * @spec F-LAND-1 (히어로: 제품 한 줄 정의 + 주요 CTA)
 * @spec F-LAND-6 (로그인 상태면 CTA 전환)
 *
 * @connects
 *  - hooks/use-auth.ts             → 로그인 상태 확인 (CTA 분기)
 *  - app/(auth)/login/page.tsx     → 로그인 CTA 링크. 가입이 따로 없다 — "시작하기"도
 *                                     같은 카카오 로그인으로 보낸다(signup 라우트는
 *                                     renewal/auth에서 지워졌다)
 *  - app/(console)/dashboard/      → 대시보드 CTA 링크 (로그인 시)
 */
