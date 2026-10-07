/**
 * @file 하단 CTA 섹션
 * @description 랜딩페이지 하단에 위치한 행동 유도 섹션.
 *              가입/시작 또는 로그인으로 유도.
 *
 * @connects
 *  - hooks/use-auth.ts             → 로그인 상태 확인
 *  - app/(auth)/login/page.tsx     → 시작하기·로그인 둘 다 같은 카카오 로그인으로 보낸다
 *                                     (signup 라우트는 renewal/auth에서 지워졌다)
 */
