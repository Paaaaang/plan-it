/**
 * @file 장소 CRUD + 고정 토글 서버 액션
 * @description 장소(Place) 등록·수정·삭제·고정 토글. 목록은 배열 전체를 새로 써서 저장한다.
 *
 * 'use server'
 *
 * @auth 미구현 — proxy.ts가 스텁이라 지금은 아무나 부를 수 있다 (각 액션의 TODO(auth) 참고).
 *
 * @actions
 *  - addPlace(slug, input)        → 장소 등록 (F-EDIT-PLACE-1)
 *  - updatePlace(slug, id, input) → 장소 수정
 *  - deletePlace(slug, id)        → 장소 삭제 + 참조하던 항목의 place를 null로 (F-EDIT-PLACE-5)
 *  - togglePin(slug, id)          → 고정/유동 토글 (F-EDIT-PLACE-2)
 *
 * @connects
 *  - lib/store/plans.ts           → 조회·갱신 (getPlan, updatePlan)
 *  - lib/editor/validate.ts       → 입력 검증
 *  - types/editor.ts              → ActionResult, PlaceInput
 *  - types/viewer.ts              → ViewerDay, ViewerPlace
 *
 * @important ViewerItem.place는 장소 객체의 **사본**이다(참조 id가 아니라). 장소를 고치거나
 *            지울 때 days 안의 사본까지 같이 고치지 않으면 뷰어가 옛 값이나 깨진 객체를 든다.
 *            좌표(lat/lng)는 지오코딩이 붙기 전이라 편집 대상이 아니다 — 기존 값을 지킨다.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getPlan, updatePlan } from "@/lib/store/plans";
import { validateTitle, validateText, validateTags } from "@/lib/editor/validate";
import type { ActionResult, PlaceInput } from "@/types/editor";
import type { ViewerDay, ViewerPlace } from "@/types/viewer";

type PlaceFields = Omit<ViewerPlace, "id" | "lat" | "lng">;

function checkInput(input: PlaceInput): { ok: true; value: PlaceFields } | { ok: false; message: string; field: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "입력을 확인해 주세요.", field: "name" };
  const name = validateTitle(input.name);
  if (!name.ok) return { ok: false, message: name.message, field: "name" };
  const address = validateText(input.address, "주소", 200);
  if (!address.ok) return { ok: false, message: address.message, field: "address" };
  const memo = validateText(input.memo, "메모");
  if (!memo.ok) return { ok: false, message: memo.message, field: "memo" };
  const tags = validateTags(input.tags);
  if (!tags.ok) return { ok: false, message: tags.message, field: "tags" };
  return {
    ok: true,
    value: {
      name: name.value,
      address: address.value,
      memo: memo.value || null,
      tags: tags.value,
      isPinned: input.isPinned === true,
    },
  };
}

/** days 안에 박힌 장소 사본을 갈아 끼운다. next가 null이면 연결이 끊긴다. */
function syncEmbedded(days: ViewerDay[], id: string, next: ViewerPlace | null): ViewerDay[] {
  return days.map((d) => ({
    ...d,
    items: d.items.map((it) => (it.place?.id === id ? { ...it, place: next } : it)),
  }));
}

export async function addPlace(slug: string, input: PlaceInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const checked = checkInput(input);
  if (!checked.ok) return checked;

  const place: ViewerPlace = { id: crypto.randomUUID(), ...checked.value, lat: null, lng: null };
  updatePlan(slug, { places: [...plan.places, place] });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function updatePlace(slug: string, id: string, input: PlaceInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const cur = plan.places.find((p) => p.id === id);
  if (!cur) return { ok: false, message: "장소를 찾을 수 없어요." };

  const checked = checkInput(input);
  if (!checked.ok) return checked;

  const next: ViewerPlace = { ...cur, ...checked.value };
  updatePlan(slug, {
    places: plan.places.map((p) => (p.id === id ? next : p)),
    days: syncEmbedded(plan.days, id, next),
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function deletePlace(slug: string, id: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };
  if (!plan.places.some((p) => p.id === id)) return { ok: false, message: "장소를 찾을 수 없어요." };

  // 참조를 끊는다. 남겨 두면 뷰어가 "장소 미연결"을 보여줘야 할 자리에서
  // 목록에 없는 장소 객체를 들고 시트를 연다.
  updatePlan(slug, {
    places: plan.places.filter((p) => p.id !== id),
    days: syncEmbedded(plan.days, id, null),
    transport: plan.transport.map((t) => (t.placeId === id ? { ...t, placeId: null } : t)),
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function togglePin(slug: string, id: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const cur = plan.places.find((p) => p.id === id);
  if (!cur) return { ok: false, message: "장소를 찾을 수 없어요." };

  const next: ViewerPlace = { ...cur, isPinned: !cur.isPinned };
  updatePlan(slug, {
    places: plan.places.map((p) => (p.id === id ? next : p)),
    days: syncEmbedded(plan.days, id, next),
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}
