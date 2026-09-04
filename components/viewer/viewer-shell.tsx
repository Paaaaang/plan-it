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

import { useId, useState } from "react";
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
