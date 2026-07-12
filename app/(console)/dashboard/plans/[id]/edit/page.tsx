/**
 * @file 편집 페이지
 * @route /dashboard/plans/[id]/edit
 * @auth 인증 필요 + 본인 소유
 * @spec F-EDIT-BASIC, F-EDIT-NOTICE, F-EDIT-TT, F-EDIT-PLACE, F-STATE
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "일정 편집 — 플랜잇",
};

export default async function EditPlanPage(
  props: PageProps<"/dashboard/plans/[id]/edit">
) {
  const { id } = await props.params;

  return (
    <div style={{ padding: "var(--space-8) var(--screen-padding)", maxWidth: 800, margin: "0 auto" }}>
      {/* TopBar */}
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
            font: "var(--h3-fw) var(--h3-size)/var(--h3-lh) var(--font-sans)",
            letterSpacing: "var(--h3-ls)",
            color: "var(--text-primary)",
          }}
        >
          일정 편집
        </h1>
        {/* TODO: components/editor/status-control.tsx */}
      </div>

      {/* 섹션 컴포넌트들 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* TODO: components/editor/basic-info/basic-info-section.tsx */}
        {/* TODO: components/editor/notice/notice-section.tsx */}
        {/* TODO: components/editor/timetable/timetable-section.tsx */}
        {/* TODO: components/editor/place/place-section.tsx */}
        {/* TODO: components/editor/transport-section.tsx */}

        <div
          style={{
            padding: "var(--space-12) 0",
            color: "var(--text-tertiary)",
            textAlign: "center",
            font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
          }}
        >
          일정 ID: {id}
        </div>
      </div>
    </div>
  );
}
