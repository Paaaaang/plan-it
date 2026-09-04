/**
 * @file 서버 메모리 스토어
 * @description 이 단계의 유일한 저장소다. 뷰어가 읽는 곳과 편집기가 쓰는 곳을 같게 만든다.
 *
 * 한계를 숨기지 않는다: **서버가 재시작하면 사라지고, 인스턴스가 여럿이면 어긋난다.**
 * 개발 서버와 테스트에서는 충분하다. Supabase가 붙으면 이 파일만 바꾼다 —
 * 부르는 쪽(Server Action)은 그대로다.
 */

import { allFixturePlans } from "@/lib/fixtures/viewer";
import type { PlanStatus } from "@/types/editor";
import type { ViewerPlan } from "@/types/viewer";

// TODO(supabase): Map을 Postgres 조회/갱신으로 교체한다. 아래 함수 시그니처는 유지한다.
type State = {
  plans: Map<string, ViewerPlan>;
  /**
   * 상태는 `ViewerPlan` 밖에 둔다. 공개 DTO에 status가 있으면 공개 경로 응답에 섞일 수
   * 있는데, 타입에 없으면 서버가 담을 수 없다 — 유출을 타입이 막게 둔다.
   */
  status: Map<string, PlanStatus>;
};

let state: State | null = null;

function ensure(): State {
  if (!state) {
    // structuredClone: 픽스처 원본을 편집이 건드리지 못하게 한다.
    // 한 장소 객체를 places[]와 items[].place가 같이 참조하는데, structuredClone은
    // 클론 안에서 그 동일성을 그대로 지킨다.
    const plans = new Map(allFixturePlans().map((p) => [p.slug, structuredClone(p)]));
    // 씨앗 픽스처는 지금 뷰어가 로그인 없이 보고 있는 것들이다 = public.
    const status = new Map<string, PlanStatus>([...plans.keys()].map((s) => [s, "public"]));
    state = { plans, status };
  }
  return state;
}

export function getPlan(slug: string): ViewerPlan | undefined {
  return ensure().plans.get(slug);
}

export function updatePlan(slug: string, patch: Partial<ViewerPlan>): ViewerPlan | undefined {
  const { plans } = ensure();
  const cur = plans.get(slug);
  if (!cur) return undefined;
  const next = { ...cur, ...patch };
  plans.set(slug, next);
  return next;
}

export function getPlanStatus(slug: string): PlanStatus | undefined {
  return ensure().status.get(slug);
}

export function setPlanStatus(slug: string, status: PlanStatus): void {
  ensure().status.set(slug, status);
}

/** 테스트 격리용. 프로덕션 코드에서 부르지 않는다. */
export function resetStore(): void {
  state = null;
}
