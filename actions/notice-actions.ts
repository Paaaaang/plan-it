/**
 * @file 공지 CRUD + 순서 변경 서버 액션
 * @description 공지(Notice) 추가·수정·삭제·순서 변경. 행 단위로 Postgres에 쓴다 —
 *              목록 전체를 다시 쓰던 메모리 스토어 시절의 방식은 여기서 끝났다.
 *
 * 'use server'
 *
 * @auth 미구현 — proxy.ts가 스텁이라 지금은 아무나 부를 수 있다 (각 액션의 TODO(auth) 참고).
 *
 * @actions
 *  - addNotice(slug, input)      → 공지 추가 (F-EDIT-NOTICE-1)
 *  - updateNotice(slug, id, input) → 공지 수정
 *  - deleteNotice(slug, id)      → 공지 삭제
 *  - reorderNotices(slug, ids)   → 순서 변경 (F-EDIT-NOTICE-3)
 *
 * @connects
 *  - lib/store/plans.ts          → 조회·행 단위 쓰기 (getPlan, insertRow, updateRow, deleteRow, reorderRows)
 *  - lib/editor/validate.ts      → 입력 검증 + reorderByIds
 *  - types/editor.ts             → ActionResult, NoticeInput
 *  - types/viewer.ts             → ViewerNotice
 *
 * @important reorder는 인덱스가 아니라 **id 배열**을 받는다. 인덱스는 동시 편집에서 어긋난다.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getPlan, insertRow, updateRow, deleteRow, reorderRows } from "@/lib/store/plans";
import { validateTitle, validateText, reorderByIds } from "@/lib/editor/validate";
import type { ActionResult, NoticeInput } from "@/types/editor";
import type { ViewerNotice } from "@/types/viewer";

function checkInput(input: NoticeInput): { ok: true; value: Omit<ViewerNotice, "id"> } | { ok: false; message: string; field: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "입력을 확인해 주세요.", field: "title" };
  const title = validateTitle(input.title);
  if (!title.ok) return { ok: false, message: title.message, field: "title" };
  const body = validateText(input.body, "내용");
  if (!body.ok) return { ok: false, message: body.message, field: "body" };
  return { ok: true, value: { title: title.value, body: body.value } };
}

export async function addNotice(slug: string, input: NoticeInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const checked = checkInput(input);
  if (!checked.ok) return checked;

  if (!(await insertRow("notices", slug, { title: checked.value.title, body: checked.value.body }))) {
    return { ok: false, message: "일정을 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function updateNotice(slug: string, id: string, input: NoticeInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const checked = checkInput(input);
  if (!checked.ok) return checked;

  // 행이 없으면 false — "없는 공지"와 "남의 일정 공지"가 같은 답을 준다.
  if (!(await updateRow("notices", slug, id, { title: checked.value.title, body: checked.value.body }))) {
    return { ok: false, message: "공지를 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function deleteNotice(slug: string, id: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  if (!(await deleteRow("notices", slug, id))) {
    return { ok: false, message: "공지를 찾을 수 없어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function reorderNotices(slug: string, ids: string[]): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = await getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  // 검증은 그대로 쓴다 — 길이·중복·미지의 id를 여기서 거른다.
  const next = reorderByIds(plan.notices, ids);
  if (!next.ok) return { ok: false, message: next.message };

  if (!(await reorderRows("notices", slug, ids))) {
    return { ok: false, message: "순서를 저장하지 못했어요." };
  }

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}
