/**
 * @file 인증 페이지 공통 레이아웃
 * @description 로그인/회원가입 페이지에 공통으로 적용되는 레이아웃.
 *              인증 페이지 전용 UI (로고, 중앙 정렬 카드 등)를 제공한다.
 *
 * @connects
 *  - app/(auth)/login/page.tsx   → 로그인 페이지
 *  - app/(auth)/signup/page.tsx  → 회원가입 페이지
 *
 * @notes
 *  - 이미 로그인된 사용자는 middleware.ts에서 대시보드로 리다이렉트 처리.
 *  - 루트 layout.tsx 하위로 중첩됨.
 */
