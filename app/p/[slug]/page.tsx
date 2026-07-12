/**
 * @file 공개 뷰어 페이지
 * @route /p/[slug]
 * @auth 불필요 (public) / 비밀번호 (private) / 비노출 (draft)
 * @spec F-VIEW-1~7, F-SHARE-3~5
 * @seo OG/트위터 메타 서버 렌더 — generateMetadata
 * @cache ISR + CDN 엣지 캐싱
 */

import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/p/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;

  // TODO: actions/viewer-actions.ts → getBySlug(slug) 로 실제 데이터 조회
  return {
    title: `일정 보기 — 플랜잇`,
    description: "링크 하나로 전체 일정을 확인해 보세요. 로그인 없이 바로 열어볼 수 있어요.",
    openGraph: {
      title: "일정 보기 — 플랜잇",
      description: "링크 하나로 전체 일정을 확인해 보세요.",
      type: "website",
    },
  };
}

export default async function ViewerPage(
  props: PageProps<"/p/[slug]">
) {
  const { slug } = await props.params;

  // TODO: actions/viewer-actions.ts → getBySlug(slug)
  // TODO: 상태 분기 — draft: 404, private: 비밀번호 게이트, public: 뷰어 렌더링
  // TODO: actions/analytics-actions.ts → logEvent(plan_viewed)

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100dvh",
        background: "var(--surface-card)",
      }}
    >
      {/* TODO: components/viewer/viewer-header.tsx */}
      {/* TODO: components/viewer/viewer-notice.tsx */}
      {/* TODO: components/viewer/viewer-timetable.tsx */}
      {/* TODO: components/viewer/viewer-directions.tsx */}
      {/* TODO: components/viewer/viewer-transport.tsx */}

      <div
        style={{
          padding: "var(--space-20) var(--screen-padding)",
          textAlign: "center",
          color: "var(--text-tertiary)",
          font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
        }}
      >
        뷰어 slug: {slug}
      </div>
    </div>
  );
}
