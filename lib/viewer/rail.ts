import type { ViewerItem } from "@/types/viewer";

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
 * 레일이 회색으로 녹는 지점을 0~1로 돌려준다.
 * null이면 "진행 없음" — 오늘이 아닌 날이거나 아직 서버 렌더 단계다. 레일은 전부 회색이 된다.
 *
 * 시각 비율이 아니라 항목 인덱스 기준으로 계산한다. 레일은 개수만큼 쌓인 행을 관통하는
 * 공간적 선이라, 시각 비율로 잡으면 일정이 몰린 구간에서 녹는 점이 해당 카드에서 멀어진다.
 */
export function railProgress(items: ViewerItem[], now: Date | null, dayDate: string): number | null {
  if (!now || items.length === 0 || !isSameDay(now, dayDate)) return null;

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const starts = items.map((it) => minutesOf(it.startTime));

  if (nowMin < starts[0]) return 0;
  if (items.length === 1) return nowMin >= starts[0] ? 1 : 0;
  if (nowMin >= starts[starts.length - 1]) return 1;

  for (let k = 0; k < starts.length - 1; k++) {
    if (nowMin >= starts[k] && nowMin < starts[k + 1]) {
      const span = starts[k + 1] - starts[k];
      const frac = span > 0 ? (nowMin - starts[k]) / span : 0;
      return (k + frac) / (starts.length - 1);
    }
  }
  return 1;
}

/**
 * G1 — 부드럽게 녹는 레일. 정지점 넷으로 코랄에서 회색까지 26%p에 걸쳐 넘어간다.
 * 색은 의미 별칭만 쓴다 (스펙 §7.1) — 원시 코랄 스케일을 직접 부르지 않는다.
 */
export function railGradient(progress: number | null): string {
  if (progress === null) return "var(--rail-future)";
  const p = Math.min(100, Math.max(0, progress * 100));
  const a = Math.max(0, p - 12);
  const b = Math.min(100, p + 14);
  return `linear-gradient(180deg, var(--rail-past) 0%, var(--rail-past) ${a}%, var(--rail-melt) ${p}%, var(--rail-future) ${b}%)`;
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
