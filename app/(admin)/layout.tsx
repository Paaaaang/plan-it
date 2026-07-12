/**
 * @file 관리자 콘솔 공통 레이아웃
 * @auth 관리자 권한 필요 — profiles.role='admin'
 * @spec F-ADMIN-1
 */

import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "var(--grey-900)",
          padding: "var(--space-6) var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            textDecoration: "none",
            marginBottom: "var(--space-6)",
          }}
        >
          <Image src="/logos/Logo_White.png" alt="플랜잇" width={28} height={28} />
          <span
            style={{
              font: "var(--title-2-fw) var(--title-2-size)/1 var(--font-sans)",
              color: "var(--text-alt)",
            }}
          >
            관리자 콘솔
          </span>
        </Link>
        <NavItem href="/admin" label="KPI 모니터링" />
        <NavItem href="/admin/moderation" label="콘텐츠 모더레이션" />
        <NavItem href="/admin/announcements" label="공지/업데이트" />
      </aside>

      {/* Main */}
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

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "10px 12px",
        borderRadius: "var(--radius-m)",
        font: "var(--label-m-fw) var(--label-m-size)/1.25 var(--font-sans)",
        color: "var(--grey-300)",
        textDecoration: "none",
        transition: "background var(--dur-fast) var(--ease)",
      }}
    >
      {label}
    </Link>
  );
}
