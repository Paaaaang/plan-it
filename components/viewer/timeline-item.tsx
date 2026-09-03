"use client";

import { Card } from "@/components/ui/card";
import type { ViewerItem, ViewerPlace } from "@/types/viewer";

export type ItemState = "past" | "current" | "future";

export function TimelineItem({
  item,
  state,
  onOpenPlace,
}: {
  item: ViewerItem;
  state: ItemState;
  onOpenPlace: (place: ViewerPlace) => void;
}) {
  const past = state === "past";
  const current = state === "current";

  return (
    <div className="relative mb-2.5 flex items-start gap-2.5" data-testid="timeline-row" data-state={state}>
      <div
        className={[
          "w-[38px] pt-3.5 text-right text-caption font-extrabold tabular-nums",
          current ? "text-brand" : "text-tertiary",
          past ? "opacity-45" : "",
        ].join(" ")}
      >
        {item.startTime}
      </div>

      <div
        aria-hidden="true"
        data-testid="timeline-dot"
        className={[
          "relative z-[1] mt-4 h-[11px] w-[11px] flex-none rounded-full border-2",
          past || current ? "border-brand bg-brand" : "border-strong bg-surface",
        ].join(" ")}
        style={current ? { boxShadow: "0 0 0 4px var(--accent-ring)" } : undefined}
      />

      <Card
        interactive={!!item.place}
        onClick={item.place ? () => onOpenPlace(item.place!) : undefined}
        aria-label={item.place ? `${item.activityName} — 장소 보기` : undefined}
        className={[
          "flex-1",
          // Card는 기본 테두리가 없다(components/ui/card.tsx 확인). current에서 1.5px 테두리를
          // 더하면 height:auto 박스는 border-box여도 상하로 3px 자라난다 — -m-[1.5px]로 상쇄해
          // 레일·다음 행 위치가 흔들리지 않게 한다.
          current ? "border-[1.5px] border-accent-border -m-[1.5px]" : "",
        ].join(" ")}
      >
        <div className={["text-item-title font-bold tracking-tight", past ? "opacity-45" : ""].join(" ")}>
          {item.activityName}
        </div>
        {item.place ? (
          <div className="mt-0.5 text-caption font-medium text-tertiary">{item.place.name}</div>
        ) : (
          <div className="mt-0.5 text-caption font-medium text-tertiary">장소 미연결</div>
        )}
        {item.memo && <p className="mt-1.5 text-caption text-secondary">{item.memo}</p>}
      </Card>
    </div>
  );
}
