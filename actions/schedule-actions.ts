/**
 * @file 타임테이블 항목 CRUD + 장소 연결 서버 액션
 * @description Day 안의 항목(ViewerItem) 추가·수정·삭제·순서 변경과 장소 연결.
 *              Day는 일정의 기간에서 파생되므로 여기서 만들지 않는다 — dayNumber로 찾아 쓴다.
 *              행 단위로 Postgres에 쓴다.
 *
 * 'use server'
 *
 * @auth 각 액션이 getSessionUserId()로 세션을 직접 본다. 소유자 확인은 앱 코드로 하지
 *       않는다 — createServerClient()로 나간 쿼리는 RLS가 owner_id를 강제한다.
 *
 * @actions
 *  - addItem(slug, dayNumber, input)     → 항목 추가 (F-EDIT-TT-2)
 *  - updateItem(slug, itemId, input)     → 항목 수정
 *  - deleteItem(slug, itemId)            → 항목 삭제
 *  - reorderItems(slug, dayNumber, ids)  → 순서 변경 (F-EDIT-TT-4)
 *  - linkPlace(slug, itemId, placeId)    → 장소 연결/해제 (F-EDIT-TT-5)
 *
 * @connects
 *  - lib/store/plans.ts          → 조회·행 단위 쓰기 + 소유 확인
 *                                   (getPlan, insertRow, updateRow, deleteRow, reorderRows, findDayId, placeExists)
 *  - lib/editor/validate.ts      → 입력 검증 + reorderByIds
 *  - types/editor.ts             → ActionResult, ItemInput
 *  - types/viewer.ts             → ViewerDay, ViewerItem
 *
 * @important ViewerItem.place는 이제 참조다(schedule_items.place_id 외래키). 장소가 바뀌어도
 *            항목 쪽을 따로 고칠 필요가 없다 — 읽을 때 조인해서 최신 값을 낸다.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth/dal";
import { createServerClient } from "@/lib/supabase/server";
import { getPlan, insertRow, updateRow, deleteRow, reorderRows, findDayId, placeExists } from "@/lib/store/plans";
import {
  validateTime,
  validateTitle,
  validateText,
  validateDuration,
  reorderByIds,
} from "@/lib/editor/validate";
import type { ActionResult, ItemInput } from "@/types/editor";
import type { ViewerItem } from "@/types/viewer";

type ItemFields = Omit<ViewerItem, "id" | "place">;

function checkInput(input: ItemInput): { ok: true; value: ItemFields } | { ok: false; message: string; field: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "입력을 확인해 주세요.", field: "activityName" };
  const startTime = validateTime(input.startTime);
  if (!startTime.ok) return { ok: false, message: startTime.message, field: "startTime" };
  const activityName = validateTitle(input.activityName);
  if (!activityName.ok) return { ok: false, message: activityName.message, field: "activityName" };
  const memo = validateText(input.memo, "메모");
  if (!memo.ok) return { ok: false, message: memo.message, field: "memo" };
  const durationMin = validateDuration(input.durationMin);
  if (!durationMin.ok) return { ok: false, message: durationMin.message, field: "durationMin" };
  return {
    ok: true,
    value: {
      startTime: startTime.value,
      activityName: activityName.value,
      memo: memo.value || null,
      durationMin: durationMin.value,
    },
  };
}

export async function addItem(slug: string, dayNumber: number, input: ItemInput): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  const checked = checkInput(input);
  if (!checked.ok) return checked;

  const dayId = await findDayId(db, slug, dayNumber);
  if (!dayId) return { ok: false, message: "해당 날짜를 찾을 수 없어요." };

  await insertRow(db, "schedule_items", slug, {
    day_id: dayId,
    start_time: checked.value.startTime,
    duration_min: checked.value.durationMin,
    activity_name: checked.value.activityName,
    memo: checked.value.memo,
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function updateItem(slug: string, itemId: string, input: ItemInput): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  const checked = checkInput(input);
  if (!checked.ok) return checked;

  if (
    !(await updateRow(db, "schedule_items", slug, itemId, {
      start_time: checked.value.startTime,
      duration_min: checked.value.durationMin,
      activity_name: checked.value.activityName,
      memo: checked.value.memo,
    }))
  ) {
    return { ok: false, message: "일정 항목을 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function deleteItem(slug: string, itemId: string): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  if (!(await deleteRow(db, "schedule_items", slug, itemId))) {
    return { ok: false, message: "일정 항목을 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function reorderItems(slug: string, dayNumber: number, ids: string[]): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  const plan = await getPlan(db, slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const day = plan.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return { ok: false, message: "해당 날짜를 찾을 수 없어요." };

  const next = reorderByIds(day.items, ids);
  if (!next.ok) return { ok: false, message: next.message };

  if (!(await reorderRows(db, "schedule_items", slug, ids))) {
    return { ok: false, message: "순서를 저장하지 못했어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

/** placeId가 null이면 연결을 끊는다. */
export async function linkPlace(slug: string, itemId: string, placeId: string | null): Promise<ActionResult> {
  if (!(await getSessionUserId())) return { ok: false, message: "로그인이 필요해요." };

  const db = await createServerClient();
  if (placeId !== null) {
    // 남의 일정 장소를 연결하지 못하게 막는다. FK만으로는 "존재하는 장소"까지만 보장된다.
    if (!(await placeExists(db, slug, placeId))) return { ok: false, message: "장소를 찾을 수 없어요.", field: "placeId" };
  }

  if (!(await updateRow(db, "schedule_items", slug, itemId, { place_id: placeId }))) {
    return { ok: false, message: "일정 항목을 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}
