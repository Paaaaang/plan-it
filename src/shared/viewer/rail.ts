import type { ViewerItem } from "@/shared/types/viewer";

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** now가 이 날짜와 같은 날인가. 진행 상태는 오늘에만 의미가 있다 (스펙 §4.6). */
function isSameDay(now: Date, dayDate: string): boolean {
  const local = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return local === dayDate;
}

/**
 * 항목 하나의 상태. "현재"는 시작한 것 중 가장 늦은 하나다.
 * now가 null(서버 렌더)이거나 오늘이 아니면 전부 "future" — 조용한 기본 상태다.
 */
export function itemState(
  items: ViewerItem[],
  index: number,
  now: Date | null,
  dayDate: string,
): "past" | "current" | "future" {
  if (!now || !isSameDay(now, dayDate)) return "future";
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const starts = items.map((it) => minutesOf(it.startTime));

  let currentIdx = -1;
  for (let k = 0; k < starts.length; k++) {
    if (starts[k] <= nowMin) currentIdx = k;
  }
  if (currentIdx < 0) return "future";
  if (index < currentIdx) return "past";
  if (index === currentIdx) return "current";
  return "future";
}
