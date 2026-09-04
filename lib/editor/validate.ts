/**
 * @file 편집기 입력 검증
 * @description 전부 순수 함수다. Server Action이 부르고, 클라이언트도 같은 함수를 UX용으로
 *              부를 수 있다 — **하지만 클라이언트 검증은 UX용일 뿐이고 서버 검증이 진짜다.**
 *              신뢰 경계는 Server Action 안이므로, 화면이 무엇을 하든 여기서 다시 본다.
 */

export type Checked<T> = { ok: true; value: T } | { ok: false; message: string };

const TITLE_MAX = 60;
const TEXT_MAX = 500;

export function validateTitle(raw: unknown): Checked<string> {
  if (typeof raw !== "string") return { ok: false, message: "제목을 입력해 주세요." };
  const v = raw.trim();
  if (v.length === 0) return { ok: false, message: "제목을 입력해 주세요." };
  if (v.length > TITLE_MAX) return { ok: false, message: `제목은 ${TITLE_MAX}자까지 쓸 수 있어요.` };
  return { ok: true, value: v };
}

export function validateText(raw: unknown, label: string, max = TEXT_MAX): Checked<string> {
  if (typeof raw !== "string") return { ok: false, message: `${label}을(를) 확인해 주세요.` };
  const v = raw.trim();
  if (v.length > max) return { ok: false, message: `${label}은(는) ${max}자까지 쓸 수 있어요.` };
  return { ok: true, value: v };
}

/** "YYYY-MM-DD"만 받는다. Date로 파싱해 실제 존재하는 날짜인지도 본다. */
export function validateDate(raw: unknown): Checked<string> {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { ok: false, message: "날짜 형식이 올바르지 않아요." };
  }
  const [y, m, d] = raw.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return { ok: false, message: "없는 날짜예요." };
  }
  return { ok: true, value: raw };
}

/** "HH:MM" 24시간 */
export function validateTime(raw: unknown): Checked<string> {
  if (typeof raw !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) {
    return { ok: false, message: "시간은 00:00 ~ 23:59 형식으로 입력해 주세요." };
  }
  return { ok: true, value: raw };
}

/**
 * 시작일이 종료일보다 늦으면 안 된다.
 *
 * 문자열을 그대로 비교한다. `YYYY-MM-DD`는 자리수가 고정이고 큰 단위가 앞에 오므로
 * 사전순 = 시간순이다. Date로 파싱할 이유가 없다(파싱하면 타임존이 끼어든다).
 * validateDate를 통과한 값에만 쓴다 — 형식이 다르면 이 성질이 깨진다.
 */
export function validateRange(start: string, end: string): Checked<[string, string]> {
  if (start > end) return { ok: false, message: "종료일이 시작일보다 빠를 수 없어요." };
  return { ok: true, value: [start, end] };
}

export function validateStatus(raw: unknown): Checked<"draft" | "public" | "private"> {
  if (raw === "draft" || raw === "public" || raw === "private") return { ok: true, value: raw };
  return { ok: false, message: "알 수 없는 상태예요." };
}

/** 소요 시간(분). 비워 두면 null. */
export function validateDuration(raw: unknown): Checked<number | null> {
  if (raw === null || raw === undefined) return { ok: true, value: null };
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 0 || raw > 24 * 60) {
    return { ok: false, message: "소요 시간은 0분에서 24시간 사이로 입력해 주세요." };
  }
  return { ok: true, value: raw };
}

const TAG_MAX = 20;
const TAGS_MAX = 10;

export function validateTags(raw: unknown): Checked<string[]> {
  if (!Array.isArray(raw)) return { ok: false, message: "태그를 확인해 주세요." };
  if (raw.length > TAGS_MAX) return { ok: false, message: `태그는 ${TAGS_MAX}개까지 붙일 수 있어요.` };
  const out: string[] = [];
  for (const t of raw) {
    if (typeof t !== "string") return { ok: false, message: "태그를 확인해 주세요." };
    const v = t.trim();
    if (v.length === 0) continue;
    if (v.length > TAG_MAX) return { ok: false, message: `태그는 ${TAG_MAX}자까지 쓸 수 있어요.` };
    if (!out.includes(v)) out.push(v);
  }
  return { ok: true, value: out };
}

/**
 * 커버 이미지 주소. 이 값은 `<img src>`와 OG 메타로 그대로 나간다 —
 * `javascript:`·`data:` 스킴이 통과하면 뷰어에서 스크립트가 된다. 그래서 허용 목록이다:
 * 앱 내부 경로(`/`로 시작, `//`는 프로토콜 상대 URL이라 제외) 또는 https URL만.
 */
export function validateCoverUrl(raw: unknown): Checked<string | null> {
  if (raw === null || raw === undefined || raw === "") return { ok: true, value: null };
  if (typeof raw !== "string" || raw.length > 1024) {
    return { ok: false, message: "이미지 주소를 확인해 주세요." };
  }
  const v = raw.trim();
  if (v.startsWith("/") && !v.startsWith("//")) return { ok: true, value: v };
  if (/^https:\/\/[^\s]+$/i.test(v)) return { ok: true, value: v };
  return { ok: false, message: "이미지는 https 주소만 쓸 수 있어요." };
}

/**
 * id 배열대로 목록을 다시 세운다.
 *
 * 인덱스 쌍이 아니라 id 집합을 받는 이유: 인덱스는 다른 탭이 항목을 지운 뒤라면
 * 엉뚱한 것을 가리킨다. 받은 집합이 현재 집합과 정확히 같지 않으면 실패로 본다 —
 * 하나라도 어긋났다는 것은 클라이언트가 낡은 목록을 들고 있다는 뜻이다.
 */
export function reorderByIds<T extends { id: string }>(list: T[], ids: unknown): Checked<T[]> {
  if (!Array.isArray(ids) || ids.length !== list.length) {
    return { ok: false, message: "목록이 바뀌었어요. 새로고침한 뒤 다시 시도해 주세요." };
  }
  const byId = new Map(list.map((x) => [x.id, x]));
  const out: T[] = [];
  for (const id of ids) {
    const found = typeof id === "string" ? byId.get(id) : undefined;
    // byId에서 지우면서 꺼내므로 중복 id는 두 번째에 undefined가 된다.
    if (!found) return { ok: false, message: "목록이 바뀌었어요. 새로고침한 뒤 다시 시도해 주세요." };
    byId.delete(found.id);
    out.push(found);
  }
  return { ok: true, value: out };
}
