// node:crypto를 쓴다 — 이 파일은 서버에서만 import한다.
// 클라이언트 컴포넌트는 데이터를 props로 받는다.
import { createHash } from "node:crypto";
import type { ViewerPlan, ViewerPlace } from "../../types/viewer.ts";

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
    { id: "t1", placeId: "pl-air", mode: "항공", fromLabel: "김포", toLabel: "제주", durationLabel: "1시간 10분", note: "08:20 출발편이에요." },
    { id: "t2", placeId: "pl-seong", mode: "버스", fromLabel: "제주공항", toLabel: "성산", durationLabel: "1시간 20분", note: null },
  ],
};

const offsitePlaces: ViewerPlace[] = [
  { id: "op-1", name: "성수 언더스탠드에비뉴", address: "서울특별시 성동구 왕십리로 63", lat: 37.5445, lng: 127.0557, memo: null, tags: ["집결"], isPinned: true },
  { id: "op-2", name: "뚝섬 한식당", address: "서울특별시 성동구 뚝섬로 3길 10", lat: 37.5470, lng: 127.0470, memo: null, tags: ["식사"], isPinned: false },
  // 메모가 긴 장소. 기획자가 자유 텍스트를 길게 쓰면 시트가 뷰포트를 넘긴다 —
  // BottomSheet의 max-height/overflow 회귀를 잡는 픽스처다(tests/viewer.spec.ts).
  {
    id: "op-3",
    name: "성수 커피 로스터리",
    address: "서울특별시 성동구 연무장길 45",
    lat: 37.5432,
    lng: 127.0562,
    memo:
      "실습이 끝나면 이곳에서 자유롭게 쉬어요. 1층은 로스팅 공간이라 소음이 조금 있어요. " +
      "조용히 이야기하고 싶다면 2층 창가 자리를 추천해요. 콘센트는 2층 벽면에만 있어요. " +
      "단체 주문은 카운터에서 한 번에 받아요. 인원이 많으면 미리 말해 주세요. " +
      "디카페인은 재고가 자주 떨어지니 필요하면 일찍 주문하는 편이 좋아요. " +
      "화장실은 건물 공용이고 3층에 있어요. 비밀번호는 영수증 하단에 찍혀 나와요. " +
      "주차는 건물 뒤편 공영주차장을 쓰면 되고, 영수증을 보여주면 한 시간 무료예요. " +
      "근처에 편의점이 두 곳 있어요. 상비약이 필요하면 큰길 건너 약국이 가장 가까워요. " +
      "마감은 저녁 아홉 시예요. 그 전에 정리하고 다음 장소로 이동할 예정이에요. " +
      "원두는 세 종류를 상시로 두고, 주에 한 번 새 로트로 바꿔요. 산미가 약한 쪽을 원하면 " +
      "브라질 싱글을 달라고 하면 돼요. 우유는 일반과 오트 두 가지가 있고 오트는 오백 원을 더 받아요. " +
      "얼음이 필요한 음료는 만드는 데 시간이 조금 더 걸려요. 급하면 따뜻한 쪽을 추천해요. " +
      "테이블은 여덟 개뿐이라 인원이 흩어져 앉을 수 있어요. 짐은 한곳에 모아 두는 편이 편해요. " +
      "와이파이 이름은 매장 이름과 같고 비밀번호는 카운터 옆에 붙어 있어요. " +
      "사진 촬영은 자유지만 다른 손님이 나오지 않게만 신경 써 주세요. " +
      "반려동물은 야외 테라스에서만 가능해요. 테라스는 네 자리가 있어요. " +
      "결제는 카드와 간편결제 모두 되고 현금은 받지 않아요. 영수증은 요청해야 나와요. " +
      "포장 컵은 개당 삼백 원이 붙어요. 텀블러를 가져오면 오백 원을 깎아 줘요. " +
      "케이크는 오후 두 시쯤 나오고 종류는 그날그날 달라요. 미리 예약은 받지 않아요. " +
      "가는 길은 성수역 삼번 출구에서 걸어서 칠 분이에요. 골목으로 한 번 꺾어야 해요. " +
      "간판이 작아서 지나치기 쉬우니 파란 차양을 보고 찾으면 돼요. " +
      "비가 오면 테라스를 접어서 실내가 붐빌 수 있어요. 그럴 땐 옆 건물 이층 서점도 괜찮아요. " +
      "단체석은 미리 말하면 창가 두 테이블을 붙여 줘요. 최대 여덟 명까지예요. " +
      "짐을 맡아 주지는 않지만 캐리어를 둘 공간은 계단 아래에 있어요. " +
      "다음 일정까지 시간이 남으면 근처 공원을 한 바퀴 도는 것도 추천해요.",
    tags: ["카페"],
    isPinned: false,
  },
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

/**
 * 비공개(비밀번호) 일정. 스토어의 씨앗 상태가 `private`이 된다 — `isLockedSlug`가
 * 그 번역을 한다(lib/store/plans.ts::ensure). 잠금 판정의 진실은 스토어 하나다.
 */
const secretParty: ViewerPlan = { ...jeju, slug: "secret-party", title: "비공개 모임" };

/** 편집기 E2E 전용. 상태·제목을 쓰는 테스트가 뷰어 픽스처를 오염시키지 않게 따로 둔다. */
const editorDemo: ViewerPlan = {
  slug: "editor-demo",
  title: "편집 데모",
  planType: "모임",
  partyLabel: "3명",
  startDate: dayOffset(0),
  endDate: dayOffset(0),
  coverImageUrl: null,
  notices: [{ id: "ed-n1", title: "장소가 바뀔 수 있어요", body: "확정되면 다시 알려드릴게요." }],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "ed-i1", startTime: "19:00", durationMin: 120, activityName: "저녁 식사", memo: null, place: null },
      ],
    },
  ],
  places: [],
  transport: [],
};

