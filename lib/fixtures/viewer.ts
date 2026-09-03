// node:crypto를 쓴다 — 이 파일은 서버에서만 import한다.
// 클라이언트 컴포넌트는 데이터를 props로 받는다.
import { createHash } from "node:crypto";
import type { ViewerPlan, ViewerPlace } from "@/types/viewer";

// KST(Asia/Seoul)로 고정한다. rail.ts::isSameDay는 브라우저 로컬 TZ로 "오늘"을 비교하는데,
// 이 함수가 서버 로컬 TZ(예: CI의 UTC)로 날짜를 만들면 두 기준이 어긋나 레일 상태가
// 실행 시각·환경에 따라 흔들린다. 한국 서비스이므로 양쪽을 KST에 못박는다
// (playwright.config.ts의 timezoneId: 'Asia/Seoul'과 짝을 이룬다).
const KST_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" });

/** 오늘(KST)로부터 offset일 뒤를 "YYYY-MM-DD"로. 픽스처가 시간이 지나도 살아 있게 한다. */
function dayOffset(offset: number): string {
  const todayKst = KST_DATE_FORMAT.format(new Date()); // "YYYY-MM-DD" (en-CA는 ISO 형식을 준다)
  const [y, m, d] = todayKst.split("-").map(Number);
  // KST 자정 기준으로 offset일을 더한 뒤, 그 결과를 다시 KST 날짜 문자열로 읽는다 —
  // UTC 기준 Date 연산 자체는 TZ 무관이라 로컬 자정 경계 문제가 없다.
  const shifted = new Date(Date.UTC(y, m - 1, d + offset));
  return KST_DATE_FORMAT.format(shifted);
}

const jejuPlaces: ViewerPlace[] = [
  { id: "pl-air", name: "제주국제공항", address: "제주특별자치도 제주시 공항로 2", lat: 33.5113, lng: 126.4930, memo: "3번 게이트 앞에서 모여요.", tags: ["집결"], isPinned: true },
  { id: "pl-pork", name: "흑돼지 명가", address: "제주특별자치도 제주시 관덕로 12", lat: 33.5127, lng: 126.5219, memo: null, tags: ["식사"], isPinned: false },
  { id: "pl-seong", name: "성산일출봉", address: "제주특별자치도 서귀포시 성산읍 일출로 284-12", lat: 33.4581, lng: 126.9425, memo: "입장료 5,000원. 편한 신발 필수예요.", tags: ["관광"], isPinned: false },
  { id: "pl-house", name: "위미 게스트하우스", address: "제주특별자치도 서귀포시 남원읍 위미해안로 108", lat: 33.2660, lng: 126.6690, memo: null, tags: ["숙소"], isPinned: true },
];

const jeju: ViewerPlan = {
  slug: "jeju-workshop-2026",
  title: "제주 워크샵 2026",
  planType: "여행",
  partyLabel: "디자인팀 12명",
  startDate: dayOffset(0),
  endDate: dayOffset(2),
  coverImageUrl: "/landing/mountain-lake.jpg",
  notices: [
    { id: "n1", title: "집결 시간을 꼭 지켜주세요", body: "10시 30분에 셔틀이 먼저 출발해요." },
    { id: "n2", title: "준비물", body: "편한 신발, 얇은 패딩, 상비약, 보조배터리" },
    { id: "n3", title: "회비", body: "1인 12만원이에요. 총무에게 현장 정산해요." },
  ],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "i1", startTime: "10:30", durationMin: 30, activityName: "제주공항 집결", memo: null, place: jejuPlaces[0] },
        { id: "i2", startTime: "12:00", durationMin: 90, activityName: "점심 · 흑돼지", memo: null, place: jejuPlaces[1] },
        { id: "i3", startTime: "14:30", durationMin: 150, activityName: "성산일출봉 트레킹", memo: "우산을 챙겨요. 비 소식이 있어요.", place: jejuPlaces[2] },
        { id: "i4", startTime: "18:00", durationMin: null, activityName: "게스트하우스 체크인", memo: null, place: jejuPlaces[3] },
      ],
    },
    {
      dayNumber: 2,
      date: dayOffset(1),
      items: [
        { id: "i5", startTime: "09:00", durationMin: 60, activityName: "조식", memo: null, place: jejuPlaces[3] },
        { id: "i6", startTime: "11:00", durationMin: 180, activityName: "팀 세션", memo: null, place: null },
        { id: "i7", startTime: "19:00", durationMin: null, activityName: "저녁 · 자유", memo: null, place: null },
      ],
    },
    {
      dayNumber: 3,
      date: dayOffset(2),
      items: [
        { id: "i8", startTime: "10:00", durationMin: 60, activityName: "체크아웃", memo: null, place: jejuPlaces[3] },
        { id: "i9", startTime: "14:00", durationMin: null, activityName: "공항 이동 · 해산", memo: null, place: jejuPlaces[0] },
      ],
    },
  ],
  places: jejuPlaces,
  transport: [
    { id: "t1", mode: "항공", fromLabel: "김포", toLabel: "제주", durationLabel: "1시간 10분", note: "08:20 출발편이에요." },
    { id: "t2", mode: "버스", fromLabel: "제주공항", toLabel: "성산", durationLabel: "1시간 20분", note: null },
  ],
};

