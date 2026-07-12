/**
 * @file 인증 페이지 공통 레이아웃
 * @description 로그인/회원가입 페이지에 공통 적용되는 레이아웃.
 *              중앙 정렬 카드 + 로고 표시.
 *
 * @connects
 *  - app/(auth)/login/page.tsx
 *  - app/(auth)/signup/page.tsx
 */

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--screen-padding)",
        background: "var(--surface-page)",
      }}
    >
      <Link href="/" style={{ marginBottom: "var(--space-8)" }}>
        <Image
          src="/logos/Logo_Black.png"
          alt="플랜잇"
          width={48}
          height={48}
          priority
        />
      </Link>
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--surface-card)",
          border: "1px solid var(--border-secondary)",
          borderRadius: "var(--radius-2xl)",
          padding: "var(--space-8)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