/**
 * 기본 정보 섹션 E2E 전용. 기간을 바꾸는 테스트가 상단 바 테스트(editor-demo)의
 * serial 체인에 얹히지 않게 slug를 따로 둔다.
 *
 * **이틀 다 일정이 있다** — 기간을 줄여 일차가 사라지는 경로를 그대로 재현하려고
 * 그렇게 뒀다. 하루로 줄이면 2일차가 사라지므로 서버가 거부해야 한다.
 */
const editorBasic: ViewerPlan = {
  slug: "editor-basic",
  title: "기본 정보 데모",
  planType: "여행",
  partyLabel: "기획팀 4명",
  startDate: dayOffset(0),
  endDate: dayOffset(1),
  coverImageUrl: null,
  notices: [],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "eb-i1", startTime: "10:00", durationMin: 60, activityName: "출발", memo: null, place: null },
      ],
    },
    {
      dayNumber: 2,
      date: dayOffset(1),
      items: [
        { id: "eb-i2", startTime: "09:00", durationMin: 60, activityName: "조식", memo: null, place: null },
      ],
    },
  ],
  places: [],
  transport: [],
};

/**
 * 정렬 E2E 전용. 순서를 바꾸는 테스트가 다른 편집기 slug의 serial 체인에 얹히지 않게 따로 둔다.
 * 공지 셋이 있어야 "가운데로 옮기기"와 "맨 위에서 위로는 안 움직인다"를 둘 다 볼 수 있다.
 */
const editorSort: ViewerPlan = {
  slug: "editor-sort",
  title: "정렬 데모",
  planType: "여행",
  partyLabel: "5명",
  startDate: dayOffset(0),
  endDate: dayOffset(0),
  coverImageUrl: null,
  notices: [
    { id: "s-n1", title: "집결 시간을 꼭 지켜주세요", body: "10시 30분에 셔틀이 먼저 출발해요." },
    { id: "s-n2", title: "준비물", body: "편한 신발, 얇은 패딩, 상비약, 보조배터리" },
    { id: "s-n3", title: "회비", body: "1인 12만원이에요. 총무에게 현장 정산해요." },
  ],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "es-i1", startTime: "10:30", durationMin: 60, activityName: "집결", memo: null, place: null },
      ],
    },
  ],
  places: [],
  transport: [],
};

/**
 * 공지 섹션 E2E 전용. 추가·삭제가 목록 자체를 바꾸므로 정렬 데모(editor-sort)에 얹지 않는다 —
 * 거기 테스트는 공지 셋의 순서를 기준으로 판정한다.
 *
 * id를 `n-n1`~`n-n3`으로 둔 이유: 거부 경로 테스트가 요청 본문의 id를 없는 id(`n-n9`)로
 * 바꿔치기한다. **길이가 같아야** 본문이 깨지지 않는다(tests/editor.spec.ts).
 */
const editorNotice: ViewerPlan = {
  slug: "editor-notice",
  title: "공지 데모",
  planType: "여행",
  partyLabel: "6명",
  startDate: dayOffset(0),
  endDate: dayOffset(0),
  coverImageUrl: null,
  notices: [
    { id: "n-n1", title: "집결 시간을 꼭 지켜주세요", body: "10시 30분에 셔틀이 먼저 출발해요." },
    { id: "n-n2", title: "준비물", body: "편한 신발, 얇은 패딩, 상비약, 보조배터리" },
    { id: "n-n3", title: "회비", body: "1인 12만원이에요. 총무에게 현장 정산해요." },
  ],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "en-i1", startTime: "10:30", durationMin: 60, activityName: "집결", memo: null, place: null },
      ],
    },
  ],
  places: [],
  transport: [],
};

