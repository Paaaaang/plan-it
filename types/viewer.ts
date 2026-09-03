/**
 * 공개 뷰어 DTO. 로그인 없이 열리는 경로가 받는 유일한 모양이다.
 * 기획자 전용 필드(owner_id, password_hash, status)는 여기에 없다 —
 * 타입에 없으면 서버가 담을 수 없다.
 */

export type ViewerPlace = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  memo: string | null;
  tags: string[];
  isPinned: boolean;
};

export type ViewerItem = {
  id: string;
  /** "HH:MM" 24시간. 하루 안의 로컬 시각이다. */
  startTime: string;
  durationMin: number | null;
  activityName: string;
  memo: string | null;
  place: ViewerPlace | null;
};

export type ViewerDay = {
  dayNumber: number;
  /** "YYYY-MM-DD" */
  date: string;
  items: ViewerItem[];
};

export type ViewerNotice = { id: string; title: string; body: string };

export type ViewerTransport = {
  id: string;
  mode: string;
  fromLabel: string;
  toLabel: string;
  durationLabel: string;
  note: string | null;
};

export type ViewerPlan = {
  slug: string;
  title: string;
  /** 커버 뱃지 문구. "여행" · "워크샵" · "모임" 등 자유 문자열 */
  planType: string;
  /** "디자인팀 12명" 같은 자유 문구. 없으면 null */
  partyLabel: string | null;
  /** "YYYY-MM-DD" */
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  notices: ViewerNotice[];
  days: ViewerDay[];
  places: ViewerPlace[];
  transport: ViewerTransport[];
};

export type ViewerResult =
  | { status: "ok"; plan: ViewerPlan }
  | { status: "locked"; slug: string }
  | { status: "notFound" }
  | { status: "expired" };
