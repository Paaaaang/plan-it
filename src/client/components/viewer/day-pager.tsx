/**
 * @file 일차 넘기기
 * @description 날짜 머리줄 + 일차마다 한 페이지를 가로로 넘기는 영역. 알약 버튼 대신 점을 두고,
 *              넘기는 동안만 "2일차 · 10.24 금"이 뜬다(랜딩 명세 §8-2, 사용자: "1일차·2일차 뜨는 거 별로,
 *              콤팩트하다가 넘길 때 몇일차인지"). 넘기기는 브라우저 기본 가로 스크롤 + scroll-snap이라
 *              손가락·트랙패드가 그대로 된다.
 *              live면 사용자 스크롤·스냅을 끄고 바깥(랜딩 스크롤 이야기)이 트랙(data-testid="day-track")의
 *              scrollLeft를 움직인다 — 그때도 HUD·머리줄은 같은 scroll 이벤트로 따라온다.
 *
 * @connects
 *  - src/client/components/viewer/viewer-shell.tsx      → 공개 뷰어·편집기 미리보기
 *  - src/client/components/landing/viewer-preview.tsx    → 랜딩 폰(live)
 *  - src/shared/viewer/summary.ts                        → dayLabel
 */

"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { dayLabel } from "@/shared/viewer/summary";
import type { ViewerDay } from "@/shared/types/viewer";

/** 스크롤이 멈추고 이만큼 지나면 HUD를 내린다 */
const HUD_MS = 900;

export function DayPager({
  days,
  renderDay,
  onIndexChange,
  initialIndex = 0,
  live = false,
}: {
  days: ViewerDay[];
  renderDay: (day: ViewerDay, index: number) => ReactNode;
  onIndexChange?: (index: number) => void;
  /** 탭을 오가며 다시 마운트돼도 보던 일차에서 시작하게(ViewerShell이 기억한다) */
  initialIndex?: number;
  live?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [hud, setHud] = useState({ on: false, day: initialIndex });
  const lastLeft = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 시작 일차로 즉시 옮겨 둔다(첫 페인트 전에 — 1일차가 번쩍 보였다 넘어가지 않게)
  useLayoutEffect(() => {
    const el = track.current;
    if (el && initialIndex > 0) {
      el.scrollTo({ left: initialIndex * el.clientWidth, behavior: "instant" });
      lastLeft.current = el.scrollLeft;
    }
    // 마운트 때 한 번만 — 이후 위치는 사용자의 스크롤이 정한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  if (days.length === 0) return null;
  const at = Math.min(index, days.length - 1);
  const day = days[at];

  function handleScroll() {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    // 처음 자리를 옮긴 직후의 scroll 이벤트는 움직임이 아니다 — HUD를 띄우지 않는다
    if (el.scrollLeft === lastLeft.current) return;
    const pos = el.scrollLeft / el.clientWidth;
    const dir = el.scrollLeft - lastLeft.current;
    lastLeft.current = el.scrollLeft;

    // index와 견준다(at이 아니라) — 마지막 일차가 사라지면 at은 이미 near와 같아서, at과 견주면
    // 낡은 index·바깥의 dayIndex(ViewerShell)가 그대로 남는다
    const near = Math.min(days.length - 1, Math.max(0, Math.round(pos)));
    if (near !== index) {
      setIndex(near);
      onIndexChange?.(near);
    }
    // 넘어가는 쪽 일차를 미리 보여 준다 — 손을 떼기 전에 어디로 가는지 알 수 있게
    const to = Math.min(days.length - 1, Math.max(0, dir > 0 ? Math.ceil(pos - 0.05) : Math.floor(pos + 0.05)));
    setHud((h) => (h.on && h.day === to ? h : { on: true, day: to }));
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHud((h) => ({ ...h, on: false })), HUD_MS);
  }

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  const hudDay = days[Math.min(hud.day, days.length - 1)];

  return (
    <div data-testid="day-pager">
      <div data-part="dayhead" className="flex items-center justify-between gap-2 px-5 pb-3 pt-3">
        <p className="flex min-w-0 items-baseline gap-1.5">
          <span className="text-label font-extrabold tabular-nums text-primary">{dayLabel(day.date)}</span>
          <span className="text-caption text-tertiary">{day.items.length}개 일정</span>
        </p>
        {days.length > 1 && (
          <div className="flex flex-none items-center" data-testid="day-dots">
            {days.map((d, i) => (
              <button
                key={d.dayNumber}
                type="button"
                aria-label={`${d.dayNumber}일차`}
                aria-current={i === at ? "true" : undefined}
                onClick={() => go(i)}
                // 점은 6px지만 누르는 자리는 24px 높이로 넓힌다
                className="grid h-6 place-items-center px-0.5"
              >
                <span
                  aria-hidden="true"
                  className={[
                    "block h-1.5 rounded-full transition-[width,background-color] duration-slow ease-planit",
                    i === at ? "w-4 bg-brand" : "w-1.5 bg-neutral-fill",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div data-part="days" className="relative">
        <div
          ref={track}
          data-testid="day-track"
          onScroll={handleScroll}
          className={[
            "flex items-start [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            live ? "overflow-x-hidden" : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          ].join(" ")}
        >
          {days.map((d, i) => (
            <div
              key={d.dayNumber}
              data-testid="day-page"
              data-day-page={i}
              data-current={i === at}
              // 옆 일차는 보이지 않는 동안 탭 순서·스크린리더에서 뺀다
              inert={i !== at}
              aria-hidden={i !== at}
              className="w-full flex-none snap-start"
            >
              {renderDay(d, i)}
            </div>
          ))}
        </div>

        <div
          role="status"
          data-testid="day-hud"
          data-on={hud.on}
          className={[
            "pointer-events-none absolute left-1/2 top-3 z-[3] -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-2",
            "text-label font-extrabold shadow-pop transition-[opacity,scale] duration-base ease-planit",
            hud.on ? "scale-100 opacity-100" : "scale-95 opacity-0",
          ].join(" ")}
          // 반전 색 — 타임라인 위에 떠 있어야 해서 글자색을 바탕으로, 바탕색을 글자로 쓴다
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          {hudDay ? `${hudDay.dayNumber}일차 · ${dayLabel(hudDay.date)}` : ""}
        </div>
      </div>
    </div>
  );
}
