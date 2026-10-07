import type { ViewerNotice } from "@/shared/types/viewer";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

function parse(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "10.24 목" */
function short(date: string): string {
  const d = parse(date);
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")} ${WEEKDAY[d.getDay()]}`;
}

/**
 * 공지 한 줄 요약. 각 공지의 첫 구절을 · 로 잇는다 (스펙 §5.1).
 * 저장하지 않고 목록에서 파생한다 (스펙 §7.6).
 */
export function noticeSummary(notices: ViewerNotice[]): string {
  return notices.map((n) => n.title.split(/[.·,\n]/)[0].trim()).filter(Boolean).join(" · ");
}

/** "2박 3일" · 하루면 "당일" */
export function periodLabel(startDate: string, endDate: string): string {
  const days = Math.round((parse(endDate).getTime() - parse(startDate).getTime()) / 86_400_000) + 1;
  if (days <= 1) return "당일";
  return `${days - 1}박 ${days}일`;
}

/** "10.24 목 · 4개 일정" */
export function dateLine(date: string, itemCount: number): string {
  return `${short(date)} · ${itemCount}개 일정`;
}

/** "10.24 목 – 10.26 토 · 디자인팀 12명" */
export function coverSubline(startDate: string, endDate: string, partyLabel: string | null): string {
  const range = startDate === endDate ? short(startDate) : `${short(startDate)} – ${short(endDate)}`;
  return partyLabel ? `${range} · ${partyLabel}` : range;
}
