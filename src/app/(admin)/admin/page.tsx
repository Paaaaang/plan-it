/**
 * @file 관리자 대시보드 — KPI 모니터링
 * @route /admin
 * @auth 관리자 권한 필요
 * @spec F-ADMIN-2~6
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KPI 모니터링 — 플랜잇 관리자",
};

export default function AdminDashboardPage() {
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
        운영 KPI
      </h1>

      {/* KPI 위젯 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {/* TODO: components/admin/kpi-widget.tsx × 4 */}
        {/* 주간 생성 수, 공유 전환율, 평균 조회수, 실용 액션 클릭률 */}
      </div>
    </div>
  );
}
