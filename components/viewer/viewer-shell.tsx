/**
 * @file 뷰어 셸
 * @description 커버·공지·탭·일차·타임라인·CTA를 조립하는 유일한 클라이언트 경계.
 *              탭/일차/시트 상태를 여기서만 갖는다.
 *
 * @connects
 *  - components/viewer/cover-header.tsx · notice-bar.tsx · timeline.tsx · place-list.tsx · place-sheet.tsx
 *  - components/ui/tabs.tsx · chip.tsx
 *  - lib/viewer/summary.ts → dateLine
 *  - lib/viewer/links.ts   → nextPlace, kakaoDirectionsUrl
 */

"use client";

import { useState } from "react";
import { CoverHeader } from "@/components/viewer/cover-header";
import { NoticeBar } from "@/components/viewer/notice-bar";
import { PlaceList } from "@/components/viewer/place-list";
import { PlaceSheet } from "@/components/viewer/place-sheet";
import { Timeline } from "@/components/viewer/timeline";
import { Chip } from "@/components/ui/chip";
import { Tabs } from "@/components/ui/tabs";
import { kakaoDirectionsUrl, nextPlace } from "@/lib/viewer/links";
import { dateLine } from "@/lib/viewer/summary";
import type { ViewerPlace, ViewerPlan } from "@/types/viewer";

const TABS = [
  { value: "timetable", label: "타임테이블" },
  { value: "places", label: "장소" },
];

export function ViewerShell({ plan }: { plan: ViewerPlan }) {
  const [tab, setTab] = useState("timetable");
  const [dayIndex, setDayIndex] = useState(0);
  const [openPlace, setOpenPlace] = useState<ViewerPlace | null>(null);

  const day = plan.days[dayIndex] ?? plan.days[0];
  const multiDay = plan.days.length > 1;

  function handleOpenPlace(place: ViewerPlace) {
    setOpenPlace(place);
  }

  return (
    <div className="relative mx-auto min-h-dvh max-w-[480px] bg-bg pb-[74px]">
      <CoverHeader plan={plan} />
      <NoticeBar notices={plan.notices} />

      <div className="px-5 pt-4">
        <Tabs items={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "timetable" ? (
        <>
          {multiDay && (
            <div className="flex gap-[7px] px-5 pb-3 pt-3" data-testid="day-chips">
              {plan.days.map((d, i) => (
                <Chip key={d.dayNumber} interactive selected={i === dayIndex} onClick={() => setDayIndex(i)}>
                  {d.dayNumber}일차
                </Chip>
              ))}
            </div>
          )}
          {day && (
            <p className={["px-5 pb-3 text-caption font-semibold text-tertiary", multiDay ? "" : "pt-3"].join(" ")}>
              {dateLine(day.date, day.items.length)}
            </p>
          )}
          {day && <Timeline day={day} onOpenPlace={handleOpenPlace} />}
        </>
      ) : (
        <div className="pt-4">
          <PlaceList places={plan.places} onOpenPlace={handleOpenPlace} />
        </div>
      )}

      {/*
        스크롤 컨테이너(문서)에 CTA 높이(82px)만큼 하단 여백을 준다. 앵커·포커스·
        scrollIntoView로 항목이 화면에 들어올 때 뷰포트 맨 아래에 붙어 CTA 뒤로 숨는 것을 막는다.
        항목 쪽 scroll-margin이 아니라 컨테이너 쪽 scroll-padding이어야 브라우저의 스크롤 경로가
        전부 이 여백을 본다(scroll-margin은 일부 프로그래밍 스크롤 경로에서 무시된다).
        뷰어가 마운트된 동안에만 걸린다 — 다른 서페이스에는 영향이 없다.
      */}
      <style>{`html { scroll-padding-bottom: 96px; }`}</style>

      {/* 하단 고정 CTA. 위에 배경색 페이드를 깔아 스크롤 내용과 분리한다 (스펙 §5.1). */}
      <div
        data-testid="viewer-cta"
        className="sticky bottom-0 mt-4 px-5 pb-[18px] pt-[18px]"
        style={{ background: "linear-gradient(180deg, transparent, var(--bg) 45%)" }}
      >
        <a
          href={kakaoDirectionsUrl(nextPlace(plan, day?.items ?? []))}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-pop bg-brand py-[13px] text-center text-item-title font-extrabold text-on-accent"
        >
          카카오맵으로 길찾기
        </a>
      </div>

      <PlaceSheet place={openPlace} onClose={() => setOpenPlace(null)} />
    </div>
  );
}
