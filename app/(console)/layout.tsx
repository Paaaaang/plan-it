/**
 * @file 기획자 콘솔 공통 레이아웃
 * @description 대시보드·편집 페이지의 공통 레이아웃. 좌측 내비 + 상단 헤더.
 * @auth 인증 필요 — middleware.ts에서 비인증 사용자 리다이렉트
 * @spec F-AUTH-2
 */

import Image from "next/image";
import Link from "next/link";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar — 데스크톱 전용 */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--surface-card)",
          borderRight: "1px solid var(--border-secondary)",
          padding: "var(--space-6) var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            textDecoration: "none",
            marginBottom: "var(--space-4)",
          }}
        >
          <Image src="/logos/Logo_Black.png" alt="플랜잇" width={32} height={32} />
          <span
            style={{
              font: "var(--title-1-fw) var(--title-1-size)/1 var(--font-sans)",
              color: "var(--text-primary)",
              letterSpacing: "var(--title-1-ls)",
            }}
          >
            플랜잇
          </span>
        </Link>
        {/* TODO: 내비게이션 메뉴 항목 (대시보드, 설정 등) */}
        {/* TODO: 하단 사용자 정보 + 로그아웃 */}
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          background: "var(--surface-page)",
          overflow: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
