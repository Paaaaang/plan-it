/**
 * @file 장소 CRUD + 고정 토글 서버 액션
 * @description 장소(Place) 등록·수정·삭제·고정 토글. 행 단위로 Postgres에 쓴다.
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
 *  - lib/store/plans.ts           → 조회·행 단위 쓰기 (getPlan, insertRow, updateRow, deleteRow)
 *  - lib/editor/validate.ts       → 입력 검증
 *  - types/editor.ts              → ActionResult, PlaceInput
 *  - types/viewer.ts              → ViewerPlace
 *
 * @important 장소는 이제 참조다. schedule_items.place_id가 가리키고, 읽을 때 조인한다.
 *            사본을 동기화하던 syncEmbedded는 사라졌다 — 삭제 시 연결 해제는
 *            `ON DELETE SET NULL`이 지킨다(F-EDIT-PLACE-5).
 */

"use server";

import { revalidatePath } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";
import { getPlan, insertRow, updateRow, deleteRow } from "@/lib/store/plans";
import { validateTitle, validateText, validateTags } from "@/lib/editor/validate";
import type { ActionResult, PlaceInput } from "@/types/editor";
import type { ViewerPlace } from "@/types/viewer";

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

export async function addPlace(slug: string, input: PlaceInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  // TODO(auth): Task 6에서 createServerClient()로 바꾼다.
  const checked = checkInput(input);
  if (!checked.ok) return checked;

  await insertRow(adminClient(), "places", slug, {
    name: checked.value.name,
    address: checked.value.address,
    memo: checked.value.memo,
    tags: checked.value.tags,
    is_pinned: checked.value.isPinned,
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function updatePlace(slug: string, id: string, input: PlaceInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  // TODO(auth): Task 6에서 createServerClient()로 바꾼다.
  const checked = checkInput(input);
  if (!checked.ok) return checked;

  if (
    !(await updateRow(adminClient(), "places", slug, id, {
      name: checked.value.name,
      address: checked.value.address,
      memo: checked.value.memo,
      tags: checked.value.tags,
      is_pinned: checked.value.isPinned,
    }))
  ) {
    return { ok: false, message: "장소를 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function deletePlace(slug: string, id: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  // TODO(auth): Task 6에서 createServerClient()로 바꾼다.
  if (!(await deleteRow(adminClient(), "places", slug, id))) {
    return { ok: false, message: "장소를 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function togglePin(slug: string, id: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  // TODO(auth): Task 6에서 createServerClient()로 바꾼다.
  const db = adminClient();
  const plan = await getPlan(db, slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const cur = plan.places.find((p) => p.id === id);
  if (!cur) return { ok: false, message: "장소를 찾을 수 없어요." };

  if (!(await updateRow(db, "places", slug, id, { is_pinned: !cur.isPinned }))) {
    return { ok: false, message: "장소를 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}
