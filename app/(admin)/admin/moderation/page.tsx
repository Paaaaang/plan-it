/**
 * @file 콘텐츠 모더레이션 페이지
 * @route /admin/moderation
 * @auth 관리자 권한 필요
 * @spec F-ADMIN-7~10
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "콘텐츠 모더레이션 — 플랜잇 관리자",
};

export default function ModerationPage() {
  return (
    <div style={{ padding: "var(--space-8) var(--screen-padding)" }}>
      <h1
        style={{
          font: "var(--h2-fw) var(--h2-size)/var(--h2-lh) var(--font-sans)",
          letterSpacing: "var(--h2-ls)",
          color: "var(--text-primary)",
          marginBottom: "var(--space-8)",
        }}
      >
        콘텐츠 모더레이션
      </h1>
      {/* TODO: components/admin/moderation-queue.tsx */}
      {/* TODO: components/admin/moderation-detail.tsx */}
    </div>
  );
}
