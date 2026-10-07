/**
 * @file 편집기 입력·결과 타입
 * @description Server Action이 주고받는 모양. 뷰어 DTO(src/shared/types/viewer.ts)와 일부러 분리한다 —
 *              `PlanStatus`는 기획자 전용 값이라 `ViewerPlan`에 들어가면 공개 경로로 샌다.
 */

/** Server Action의 공통 반환. 실패 사유를 화면이 그대로 보여줄 수 있어야 한다. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; message: string; field?: string };

export type PlanStatus = "draft" | "public" | "private";

export type BasicInfoInput = {
  title: string;
  startDate: string;
  endDate: string;
  planType: string;
  partyLabel: string;
};

export type NoticeInput = { title: string; body: string };

export type ItemInput = {
  startTime: string;
  activityName: string;
  memo: string;
  durationMin: number | null;
};

export type PlaceInput = {
  name: string;
  address: string;
  memo: string;
  tags: string[];
  isPinned: boolean;
};
