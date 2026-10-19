/**
 * @file 뷰어 셸
 * @description 커버·공지·탭·일차·타임라인·CTA를 조립하는 유일한 클라이언트 경계.
 *              탭/일차/시트 상태를 여기서만 갖는다.
 *
 * @connects
 *  - src/client/components/viewer/cover-header.tsx · notice-bar.tsx · timeline.tsx · place-list.tsx · place-sheet.tsx
 *  - src/client/components/ui/tabs.tsx · chip.tsx
 *  - src/shared/viewer/summary.ts → dateLine
 *  - src/shared/viewer/links.ts   → nextPlace, kakaoDirectionsUrl
 */

"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CoverHeader } from "@/client/components/viewer/cover-header";
import { NoticeBar } from "@/client/components/viewer/notice-bar";
import { PlaceList } from "@/client/components/viewer/place-list";
import { PlaceSheet } from "@/client/components/viewer/place-sheet";
import { Timeline } from "@/client/components/viewer/timeline";
import { Chip } from "@/client/components/ui/chip";
import { Tabs } from "@/client/components/ui/tabs";
import { kakaoDirectionsUrl, nextPlace } from "@/shared/viewer/links";
import { dateLine } from "@/shared/viewer/summary";
import type { ViewerPlace, ViewerPlan } from "@/shared/types/viewer";

const TABS = [
  { value: "timetable", label: "타임테이블" },
  { value: "places", label: "장소" },
];

export function ViewerShell({ plan, showLandingLink = false }: { plan: ViewerPlan; showLandingLink?: boolean }) {
  const [tab, setTab] = useState("timetable");
  const [dayIndex, setDayIndex] = useState(0);
  const [openPlace, setOpenPlace] = useState<ViewerPlace | null>(null);

  // tab↔tabpanel 연결(APG tabs 패턴)에 쓰는 id. 인스턴스마다 고유해야 해서 useId.
  const idBase = useId();
  const timetableTabId = `${idBase}-tab-timetable`;
  const placesTabId = `${idBase}-tab-places`;
  const timetablePanelId = `${idBase}-panel-timetable`;
  const placesPanelId = `${idBase}-panel-places`;
  const tabItems = [
    { ...TABS[0]!, id: timetableTabId, panelId: timetablePanelId },
    { ...TABS[1]!, id: placesTabId, panelId: placesPanelId },
  ];

  const day = plan.days[dayIndex] ?? plan.days[0];
  const multiDay = plan.days.length > 1;

  function handleOpenPlace(place: ViewerPlace) {
    setOpenPlace(place);
  }

  return (
    // 높이는 부모가 준다(app/p/layout.tsx). 셸이 `min-h-dvh`로 브라우저 뷰포트를
    // 재면 3단계의 344px 폰 프레임 미리보기에서 프레임을 뚫는다.
    <div className="relative mx-auto w-full grow max-w-[480px] bg-bg">
      <CoverHeader plan={plan} />
      <NoticeBar notices={plan.notices} />

      <div className="px-5 pt-4">
        <Tabs items={tabItems} value={tab} onChange={setTab} />
      </div>

      {tab === "timetable" ? (
        <div id={timetablePanelId} role="tabpanel" aria-labelledby={timetableTabId} tabIndex={0}>
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
        </div>
      ) : (
        <div id={placesPanelId} role="tabpanel" aria-labelledby={placesTabId} tabIndex={0} className="pt-4">
          <PlaceList places={plan.places} onOpenPlace={handleOpenPlace} />
        </div>
      )}

      {/* 바이럴 루프 — 랜딩 명세 §9-1 viewer_to_landing_click. 기획자 데이터는 싣지 않는다. */}
      {showLandingLink && (
        <Link
          href="/?utm_source=viewer&utm_medium=share_link"
          className="mx-5 mt-10 block text-center text-caption text-tertiary underline-offset-2 hover:underline"
        >
          나도 플랜잇으로 모임 만들기
        </Link>
      )}

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

      <PlaceSheet place={openPlace} transport={plan.transport} onClose={() => setOpenPlace(null)} />
    </div>
  );
}