/**
 * 타임테이블·장소 E2E 전용. 두 섹션이 서로의 데이터를 만지므로(장소를 지우면 항목의 연결이
 * 끊긴다) 다른 편집기 slug에 얹지 않는다.
 *
 * 필요한 모양이 정해져 있다: **이틀**(일차 칩 전환을 보려면 하루로는 안 된다) · 1일차에
 * **장소 미연결 항목 하나**(회색 `장소 연결` 칩) · **고정 장소가 목록 중간에**(고정이 위로
 * 올라오는지 보려면 픽스처 순서가 이미 정렬돼 있으면 안 된다).
 */
const ttPlaces: ViewerPlace[] = [
  { id: "t-pl-cafe", name: "연남 카페", address: "서울 마포구 연남로 1", lat: null, lng: null, memo: null, tags: ["식사"], isPinned: false },
  { id: "t-pl-hall", name: "합정 세미나실", address: "서울 마포구 양화로 45", lat: null, lng: null, memo: "3층 B실이에요.", tags: ["회의"], isPinned: true },
  { id: "t-pl-park", name: "경의선숲길", address: "서울 마포구 연남동 385", lat: null, lng: null, memo: null, tags: ["산책"], isPinned: false },
];

const editorTimetable: ViewerPlan = {
  slug: "editor-tt",
  title: "타임테이블 데모",
  planType: "워크샵",
  partyLabel: "4명",
  startDate: dayOffset(0),
  endDate: dayOffset(1),
  coverImageUrl: null,
  notices: [],
  days: [
    {
      dayNumber: 1,
      date: dayOffset(0),
      items: [
        { id: "t-i1", startTime: "10:00", durationMin: 60, activityName: "모여서 커피", memo: null, place: ttPlaces[0] },
        { id: "t-i2", startTime: "11:30", durationMin: 120, activityName: "오전 세션", memo: null, place: ttPlaces[1] },
        { id: "t-i3", startTime: "14:00", durationMin: null, activityName: "산책", memo: null, place: null },
      ],
    },
    {
      dayNumber: 2,
      date: dayOffset(1),
      items: [
        { id: "t-i4", startTime: "09:30", durationMin: 90, activityName: "회고", memo: null, place: ttPlaces[1] },
        { id: "t-i5", startTime: "12:00", durationMin: null, activityName: "점심 해산", memo: null, place: null },
      ],
    },
  ],
  places: ttPlaces,
  transport: [],
};

/**
 * slug → 일정. **Map이다. 객체 리터럴이 아니다.**
 *
 * slug는 URL 조각이 그대로 들어오는 값이라 `PLANS[slug]` 형태의 객체 조회는
 * `constructor`·`toString` 같은 프로토타입 키에 뚫린다 — `/p/constructor`가
 * `Object` 함수를 일정으로 받아 500을 던졌다. Map은 프로토타입 체인을 보지 않으므로
 * 새 조회부가 생겨도 같은 사고가 되살아나지 않는다(가드를 잊을 자리가 없다).
 */
const PLANS = new Map<string, ViewerPlan>([
  [jeju.slug, jeju],
  [offsite.slug, offsite],
  [longDay.slug, longDay],
  [secretParty.slug, secretParty],
  [editorDemo.slug, editorDemo],
  [editorBasic.slug, editorBasic],
  [editorSort.slug, editorSort],
  [editorNotice.slug, editorNotice],
  [editorTimetable.slug, editorTimetable],
]);

/**
 * 비공개(비밀번호) 일정의 **씨앗** 판정. `secret-`로 시작하는 slug는 전부 잠긴 것으로 본다.
 *
 * 이 함수는 스토어 상태로 번역되는 자리에서만 쓴다(lib/store/plans.ts). 뷰어(getBySlug)는
 * 스토어 상태만 본다 — 그래야 편집기가 `setStatus`로 바꾼 것이 즉시 반영되고,
 * 잠금 판정이 두 갈래로 갈라지지 않는다.
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
 * PLANS와 같은 이유로 Map이다 — slug를 키로 쓰는 조회는 전부 프로토타입 키에 뚫린다.
 *
 * ponytail: sha256(솔트 없음) — **픽스처이기 때문이다.** 실제 DB 컬럼이 붙는 순간
 *           salt + scrypt(node:crypto.scrypt)로 바꾼다. 지금 값은 소스에 평문이 없는
 *           고정 다이제스트일 뿐, 오프라인 크래킹 저항이 없다.
 */
export const FIXTURE_PASSWORD_HASH = new Map<string, string>([
  // sha256("1234")
  ["secret-party", createHash("sha256").update("1234").digest("hex")],
]);

/** 비밀번호 시도 상한. 막다른 길에 닿기 전에 남은 횟수를 미리 알려준다(스펙 §5.1). */
export const MAX_ATTEMPTS = 5;

export function findFixturePlan(slug: string): ViewerPlan | undefined {
  return PLANS.get(slug);
}

/** 메모리 스토어(lib/store/plans.ts)의 씨앗. PLANS는 Map이라 values()를 편다. */
export function allFixturePlans(): ViewerPlan[] {
  return [...PLANS.values()];
}
