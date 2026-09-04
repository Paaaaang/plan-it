/**
 * @file 타임테이블 항목 CRUD + 장소 연결 서버 액션
 * @description Day 안의 항목(ViewerItem) 추가·수정·삭제·순서 변경과 장소 연결.
 *              Day는 일정의 기간에서 파생되므로 여기서 만들지 않는다 — dayNumber로 찾아 쓴다.
 *              목록은 언제나 배열 전체를 새로 써서 스토어에 넣는다(부분 변형 금지).
 *
 * 'use server'
 *
 * @auth 미구현 — proxy.ts가 스텁이라 지금은 아무나 부를 수 있다 (각 액션의 TODO(auth) 참고).
 *
 * @actions
 *  - addItem(slug, dayNumber, input)     → 항목 추가 (F-EDIT-TT-2)
 *  - updateItem(slug, itemId, input)     → 항목 수정
 *  - deleteItem(slug, itemId)            → 항목 삭제
 *  - reorderItems(slug, dayNumber, ids)  → 순서 변경 (F-EDIT-TT-4)
 *  - linkPlace(slug, itemId, placeId)    → 장소 연결/해제 (F-EDIT-TT-5)
 *
 * @connects
 *  - lib/store/plans.ts          → 조회·갱신 (getPlan, updatePlan)
 *  - lib/editor/validate.ts      → 입력 검증 + reorderByIds
 *  - types/editor.ts             → ActionResult, ItemInput
 *  - types/viewer.ts             → ViewerDay, ViewerItem
 *
 * @important 항목은 장소 객체를 **박아서** 들고 있다(ViewerItem.place). 장소가 바뀌면
 *            actions/place-actions.ts가 이 사본까지 같이 고친다.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getPlan, updatePlan } from "@/lib/store/plans";
import {
  validateTime,
  validateTitle,
  validateText,
  validateDuration,
  reorderByIds,
} from "@/lib/editor/validate";
import type { ActionResult, ItemInput } from "@/types/editor";
import type { ViewerDay, ViewerItem } from "@/types/viewer";

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

/** 항목 하나만 바꾼 days 배열을 새로 만든다. 어느 Day에 있는지는 모르고 id로 찾는다. */
function mapItem(days: ViewerDay[], itemId: string, fn: (item: ViewerItem) => ViewerItem): ViewerDay[] {
  return days.map((d) => ({ ...d, items: d.items.map((it) => (it.id === itemId ? fn(it) : it)) }));
}

function hasItem(days: ViewerDay[], itemId: string): boolean {
  return days.some((d) => d.items.some((it) => it.id === itemId));
}

export async function addItem(slug: string, dayNumber: number, input: ItemInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };
  if (!plan.days.some((d) => d.dayNumber === dayNumber)) {
    return { ok: false, message: "해당 날짜를 찾을 수 없어요." };
  }

  const checked = checkInput(input);
  if (!checked.ok) return checked;

  const item: ViewerItem = { id: crypto.randomUUID(), ...checked.value, place: null };
  updatePlan(slug, {
    days: plan.days.map((d) => (d.dayNumber === dayNumber ? { ...d, items: [...d.items, item] } : d)),
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function updateItem(slug: string, itemId: string, input: ItemInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };
  if (!hasItem(plan.days, itemId)) return { ok: false, message: "일정 항목을 찾을 수 없어요." };

  const checked = checkInput(input);
  if (!checked.ok) return checked;

  updatePlan(slug, { days: mapItem(plan.days, itemId, (it) => ({ ...it, ...checked.value })) });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function deleteItem(slug: string, itemId: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };
  if (!hasItem(plan.days, itemId)) return { ok: false, message: "일정 항목을 찾을 수 없어요." };

  updatePlan(slug, {
    days: plan.days.map((d) => ({ ...d, items: d.items.filter((it) => it.id !== itemId) })),
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function reorderItems(slug: string, dayNumber: number, ids: string[]): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const day = plan.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return { ok: false, message: "해당 날짜를 찾을 수 없어요." };

  const next = reorderByIds(day.items, ids);
  if (!next.ok) return { ok: false, message: next.message };

  updatePlan(slug, {
    days: plan.days.map((d) => (d.dayNumber === dayNumber ? { ...d, items: next.value } : d)),
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

/** placeId가 null이면 연결을 끊는다. */
export async function linkPlace(slug: string, itemId: string, placeId: string | null): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };
  if (!hasItem(plan.days, itemId)) return { ok: false, message: "일정 항목을 찾을 수 없어요." };

  const place = placeId === null ? null : plan.places.find((p) => p.id === placeId);
  if (place === undefined) return { ok: false, message: "장소를 찾을 수 없어요.", field: "placeId" };

  updatePlan(slug, { days: mapItem(plan.days, itemId, (it) => ({ ...it, place })) });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}
