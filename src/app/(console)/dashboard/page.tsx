/**
 * @file 대시보드 페이지
 * @route /dashboard
 * @auth 인증 필요
 * @spec F-DASH-1~7
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 — 플랜잇",
  description: "내 일정을 관리하고 공유해요.",
};

export default function DashboardPage() {
  return (
    <div style={{ padding: "var(--space-8) var(--screen-padding)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-8)",
        }}
      >
        <h1
          style={{
            font: "var(--h2-fw) var(--h2-size)/var(--h2-lh) var(--font-sans)",
            letterSpacing: "var(--h2-ls)",
            color: "var(--text-primary)",
          }}
        >
          내 일정
        </h1>
        {/* TODO: components/dashboard/create-plan-button.tsx */}
      </div>

      {/* TODO: 일정 목록 — components/dashboard/plan-list.tsx */}
      {/* TODO: 스플릿뷰 미리보기 — components/dashboard/split-view.tsx */}
      {/* TODO: 모바일 바텀시트 — components/ui/bottom-sheet.tsx */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-20) 0",
          color: "var(--text-tertiary)",
          font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
        }}
      >
        아직 만든 일정이 없어요
      </div>
    </div>
  );
}
