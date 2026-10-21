"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ProgressRail } from "@/client/components/viewer/progress-rail";
import { measureRail } from "@/client/components/viewer/rail-geometry";
import { TimelineItem } from "@/client/components/viewer/timeline-item";
import { useNow } from "@/client/hooks/use-now";
import { itemState } from "@/shared/viewer/rail";
import type { ViewerDay, ViewerPlace } from "@/shared/types/viewer";

export function Timeline({
  day,
  onOpenPlace,
  now: nowProp,
  children,
}: {
  day: ViewerDay;
  onOpenPlace: (place: ViewerPlace) => void;
  /** 주면 이 시각으로 그린다(랜딩 예시 — 서버·브라우저가 같은 시각이어야 수화가 맞는다). 안 주면 지금 */
  now?: Date | null;
  /** 레일 위에 얹을 것(랜딩의 움직이는 '지금' 점) */
  children?: ReactNode;
}) {
  const live = useNow();
  const now = nowProp === undefined ? live : nowProp;
  const ref = useRef<HTMLDivElement>(null);
  const states = day.items.map((_, i) => itemState(day.items, i, now, day.date));
  const stateKey = states.join(",");

  // 점 중심을 재서 레일을 맞춘다. 글꼴이 늦게 오거나 폭이 바뀌면 줄 높이가 달라지므로 다시 잰다.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    measureRail(el);
    const ro = new ResizeObserver(() => measureRail(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, [stateKey, day]);

  if (day.items.length === 0) {
    return <p className="px-5 py-10 text-center text-label text-tertiary">아직 등록된 일정이 없어요.</p>;
  }

  return (
    <div ref={ref} className="relative mx-5" data-testid="timeline">
      <ProgressRail />
      {day.items.map((item, i) => (
        <TimelineItem key={item.id} item={item} state={states[i]} onOpenPlace={onOpenPlace} />
      ))}
      {children}
    </div>
  );
}
