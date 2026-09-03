"use client";

import { ProgressRail } from "@/components/viewer/progress-rail";
import { TimelineItem } from "@/components/viewer/timeline-item";
import { useNow } from "@/hooks/use-now";
import { itemState, railProgress } from "@/lib/viewer/rail";
import type { ViewerDay, ViewerPlace } from "@/types/viewer";

export function Timeline({
  day,
  onOpenPlace,
}: {
  day: ViewerDay;
  onOpenPlace: (place: ViewerPlace) => void;
}) {
  const now = useNow();
  const progress = railProgress(day.items, now, day.date);

  if (day.items.length === 0) {
    return <p className="px-5 py-10 text-center text-label text-tertiary">아직 등록된 일정이 없어요.</p>;
  }

  return (
    <div className="relative mx-5" data-testid="timeline">
      <ProgressRail progress={progress} />
      {day.items.map((item, i) => (
        <TimelineItem
          key={item.id}
          item={item}
          state={itemState(day.items, i, now, day.date)}
          onOpenPlace={onOpenPlace}
        />
      ))}
    </div>
  );
}