const offsitePlaces: ViewerPlace[] = [
  { id: "op-1", name: "성수 언더스탠드에비뉴", address: "서울특별시 성동구 왕십리로 63", lat: 37.5445, lng: 127.0557, memo: null, tags: ["집결"], isPinned: true },
  { id: "op-2", name: "뚝섬 한식당", address: "서울특별시 성동구 뚝섬로 3길 10", lat: 37.5470, lng: 127.0470, memo: null, tags: ["식사"], isPinned: false },
];

/** 사진 없음 · 하루 일정 · 공지 1개 — 크롬이 가장 얇은 경우 */
const offsite: ViewerPlan = {
  slug: "team-offsite",
  title: "2분기 팀 워크샵",
  planType: "워크샵",
  partyLabel: "마케팅팀 8명",
  startDate: dayOffset(0),
  endDate: dayOffset(0),
  coverImageUrl: null,
  notices: [{ id: "on1", title: "노트북을 꼭 챙겨주세요", body: "실습 세션에 필요해요." }],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "oi1", startTime: "09:30", durationMin: 30, activityName: "모임 · 로비", memo: null, place: offsitePlaces[0] },
        { id: "oi2", startTime: "10:00", durationMin: 150, activityName: "킥오프 세션", memo: null, place: offsitePlaces[0] },
        { id: "oi3", startTime: "12:30", durationMin: 90, activityName: "점심", memo: null, place: offsitePlaces[1] },
        { id: "oi4", startTime: "14:00", durationMin: 180, activityName: "실습 워크샵", memo: null, place: offsitePlaces[0] },
        { id: "oi5", startTime: "17:00", durationMin: null, activityName: "마무리 · 해산", memo: null, place: offsitePlaces[0] },
      ],
    },
  ],
  places: offsitePlaces,
  transport: [],
};

/** 스펙 §9-6 — 하루 22개 항목에서 레일과 스크롤이 견디는지 보는 픽스처 */
const longDay: ViewerPlan = {
  slug: "long-day",
  title: "종일 컨퍼런스",
  planType: "행사",
  partyLabel: null,
  startDate: dayOffset(0),
  endDate: dayOffset(0),
  coverImageUrl: null,
  notices: [],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: Array.from({ length: 22 }, (_, i) => {
        const minutes = 8 * 60 + i * 35;
        const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
        const mm = String(minutes % 60).padStart(2, "0");
        return {
          id: `ld-${i}`,
          startTime: `${hh}:${mm}`,
          durationMin: 30,
          activityName: `세션 ${i + 1}`,
          memo: null,
          place: null,
        };
      }),
    },
  ],
  places: [],
  transport: [],
};

const PLANS: Record<string, ViewerPlan> = {
  [jeju.slug]: jeju,
  [offsite.slug]: offsite,
  [longDay.slug]: longDay,
};

/**
 * 비공개(비밀번호) 일정 판정. `secret-`로 시작하는 slug는 전부 잠긴 것으로 본다.
 *
 * 왜 집합이 아니라 접두사인가: 시도 카운터가 프로세스 메모리다
 * (actions/viewer-actions.ts). E2E가 고정 slug를 나눠 쓰면 프로젝트 병렬·재시도에
 * 따라 남은 횟수가 흔들린다. 접두사로 열어 두면 틀리는 테스트가 매번 새 slug를 쓸 수 있다.
 * 비밀번호 해시가 없는 slug는 어떤 입력도 통과하지 못한다(fail-closed).
 *
 * DB가 붙으면 plans.visibility = 'private' 조회로 대체된다.
 */
export function isLockedSlug(slug: string): boolean {
  return slug.startsWith("secret-");
}

/** 만료된 링크 */
export const EXPIRED_SLUGS = new Set(["gone"]);

/**
 * 픽스처 단계의 비밀번호 해시. DB가 붙으면 plans.password_hash로 옮긴다.
 *
 * ponytail: sha256(솔트 없음) — **픽스처이기 때문이다.** 실제 DB 컬럼이 붙는 순간
 *           salt + scrypt(node:crypto.scrypt)로 바꾼다. 지금 값은 소스에 평문이 없는
 *           고정 다이제스트일 뿐, 오프라인 크래킹 저항이 없다.
 */
export const FIXTURE_PASSWORD_HASH: Record<string, string> = {
  // sha256("1234")
  "secret-party": createHash("sha256").update("1234").digest("hex"),
};

/** 비밀번호 시도 상한. 막다른 길에 닿기 전에 남은 횟수를 미리 알려준다(스펙 §5.1). */
export const MAX_ATTEMPTS = 5;

export function findFixturePlan(slug: string): ViewerPlan | undefined {
  return PLANS[slug];
}

/** 비밀번호를 통과했을 때 보여줄 일정. */
export function lockedFixturePlan(slug: string): ViewerPlan | undefined {
  return isLockedSlug(slug) ? { ...jeju, slug, title: "비공개 모임" } : undefined;
}
