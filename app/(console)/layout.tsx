/**
 * @file 기획자 콘솔 공통 레이아웃
 * @description 통과용 껍데기다. 편집기(`ed-light.png`)에는 사이드바가 없고 자체 상단 바가
 *              전폭을 쓴다 — 사이드바는 대시보드(4단계)의 것이라 그때 대시보드 라우트에 붙인다.
 *              여기 있던 사이드바는 1단계에서 사라진 토큰(--surface-card·--border-secondary·
 *              --surface-page·--title-1-fw)을 참조하고 있었다. 죽은 이름과 함께 걷어냈다.
 * @auth 인증 필요 — proxy.ts에서 비인증 사용자 리다이렉트
 * @spec F-AUTH-2
 */

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-bg">{children}</div>;
}
