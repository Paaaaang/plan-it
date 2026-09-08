"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

/**
 * @file 순서를 바꿀 수 있는 목록
 * @description 공지·타임테이블·장소 **세 섹션이 전부 이걸 쓴다.** 행 껍데기(그립 + 배경)는
 *              여기가 그리고, 알맹이는 `renderItem`이 그린다 — 세 곳의 행 모양이 같기 때문이다
 *              (확정 시안의 `.nrow`·`.ttrow`는 같은 규칙이다).
 *
 * ## 키보드가 기준선이다
 *
 * 정렬을 마우스로만 할 수 있으면 접근성 위반이다. 그래서 그립은 `<button>`이고,
 * 초점이 있을 때 위/아래 화살표가 그 행을 한 칸 옮긴다. **양 끝에서 순환하지 않는다** —
 * 정렬은 탭 이동과 달라서 감기면 "한 칸 더" 누르다 맨 끝으로 날아간다.
 * 옮긴 뒤 초점은 그 행의 그립에 남는다(행을 `key={id}`로 그리므로 DOM 노드가 그대로
 * 옮겨가고, 초점도 노드를 따라간다 — 다시 focus()를 부르지 않는다).
 *
 * ## 낙관적 갱신
 *
 * 먼저 화면을 바꾸고 서버에 보낸다. 거부되면 직전 순서로 되돌린다 — 이유는 부르는 쪽이
 * 토스트로 낸다(`onReorder`가 false를 준다). **되돌리기는 조건부다**: 저장이 날아가는
 * 동안 사용자가 또 옮겼다면 그건 성공한 이동이므로 건드리지 않는다(아래 `move` 참고).
 *
 * 로컬 순서(`order`)는 id 배열이고, 렌더할 때마다 현재 items에 다시 맞춘다. 서버가 따라오면
 * 같은 배열이 되어 자연히 무의미해지고, 다른 탭이 항목을 더하거나 지워 **집합이 달라지면**
 * 서버 목록을 따른다. 그래서 props가 바뀔 때 상태를 지우는 이펙트가 필요 없다.
 */
