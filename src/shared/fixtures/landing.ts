/**
 * @file 랜딩 예시 일정
 * @description 여정 폰·만들어 보기·쓰임 카드가 그리는 예시. 실제 데이터가 아니다.
 *              날짜와 "지금"을 고정해 서버·브라우저 렌더가 같게 한다(수화 불일치 방지 — 랜딩 명세 §9).
 *              날짜는 요일이 맞는 실제 달력 값이다(summary.ts가 요일을 계산한다).
 *
 * @connects
 *  - src/client/components/landing/*  → 표시
 *  - src/shared/types/viewer.ts       → ViewerPlan
 */

import type { ViewerDay, ViewerItem, ViewerNotice, ViewerPlan } from "@/shared/types/viewer";

/** "YYYY-MM-DD" + "HH:MM" → 로컬 시각. rail.ts::isSameDay도 로컬로 비교하므로 어느 시간대에서든 같은 판정 */
export function at(date: string, hhmm: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  return new Date(y, m - 1, d, h, mi);
}

function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

const COVER = "/landing/cover-night.jpg";

let seq = 0;
function item(startTime: string, activityName: string, placeName: string, memo: string | null = null): ViewerItem {
  const id = `ld-${++seq}`;
  return {
    id,
    startTime,
    durationMin: null,
    activityName,
    memo,
    place: { id: `${id}-p`, name: placeName, address: "", lat: null, lng: null, memo: null, tags: [], isPinned: false },
  };
}

function notices(list: [string, string][]): ViewerNotice[] {
  return list.map(([title, body], i) => ({ id: `ldn-${++seq}-${i}`, title, body }));
}

function days(start: string, list: ViewerItem[][]): ViewerDay[] {
  return list.map((items, i) => ({ dayNumber: i + 1, date: addDays(start, i), items }));
}

function plan(p: Omit<ViewerPlan, "coverImageUrl" | "places" | "transport" | "endDate">): ViewerPlan {
  return { ...p, endDate: p.days[p.days.length - 1].date, coverImageUrl: COVER, places: [], transport: [] };
}

const JEJU_DAYS = [
  [
    item("10:30", "제주공항 집결", "제주국제공항"),
    item("12:00", "점심 · 흑돼지", "흑돼지 명가"),
    item("14:30", "성산일출봉 트레킹", "성산일출봉", "우산을 챙겨요. 비 소식이 있어요."),
    item("18:00", "게스트하우스 체크인", "위미 게스트하우스"),
  ],
  [
    item("09:00", "아침 · 해장국", "은희네 해장국"),
    item("11:00", "우도 배 타기", "성산포항", "신분증 꼭 챙겨요."),
    item("15:00", "카페 · 땅콩 아이스크림", "우도 카페"),
  ],
  [
    item("10:00", "체크아웃", "위미 게스트하우스"),
    item("12:30", "공항 가는 길 점심", "고기국수 거리"),
    item("15:10", "김포행 출발", "제주국제공항"),
  ],
];

const jeju = plan({
  slug: "landing-jeju",
  title: "제주 3일 모임",
  planType: "여행",
  partyLabel: "친구 4명",
  startDate: "2026-11-13",
  notices: notices([["집결", "10:30 제주공항 3번 게이트"], ["준비물", "신분증 · 우산"], ["회비", "1인 15만 원"]]),
  days: days("2026-11-13", JEJU_DAYS),
});

const mt = plan({
  slug: "landing-mt",
  title: "가평 1박 MT",
  planType: "MT·동아리",
  partyLabel: "동아리 18명",
  startDate: "2026-11-21",
  notices: notices([["집결", "13:00 청량리역 2번 출구"], ["준비물", "수건 · 세면도구"], ["회비", "3만 원"]]),
  days: days("2026-11-21", [
    [
      item("13:00", "청량리역 집결", "청량리역 2번 출구"),
      item("15:00", "펜션 체크인", "가평 별빛 펜션"),
      item("18:30", "바비큐 저녁", "펜션 테라스"),
      item("21:00", "레크리에이션", "펜션 거실"),
    ],
    [
      item("09:30", "해장 라면", "펜션 주방"),
      item("11:00", "체크아웃 · 청소", "가평 별빛 펜션"),
      item("13:00", "가평역 해산", "가평역"),
    ],
  ]),
});

