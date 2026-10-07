/**
 * @file 비밀번호 시도 카운터
 * @description `src/server/actions/viewer-actions.ts`(`'use server'`)에서 옮겨 왔다.
 *              `'use server'` 파일의 모든 export는 클라이언트가 부를 수 있는 엔드포인트가
 *              된다 — reseed(Task 4)가 카운터를 초기화하려고 export를 더할 자리로
 *              `'use server'` 파일은 맞지 않는다.
 */
// MAX_ATTEMPTS는 픽스처 쪽 상수를 그대로 되내보낸다 — 뷰어 페이지가 이 파일 하나만
// import하면 되게(비밀번호 시도에 관한 건 전부 여기), 값의 원천은 fixtures/viewer.ts 그대로 둔다.
import { MAX_ATTEMPTS } from "@/shared/fixtures/viewer";
export { MAX_ATTEMPTS };

/**
 * 시도 횟수. 인스턴스 메모리에 둔다.
 *
 * `globalThis`에 두는 이유는 `src/server/store/plans.ts`의 커버 스토어와 같다: Next는
 * Route Handler를 페이지·Server Action과 **별도 번들**로 만든다. `verifyPassword`는
 * Server Action 번들에서, reseed는 Route Handler 번들에서 이 파일을 각자 import하므로
 * 모듈 스코프 변수로 두면 두 번들이 서로 다른 Map을 들고 돈다 — reseed가 지운 건
 * verifyPassword가 보는 카운터가 아니게 된다(잠금이 안 풀린다).
 *
 * ponytail: 프로세스 메모리 · slug 전역 카운터 — 인스턴스가 여럿이면 새어나가고,
 *           한 사람이 남을 잠글 수 있다(DoS). Redis가 붙는 시점에 IP+slug 키로 옮긴다.
 */
const g = globalThis as typeof globalThis & {
  __planitAttempts?: Map<string, { count: number; at: number }>;
};
export const attempts: Map<string, { count: number; at: number }> = (g.__planitAttempts ??= new Map());
export const WINDOW_MS = 10 * 60_000;

/**
 * 창(window)이 지난 항목을 걷어낸다.
 *
 * 없으면 아무도 다시 오지 않는 slug의 항목이 프로세스가 죽을 때까지 남는다 —
 * `'use server'` export는 누구나 POST할 수 있으므로 그 상태는 바운드가 없다.
 * 카운터를 올릴 때만 부른다: Map에는 비공개 slug만 들어오고(src/server/actions/viewer-actions.ts의
 * verifyPassword가 getPlanMeta로 status==='private'인지 먼저 본다), 항목은 10분 뒤
 * 전부 청소 대상이 되므로 크기가 곧 상한이다.
 *
 * ponytail: 매 실패마다 O(n) 전수 스윕 — n이 "최근 10분 안에 틀린 비공개 slug 수"라
 *           작다. Redis로 옮기면 TTL이 이 일을 대신한다.
 */
export function sweepAttempts(now: number): void {
  for (const [k, v] of attempts) {
    if (now - v.at > WINDOW_MS) attempts.delete(k);
  }
}

export function remainingFor(slug: string): number {
  return Math.max(0, MAX_ATTEMPTS - (attempts.get(slug)?.count ?? 0));
}

/**
 * 그 slug의 시도 기록을 지운다. 테스트 격리 전용이다(app/api/test/reseed).
 *
 * 카운터는 여전히 프로세스 메모리라 reseed가 DB만 되돌려서는 부족하다 —
 * 앞 테스트가 5번 틀리고 끝나면 다음 테스트가 잠긴 채로 시작한다.
 *
 * ponytail: 카운터 자체를 DB/Redis로 옮기는 것은 별개 결정이다. 그때 이 함수는
 *           TRUNCATE나 TTL로 대체된다.
 */
export function resetAttempts(slug: string): void {
  attempts.delete(slug);
}
