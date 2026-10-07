/**
 * @file 날짜 산술
 * @description "YYYY-MM-DD" 문자열끼리의 더하기·빼기. 표시용 포맷은
 *              `src/shared/viewer/summary.ts`에 있다 — 여기는 계산만 한다.
 *
 * **UTC로만 계산한다.** 날짜 문자열에는 시각도 타임존도 없으므로, 로컬 TZ로 파싱하면
 * 서머타임·자정 경계에서 하루가 밀린다. `Date.UTC`는 그 여지를 없앤다.
 *
 * @connects
 *  - src/server/actions/plan-actions.ts   → 기간 변경 시 일차(days) 재계산
 *  - src/shared/editor/validate.ts    → 기간 상한 검사
 */

function utcMs(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** "YYYY-MM-DD"에 n일을 더한다. */
export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** end - start (일). 같은 날이면 0. */
export function diffDays(start: string, end: string): number {
  return Math.round((utcMs(end) - utcMs(start)) / 86_400_000);
}