const ws = plan({
  slug: "landing-ws",
  title: "4분기 팀 워크샵",
  planType: "워크샵",
  partyLabel: "마케팅팀 12명",
  startDate: "2026-11-27",
  notices: notices([["준비물", "노트북"], ["복장", "편하게"], ["장소", "성수 스튜디오 3층"]]),
  days: days("2026-11-27", [
    [
      item("09:30", "오프닝 · 커피", "성수 스튜디오 3층"),
      item("10:00", "4분기 회고", "세미나룸 A"),
      item("12:30", "점심", "성수 파스타"),
      item("14:00", "내년 로드맵", "세미나룸 A"),
      item("17:30", "저녁 · 회식", "성수 고깃집"),
    ],
  ]),
});

export const CASE_KEYS = ["jeju", "mt", "ws"] as const;
export type CaseKey = (typeof CASE_KEYS)[number];
export type LandingCase = { plan: ViewerPlan; now: Date };

/** 예시마다 고정된 "지금" — 1일차 두 번째 일정이 '지금'인 순간(명세 §4-4 시간 흐름의 출발점) */
export const LANDING_CASES: Record<CaseKey, LandingCase> = {
  jeju: { plan: jeju, now: at("2026-11-13", "12:00") },
  mt: { plan: mt, now: at("2026-11-21", "15:00") },
  ws: { plan: ws, now: at("2026-11-27", "10:00") },
};

// ---------- 만들어 보기 초안 (명세 §6) ----------

export const KINDS = ["여행", "MT·동아리", "워크샵", "주말 모임"] as const;
export const LENS = ["당일", "1박 2일", "2박 3일"] as const;
export type Kind = (typeof KINDS)[number];
export type Len = (typeof LENS)[number];
export type Draft = { title: string; kind: Kind; len: Len };

export const NAME_MAX = 24;
export const DEFAULT_DRAFT: Draft = { title: "가을 제주 3일", kind: "여행", len: "2박 3일" };

const WHO: Record<Kind, string> = { 여행: "친구 4명", "MT·동아리": "동아리 18명", 워크샵: "팀 12명", "주말 모임": "이웃 6명" };
/** 기간별 시작일 — 당일 11.14 토 / 1박 2일 11.14 토 – 11.15 일 / 2박 3일 11.13 금 – 11.15 일 */
const START: Record<Len, string> = { 당일: "2026-11-14", "1박 2일": "2026-11-14", "2박 3일": "2026-11-13" };

/** 초안 → 미리보기 폰이 그릴 일정. 일정 내용은 제주 예시를 일차 수만큼 빌려 쓴다 */
export function draftCase(d: Draft): LandingCase {
  const start = START[d.len];
  const n = LENS.indexOf(d.len) + 1;
  const p = plan({
    ...jeju,
    slug: "landing-draft",
    title: d.title.trim().slice(0, NAME_MAX) || "이름 없는 모임",
    planType: d.kind,
    partyLabel: WHO[d.kind],
    startDate: start,
    days: days(start, Array.from({ length: n }, (_, i) => JEJU_DAYS[i % JEJU_DAYS.length])),
  });
  return { plan: p, now: at(start, "12:00") };
}

const KEY_ABC = "0123456789abcdefghjkmnpqrstvwxyz"; // 헷갈리는 i·l·o·u 제외 32자(공유 링크 키 제안과 같은 글자)

/**
 * 공유 링크 키 모양의 예시 20자. **실제로 생기는 링크가 아니다**(명세 D3) — 입력이 바뀌면 같이 바뀌어
 * "이름을 쓰면 링크가 생긴다"를 보여 줄 뿐. 같은 입력이면 같은 값이라 서버·브라우저 렌더가 맞는다.
 */
export function demoShareKey(d: Draft): string {
  const s = `${d.kind}|${d.len}|${d.title}`;
  let h = 2166136261;
  let out = "";
  for (let i = 0; out.length < 20; i++) {
    h ^= s.charCodeAt(i % s.length) + i;
    h = Math.imul(h, 16777619) >>> 0;
    out += KEY_ABC[h & 31];
  }
  return out;
}