export function SortableList<T extends { id: string }>({
  items,
  labelOf,
  onReorder,
  renderItem,
  rowTestId,
}: {
  items: T[];
  /** 그립의 접근 가능한 이름에 들어간다 — "무엇을" 옮기는지가 있어야 한다. */
  labelOf: (item: T) => string;
  /** 확정된 순서를 **id 배열로** 넘긴다(액션 규약). 서버가 받아들이면 true. */
  onReorder: (ids: string[]) => Promise<boolean>;
  renderItem: (item: T, index: number, dragging: boolean) => React.ReactNode;
  rowTestId?: string;
}) {
  const [order, setOrder] = useState<string[] | null>(null);
  const [drag, setDrag] = useState<{ from: number; to: number; dy: number; shift: number } | null>(null);
  const [announce, setAnnounce] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  /** 드래그 시작 시점의 좌표. 드래그 중에는 DOM이 transform으로만 움직이므로 다시 재지 않는다. */
  const from = useRef({ y: 0, mids: [] as number[] });

  const ordered = useMemo(() => {
    if (!order) return items;
    const byId = new Map(items.map((item) => [item.id, item]));
    const out: T[] = [];
    for (const id of order) {
      const item = byId.get(id);
      if (!item) continue;
      byId.delete(id);
      out.push(item);
    }
    // 집합이 달라졌다 = 로컬 순서가 낡았다. 서버 목록이 진실이다.
    return out.length === items.length ? out : items;
  }, [items, order]);

  /**
   * 화면에 지금 걸린 순서. 저장이 날아가는 동안 다른 이동이 끼어들었는지 보는 데 쓴다 —
   * `order`를 클로저로 읽으면 이 호출이 시작할 때의 값이라 그 사이의 변화를 못 본다.
   */
  const current = useRef<string[] | null>(null);
  const apply = useCallback((next: string[] | null) => {
    current.current = next;
    setOrder(next);
  }, []);

  const move = useCallback(
    async (index: number, to: number) => {
      if (to < 0 || to >= ordered.length || to === index) return;

      const before = ordered.map((item) => item.id);
      const next = [...before];
      const [moved] = next.splice(index, 1);
      next.splice(to, 0, moved);

      const label = labelOf(ordered[index]);
      apply(next);
      setAnnounce(`${label}, ${to + 1}번째로 옮겼어요`);

      if (await onReorder(next)) return;

      // 되돌리되, **내가 만든 순서가 아직 화면에 있을 때만** 되돌린다. 이 저장이
      // 날아가는 동안 사용자가 또 옮겼다면 그건 성공한 이동이고, `before`로 덮으면
      // 그 이동이 화면에서 조용히 사라진다(화면과 서버가 다른 순서를 든 채로 남는다).
      if (current.current?.join() !== next.join()) return;
      apply(before);
      // 알림도 같이 정정한다 — 화면을 못 보는 사람에게 토스트는 없는 것이나 같다.
      setAnnounce(`${label}, 순서를 되돌렸어요`);
    },
    [ordered, labelOf, onReorder, apply],
  );

  const onPointerDown = (index: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || !listRef.current) return;
    const rows = Array.from(listRef.current.children).map((el) => el.getBoundingClientRect());
    if (rows.length < 2) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    from.current = { y: e.clientY, mids: rows.map((r) => r.top + r.height / 2) };
    // 한 칸 = 행 높이 + 행 사이 간격. 재서 쓴다 — 값을 박아 두면 행 모양이 바뀔 때 어긋난다.
    setDrag({ from: index, to: index, dy: 0, shift: rows[1].top - rows[0].top });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    const dy = e.clientY - from.current.y;
    const center = from.current.mids[drag.from] + dy;
    let to = drag.from;
    for (let i = 0; i < from.current.mids.length; i++) {
      if (i < drag.from && center < from.current.mids[i]) {
        to = i;
        break;
      }
      if (i > drag.from && center > from.current.mids[i]) to = i;
    }
    setDrag({ ...drag, to, dy });
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const { from: index, to } = drag;
    setDrag(null);
    void move(index, to);
  };

  /** 드래그 중 이웃이 비켜서는 양. transform만 쓴다 — top/margin은 레이아웃을 다시 계산시킨다. */
  const offset = (index: number): number => {
    if (!drag) return 0;
    if (index === drag.from) return drag.dy;
    if (drag.to > drag.from && index > drag.from && index <= drag.to) return -drag.shift;
    if (drag.to < drag.from && index >= drag.to && index < drag.from) return drag.shift;
    return 0;
  };

  return (
    <>
      <ul ref={listRef} className="flex flex-col gap-2">
        {ordered.map((item, index) => {
          const dragging = drag?.from === index;
          return (
            <li
              key={item.id}
              data-testid={rowTestId}
              style={{ transform: `translateY(${offset(index)}px)` }}
              className={[
                "flex items-center gap-2.5 rounded-field px-2.5 py-2.5",
                dragging
                  ? "relative z-10 bg-brand-weak shadow-pop"
                  : "bg-sunken transition-transform duration-fast ease-planit",
              ].join(" ")}
            >
              <button
                type="button"
                aria-label={`순서 바꾸기 — ${labelOf(item)}`}
                className="flex flex-none cursor-grab touch-none text-tertiary"
                onKeyDown={(e) => {
                  if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                  e.preventDefault();
                  void move(index, index + (e.key === "ArrowDown" ? 1 : -1));
                }}
                onPointerDown={onPointerDown(index)}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={() => setDrag(null)}
              >
                <GripVertical size={14} strokeWidth={2} aria-hidden />
              </button>
              {renderItem(item, index, Boolean(dragging))}
            </li>
          );
        })}
      </ul>

      {/* 화면을 못 보는 사람에게 "무엇이 몇 번째로 갔는지"를 알린다. */}
      <div data-testid="sort-status" aria-live="polite" className="sr-only">
        {announce}
      </div>
    </>
  );
}
