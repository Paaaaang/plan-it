/**
 * @file 일정 기본 정보 · 상태 · 커버 서버 액션
 * @description 편집기가 일정 자체를 고치는 경로. 검증은 전부 이 안에서 한다 —
 *              클라이언트 검증은 UX용일 뿐이다. 저장은 메모리 스토어(lib/store/plans.ts)로 간다.
 *
 * 'use server'
 *
 * @auth 미구현 — proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
 *       각 액션 첫 줄의 `TODO(auth)`가 인증이 붙을 때 채워야 할 자리다.
 *
 * @actions
 *  - saveBasicInfo(slug, input)  → 제목·기간·유형·인원 저장 (F-EDIT-BASIC-1)
 *  - setStatus(slug, status)     → draft/public/private 전환 (F-STATE-2)
 *  - setCover(slug, url)         → 커버 이미지 주소 설정/해제
 *
 * @connects
 *  - lib/store/plans.ts          → 조회·갱신 (getPlan, updatePlan, setPlanStatus)
 *  - lib/editor/validate.ts      → 입력 검증
 *  - types/editor.ts             → ActionResult, BasicInfoInput, PlanStatus
 *  - types/viewer.ts             → 저장 대상 모양 (ViewerPlan)
 *
 * @important 상태(status)는 ViewerPlan에 없다 — 공개 DTO라서다. 스토어의 별도 맵에 둔다.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getPlan, updatePlan, setPlanStatus } from "@/lib/store/plans";
import {
  validateTitle,
  validateDate,
  validateRange,
  validateText,
  validateStatus,
  validateCoverUrl,
} from "@/lib/editor/validate";
import type { ActionResult, BasicInfoInput } from "@/types/editor";

export async function saveBasicInfo(slug: string, input: BasicInfoInput): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
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
  if (!range.ok) return { ok: false, message: range.message, field: "endDate" };

  const planType = validateText(input.planType, "유형", 20);
  if (!planType.ok) return { ok: false, message: planType.message, field: "planType" };

  const partyLabel = validateText(input.partyLabel, "인원", 40);
  if (!partyLabel.ok) return { ok: false, message: partyLabel.message, field: "partyLabel" };

  updatePlan(slug, {
    title: title.value,
    startDate: start.value,
    endDate: end.value,
    planType: planType.value,
    partyLabel: partyLabel.value || null,
  });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function setStatus(slug: string, status: string): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const checked = validateStatus(status);
  if (!checked.ok) return { ok: false, message: checked.message, field: "status" };

  setPlanStatus(slug, checked.value);

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}

export async function setCover(slug: string, url: string | null): Promise<ActionResult> {
  // TODO(auth): 소유자 확인. proxy.ts가 스텁이라 지금은 아무나 부를 수 있다.
  const plan = getPlan(slug);
  if (!plan) return { ok: false, message: "일정을 찾을 수 없어요." };

  const cover = validateCoverUrl(url);
  if (!cover.ok) return { ok: false, message: cover.message, field: "coverImageUrl" };

  updatePlan(slug, { coverImageUrl: cover.value });

  revalidatePath(`/p/${slug}`);
  return { ok: true, data: undefined };
}
