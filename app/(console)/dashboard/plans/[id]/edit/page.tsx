/**
 * @file 편집 페이지
 * @route /dashboard/plans/[id]/edit
 * @auth 인증 필요 + 본인 소유 — 세션 없으면 verifySession()이 /login으로 보낸다.
 *       사용자 JWT로 읽으므로 RLS가 남의 일정을 걸러낸다(없는 일정과 남의 일정이 같은 404).
 * @spec F-EDIT-BASIC, F-EDIT-NOTICE, F-EDIT-TT, F-EDIT-PLACE, F-STATE
 *
 * `[id]` 세그먼트에 **slug를 넣는다.** 지금 식별자는 픽스처의 slug 하나뿐이고
 * 뷰어(`/p/[slug]`)와 같은 키로 스토어를 읽는다. DB가 붙으면 여기서 id → slug 조회를
 * 한 번 거치도록 바꾼다 — 라우트 모양은 그대로 둘 수 있다.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { createServerClient } from "@/lib/supabase/server";
import { getPlan, getPlanStatus } from "@/lib/store/plans";
import { EditorShell } from "@/components/editor/editor-shell";
import { SectionShell } from "@/components/editor/section-shell";
import { BasicInfoSection } from "@/components/editor/basic-info-section";
import { NoticeSection } from "@/components/editor/notice-section";
import { TimetableSection } from "@/components/editor/timetable-section";
import { PlaceSection } from "@/components/editor/place-section";

export const metadata: Metadata = {
  title: "일정 편집 — 플랜잇",
};

export default async function EditPlanPage(props: PageProps<"/dashboard/plans/[id]/edit">) {
  const { id } = await props.params;

  // 세션이 없으면 /login으로 보낸다. proxy의 낙관적 검사는 보증이 아니다.
  await verifySession();

  // 사용자 JWT로 읽는다 — RLS가 남의 일정을 안 보여준다. 그래서 "없는 일정"과
  // "남의 일정"이 같은 404가 된다(소유 여부를 알려주지 않는다).
  const db = await createServerClient();
  const plan = await getPlan(db, id);
  if (!plan) notFound();
  // 스토어에 일정이 있으면 상태도 있다. 없다면 아직 공개된 적 없는 것으로 본다.
  const status = (await getPlanStatus(db, id)) ?? "draft";

  return (
    <EditorShell plan={plan} status={status}>
      <SectionShell number={1} title="기본 정보">
        <BasicInfoSection plan={plan} />
      </SectionShell>
      <SectionShell number={2} title="공지" count={`${plan.notices.length}개`}>
        <NoticeSection notices={plan.notices} />
      </SectionShell>
      {/*
        3번은 껍데기를 자기가 그린다 — 헤더 카운트에 **고른 일차**가 들어가고 그건
        클라이언트 상태다(timetable-section.tsx 참고).
      */}
      <TimetableSection days={plan.days} places={plan.places} />
      <SectionShell number={4} title="장소" count={`${plan.places.length}개`}>
        {/* days를 같이 넘긴다 — 장소를 지울 때 끊기는 연결이 몇 개인지 세어 알려준다. */}
        <PlaceSection places={plan.places} days={plan.days} />
      </SectionShell>
    </EditorShell>
  );
}
