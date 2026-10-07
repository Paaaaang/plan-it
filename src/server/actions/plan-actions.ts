/**
 * @file 일정 기본 정보 · 상태 · 커버 서버 액션
 * @description 편집기가 일정 자체를 고치는 경로. 검증은 전부 이 안에서 한다 —
 *              클라이언트 검증은 UX용일 뿐이다. 기본 정보·상태는 Postgres 행 단위로 쓴다.
 *              커버는 아직 메모리 블롭 스토어다 — Storage 연동은 별도 단계다.
 *
 * 'use server'
 *
 * @auth 각 액션이 getSessionUserId()로 세션을 직접 본다 — 'use server' export는 누구나
 *       POST할 수 있어서 페이지가 확인했다는 것이 보증이 되지 않는다. 소유자 확인은
 *       앱 코드로 하지 않는다 — createServerClient()로 나간 쿼리는 RLS가 owner_id를 강제한다.
 *
 * @actions
 *  - saveBasicInfo(slug, input)  → 제목·기간·유형·인원 저장 + 일차 동기화 (F-EDIT-BASIC-1·2·3)
 *  - setStatus(slug, status)     → draft/public/private 전환 (F-STATE-2)
 *  - setCover(slug, form)        → 커버 사진 업로드 (FormData의 "file")
 *
 * @connects
 *  - src/server/store/plans.ts          → 조회·행 단위 쓰기 (getPlan, updatePlanRow, syncDayRows, setCoverBlob)
 *  - src/shared/editor/validate.ts      → 입력 검증
 *  - src/shared/utils/date.ts           → 기간 → 일차 산술
 *  - app/api/cover/[slug]/[v]    → 업로드된 커버 바이트를 내보내는 곳
 *  - src/shared/types/editor.ts             → ActionResult, BasicInfoInput, PlanStatus
 *  - src/shared/types/viewer.ts             → 저장 대상 모양 (ViewerPlan)
 *
 * @important 상태(status)는 ViewerPlan에 없다 — 공개 DTO라서다. plans.status 컬럼에 따로 둔다.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getSessionUserId } from "@/server/auth/dal";
import { createServerClient } from "@/server/supabase/server";
import { getPlan, updatePlanRow, syncDayRows, setCoverBlob } from "@/server/store/plans";
import { addDays, diffDays } from "@/shared/utils/date";
import {
  validateTitle,
  validateDate,
  validateRange,
  validateText,
  validateStatus,
  validateCoverUrl,
} from "@/shared/editor/validate";
import type { ActionResult, BasicInfoInput } from "@/shared/types/editor";
import type { ViewerDay } from "@/shared/types/viewer";

/**
 * 기간이 바뀌면 일차도 따라 바뀐다 — 둘은 한 몸이다.
 * 늘면 빈 날을 붙이고, 줄면 꼬리를 자르고, 모든 날의 `date`를 새 시작일 기준으로 다시 센다.
 *
 * **일정이 든 날이 잘려 나가면 거부한다.** 조용히 지우면 되돌릴 방법이 없다 —
 * 무엇을 비워야 하는지 화면이 말해 주고 사용자가 정하게 둔다.
 */
function syncDays(days: ViewerDay[], start: string, end: string): ActionResult<ViewerDay[]> {
  const count = diffDays(start, end) + 1; // validateRange를 통과했으므로 1 이상이다.

  const losing = days.slice(count).filter((d) => d.items.length > 0);
  if (losing.length > 0) {
    return {
      ok: false,
      message: `${losing.map((d) => d.dayNumber).join("·")}일차에 일정이 있어요. 먼저 비운 뒤 기간을 줄여주세요.`,
    };
  }

  return {
    ok: true,
    data: Array.from({ length: count }, (_, i) => ({
      dayNumber: i + 1,
      date: addDays(start, i),
      items: days[i]?.items ?? [],
    })),
  };
}

