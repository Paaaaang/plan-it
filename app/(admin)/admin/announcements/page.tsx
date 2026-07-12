/**
 * @file 공지/업데이트 관리 페이지
 * @route /admin/announcements
 * @auth 관리자 권한 필요
 * @spec F-ADMIN-11~15
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지/업데이트 관리 — 플랜잇 관리자",
};

export default function AnnouncementsPage() {
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
        공지/업데이트 관리
      </h1>
      {/* TODO: components/admin/announcement-list.tsx */}
      {/* TODO: components/admin/announcement-form.tsx */}
    </div>
  );
}
