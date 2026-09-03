/**
 * @file 뷰어 데이터 조회 서버 액션
 * @description 공개 뷰어용 일정 데이터 조회. 현재는 픽스처(lib/fixtures/viewer.ts) 기반 구현이다.
 *
 * 'use server'
 *
 * @auth 불필요 (뷰어는 익명 접근)
 *
 * @actions
 *  - getBySlug(slug, unlocked)    → slug로 일정 전체 데이터 조회 (plan + notices + days + items + places + transport)
 *
 * @connects
 *  - lib/fixtures/viewer.ts       → 픽스처 데이터 (findFixturePlan, lockedFixturePlan, LOCKED_SLUGS, EXPIRED_SLUGS)
 *  - types/viewer.ts              → 반환 타입 (ViewerResult, ViewerPlan)
 *
 * @todo verifyPassword(slug, pw)  — 비공개 비밀번호 검증. Task 8에서 이 파일에 추가한다.
 * @todo Supabase 연동             — getBySlug 내부 조회 블록만 Postgres 쿼리로 교체 예정.
 */

"use server";

import { findFixturePlan, lockedFixturePlan, LOCKED_SLUGS, EXPIRED_SLUGS } from "@/lib/fixtures/viewer";
import type { ViewerResult } from "@/types/viewer";

/**
 * slug로 뷰어 데이터를 조회한다.
 * 반환 타입에 기획자 전용 필드가 없다 — 공개 경로가 볼 수 있는 것만 담는다.
 */
export async function getBySlug(slug: string, unlocked = false): Promise<ViewerResult> {
  // 입력 검증: slug는 URL 조각이다. 형식이 아니면 조회하지 않는다.
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,64}$/.test(slug)) {
    return { status: "notFound" };
  }

  // TODO(supabase): 이 블록만 Postgres 조회로 교체한다. 아래 분기 구조는 그대로 쓴다.
  if (EXPIRED_SLUGS.has(slug)) return { status: "expired" };
  if (LOCKED_SLUGS.has(slug)) {
    if (!unlocked) return { status: "locked", slug };
    const plan = lockedFixturePlan(slug);
    return plan ? { status: "ok", plan } : { status: "notFound" };
  }
  const plan = findFixturePlan(slug);
  return plan ? { status: "ok", plan } : { status: "notFound" };
}
