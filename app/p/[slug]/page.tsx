/**
 * @file 공개 뷰어 페이지
 * @route /p/[slug]
 * @auth 불필요 (public) / 비밀번호 (private) / 없음 (draft·만료)
 *
 * 서버에서 뷰어 DTO만 받아 클라이언트 셸에 넘긴다.
 * 조회는 lib/viewer/get-plan.ts를 거친다 — generateMetadata와 페이지가 한 요청에서
 * 같은 slug를 두 번 부르므로 React cache()로 실제 조회를 1회로 접는다.
 * 기획자 전용 필드는 DTO에 아예 없다 — 타입이 유출을 막는다.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Link as LinkIcon } from "lucide-react";
import { getPlan } from "@/lib/viewer/get-plan";
import { ViewerShell } from "@/components/viewer/viewer-shell";
import { PasswordGate } from "@/components/viewer/password-gate";
import { StatusScreen } from "@/components/viewer/status-screen";
import { coverSubline } from "@/lib/viewer/summary";
import { MAX_ATTEMPTS } from "@/lib/fixtures/viewer";

export async function generateMetadata(props: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await getPlan(slug);

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
  const result = await getPlan(slug);

  if (result.status === "notFound") notFound();

  // 잠금 해제 판정은 getBySlug 안에 있다. 여기가 status를 보고 화면만 고른다 —
  // 페이지가 인가를 계산하지 않으므로 분기를 잊어도 게이트가 새지 않는다.
  if (result.status === "locked") {
    return <PasswordGate slug={result.slug} maxAttempts={MAX_ATTEMPTS} />;
  }

  if (result.status === "expired") {
    return (
      <StatusScreen
        glyph={LinkIcon}
        title="만료된 링크예요"
        description="이 일정은 더 이상 열리지 않아요. 공유해준 분에게 새 링크를 받아보세요."
      >
        <Link
          href="/"
          className="mt-2 rounded-btn bg-neutral-fill px-4 py-2.5 text-label font-bold text-primary"
        >
          플랜잇 둘러보기
        </Link>
      </StatusScreen>
    );
  }

  return <ViewerShell plan={result.plan} />;
}
