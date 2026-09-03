/**
 * @file 공개 뷰어 페이지
 * @route /p/[slug]
 * @auth 불필요 (public) / 비밀번호 (private) / 없음 (draft·만료)
 *
 * 서버에서 뷰어 DTO만 받아 클라이언트 셸에 넘긴다.
 * 기획자 전용 필드는 DTO에 아예 없다 — 타입이 유출을 막는다.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBySlug } from "@/actions/viewer-actions";
import { ViewerShell } from "@/components/viewer/viewer-shell";
import { coverSubline } from "@/lib/viewer/summary";

export async function generateMetadata(props: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await getBySlug(slug);

  if (result.status !== "ok") {
    return {
      title: "일정 보기 — 플랜잇",
      description: "링크 하나로 전체 일정을 확인해 보세요. 로그인 없이 바로 열어볼 수 있어요.",
      robots: { index: false },
    };
  }

  const { plan } = result;
  const description = coverSubline(plan.startDate, plan.endDate, plan.partyLabel);
  return {
    title: `${plan.title} — 플랜잇`,
    description,
    // 공유 링크는 검색에 뜨면 안 된다. 링크를 받은 사람만 본다.
    robots: { index: false, follow: false },
    openGraph: {
      title: plan.title,
      description,
      type: "website",
      images: plan.coverImageUrl ? [plan.coverImageUrl] : undefined,
    },
  };
}

export default async function ViewerPage(props: PageProps<"/p/[slug]">) {
  const { slug } = await props.params;
  const result = await getBySlug(slug);

  if (result.status === "notFound") notFound();
  // 임시: locked·expired는 Task 8에서 각자의 화면(비밀번호 게이트·만료 안내)을 붙인다.
  // 그때까지는 404와 같게 둔다 — 공개 경로라 존재 자체를 드러내지 않는 쪽이 안전하다.
  if (result.status !== "ok") notFound();

  return <ViewerShell plan={result.plan} />;
}
