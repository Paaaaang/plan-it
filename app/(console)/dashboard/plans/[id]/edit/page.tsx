/**
 * @file 편집 페이지
 * @route /dashboard/plans/[id]/edit
 * @auth 인증 필요 + 본인 소유 — proxy.ts가 아직 스텁이다(TODO(auth)).
 * @spec F-EDIT-BASIC, F-EDIT-NOTICE, F-EDIT-TT, F-EDIT-PLACE, F-STATE
 *
 * `[id]` 세그먼트에 **slug를 넣는다.** 지금 식별자는 픽스처의 slug 하나뿐이고
 * 뷰어(`/p/[slug]`)와 같은 키로 스토어를 읽는다. DB가 붙으면 여기서 id → slug 조회를
 * 한 번 거치도록 바꾼다 — 라우트 모양은 그대로 둘 수 있다.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlan, getPlanStatus } from "@/lib/store/plans";
import { EditorShell } from "@/components/editor/editor-shell";
import { SectionShell } from "@/components/editor/section-shell";

export const metadata: Metadata = {
  title: "일정 편집 — 플랜잇",
};

export default async function EditPlanPage(props: PageProps<"/dashboard/plans/[id]/edit">) {
  const { id } = await props.params;

  const plan = getPlan(id);
  if (!plan) notFound();
  // 스토어에 일정이 있으면 상태도 있다. 없다면 아직 공개된 적 없는 것으로 본다.
  const status = getPlanStatus(id) ?? "draft";

  const firstDay = plan.days[0];

  return (
    <EditorShell plan={plan} status={status}>
      {/* 각 섹션의 알맹이는 뒤 태스크가 채운다. 지금은 셸과 상단 바까지다. */}
      <SectionShell number={1} title="기본 정보" />
      <SectionShell number={2} title="공지" count={`${plan.notices.length}개`} />
      <SectionShell
        number={3}
        title="타임테이블"
        count={firstDay ? `1일차 · ${firstDay.items.length}개` : "0개"}
      />
    </EditorShell>
  );
}
