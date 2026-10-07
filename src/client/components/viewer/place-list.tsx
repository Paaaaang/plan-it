/**
 * @file 뷰어 장소 목록
 * @description 장소 탭의 카드 목록. 타임라인과 같은 카드 문법을 쓰되 레일은 없다 —
 *              장소에는 시간 순서가 없다 (스펙 §5.1).
 *
 * @connects
 *  - src/client/components/ui/card.tsx · chip.tsx
 *  - src/shared/types/viewer.ts → ViewerPlace
 */

"use client";

import { Card } from "@/client/components/ui/card";
import { Chip } from "@/client/components/ui/chip";
import type { ViewerPlace } from "@/shared/types/viewer";

export function PlaceList({
  places,
  onOpenPlace,
}: {
  places: ViewerPlace[];
  onOpenPlace: (place: ViewerPlace) => void;
}) {
  if (places.length === 0) {
    return <p className="px-5 py-10 text-center text-label text-tertiary">등록된 장소가 없어요.</p>;
  }
  // 고정 장소를 먼저 보여준다 — 참가자가 가장 자주 찾는 곳이다.
  const sorted = [...places].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  return (
    <div className="mx-5 flex flex-col gap-2.5" data-testid="place-list">
      {sorted.map((p) => (
        <Card key={p.id} interactive onClick={() => onOpenPlace(p)} aria-label={`${p.name} 상세 보기`}>
          <div className="flex items-center gap-1.5">
            {p.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <div className="mt-1.5 text-item-title font-bold tracking-tight">{p.name}</div>
          <div className="mt-0.5 text-caption font-medium text-tertiary">{p.address}</div>
        </Card>
      ))}
    </div>
  );
}