export async function saveBasicInfo(slug: string, input: BasicInfoInput): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  const plan = await getPlan(db, slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };
  // 타입은 컴파일 시점의 약속일 뿐이다. `'use server'` export는 누구나 POST할 수 있다.
  if (!input || typeof input !== "object") return { ok: false, message: "입력을 확인해 주세요." };

  const title = validateTitle(input.title);
  if (!title.ok) return { ok: false, message: title.message, field: "title" };

  const start = validateDate(input.startDate);
  if (!start.ok) return { ok: false, message: start.message, field: "startDate" };

  const end = validateDate(input.endDate);
  if (!end.ok) return { ok: false, message: end.message, field: "endDate" };

  const range = validateRange(start.value, end.value);
  if (!range.ok) {
    // 오류는 **사용자가 방금 만진 필드**에 붙는다. 저장된 값과 다른 쪽이 그 필드다 —
    // 시작일을 종료일 뒤로 밀었는데 종료일이 빨개지면 멀쩡한 필드를 고치게 된다.
    // 둘 다 바뀌었으면(폼 전체 저장) 종료일에 붙인다 — 기존 동작이고, 문구가
    // "종료일이 시작일보다 빠를 수 없어요"라 종료일 쪽이 덜 엉뚱하다.
    const field = start.value !== plan.startDate && end.value === plan.endDate ? "startDate" : "endDate";
    return { ok: false, message: range.message, field };
  }

  const planType = validateText(input.planType, "유형", 20);
  if (!planType.ok) return { ok: false, message: planType.message, field: "planType" };

  const partyLabel = validateText(input.partyLabel, "인원", 40);
  if (!partyLabel.ok) return { ok: false, message: partyLabel.message, field: "partyLabel" };

  // 기간이 그대로면 일차를 건드리지 않는다 — 제목만 고친 저장이 남의 일차 배열을
  // 새로 만들 이유가 없다.
  let dates: string[] | undefined;
  if (start.value !== plan.startDate || end.value !== plan.endDate) {
    const synced = syncDays(plan.days, start.value, end.value);
    // 어느 필드를 되돌려야 하는지 화면이 알 수 없다(시작일을 밀어도 꼬리가 잘린다).
    // field 없이 섹션 단위 오류로 낸다.
    if (!synced.ok) return synced;
    dates = synced.data.map((d) => d.date);
  }

  if (
    !(await updatePlanRow(db, slug, {
      title: title.value,
      start_date: start.value,
      end_date: end.value,
      plan_type: planType.value,
      party_label: partyLabel.value || null,
    }))
  ) {
    return { ok: false, message: "저장하지 못했어요." };
  }

  if (dates && !(await syncDayRows(db, slug, dates))) {
    return { ok: false, message: "일차를 저장하지 못했어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function setStatus(slug: string, status: string): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  const checked = validateStatus(status);
  if (!checked.ok) return { ok: false, message: checked.message, field: "status" };

  if (!(await updatePlanRow(db, slug, { status: checked.value }))) {
    return { ok: false, message: "일정을 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

const COVER_MAX_BYTES = 8 * 1024 * 1024;
/** MIME → 허용 확장자. 저장할 Content-Type은 **이 표에서 고른다** — 업로더가 보낸 문자열이 아니다. */
const COVER_TYPES = new Map<string, string[]>([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
]);

/**
 * 커버 사진 업로드.
 *
 * **저장 방식**: 이 단계에는 Storage가 없다. 바이트는 메모리 스토어에 넣고
 * `coverImageUrl`에는 내부 경로(`/api/cover/<slug>/<version>`)를 저장한다.
 * 브리프는 data URL을 말했지만 `validateCoverUrl`이 `data:`를 막는다 — 그 가드는
 * 옳다(커버 주소는 `<img src>`와 OG 메타로 그대로 나간다). 그래서 저장 위치만 바꾸고
 * **가드는 그대로 통과시킨다**: 내부 경로도 같은 `validateCoverUrl`을 지난다.
 * `javascript:`·프로토콜 상대 URL은 여전히 막힌다.
 *
 * Supabase Storage가 붙으면 여기서 업로드하고 공개 URL을 저장한다. 스펙 §7.3의
 * 1600px 리사이즈·WebP 변환도 그때 함께 붙인다 — 지금은 메모리에만 있어 변환의 이득이 없다.
 * **MIME·크기·확장자 검증은 지금도 서버에서 한다.** 그건 저장 위치와 무관한 보안 사항이다.
 */
export async function setCover(slug: string, form: FormData): Promise<ActionResult<string>> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  const plan = await getPlan(db, slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, message: "파일을 찾을 수 없어요.", field: "coverImageUrl" };

  const extensions = COVER_TYPES.get(file.type);
  if (!extensions) return { ok: false, message: "JPG·PNG·WebP만 올릴 수 있어요.", field: "coverImageUrl" };
  // 확장자도 본다. type은 브라우저가 붙인 값이라 파일 이름과 어긋날 수 있고,
  // 나중에 이 이름 그대로 스토리지 키가 된다.
  const name = file.name.toLowerCase();
  if (!extensions.some((ext) => name.endsWith(ext))) {
    return { ok: false, message: "파일 확장자가 형식과 달라요.", field: "coverImageUrl" };
  }
  if (file.size === 0) return { ok: false, message: "빈 파일이에요.", field: "coverImageUrl" };
  if (file.size > COVER_MAX_BYTES) {
    return { ok: false, message: "8MB보다 작은 사진을 올려주세요.", field: "coverImageUrl" };
  }

  setCoverBlob(slug, new Uint8Array(await file.arrayBuffer()), file.type);

  // 같은 일정에 새 사진이 들어오므로 캐시 무효화 조각을 붙인다. **쿼리가 아니라 경로다** —
  // `next/image`는 로컬 이미지의 쿼리 문자열을 기본적으로 막고(localPatterns의 `search: ''`),
  // 막히면 커버를 올린 일정의 공개 뷰어가 500으로 떨어진다.
  const path = `/api/cover/${encodeURIComponent(slug)}/${Date.now()}`;
  const cover = validateCoverUrl(path);
  if (!cover.ok) return { ok: false, message: cover.message, field: "coverImageUrl" };

  if (!(await updatePlanRow(db, slug, { cover_image_url: cover.value }))) {
    return { ok: false, message: "저장하지 못했어요.", field: "coverImageUrl" };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: cover.value! };
}
