/**
 * @file 뷰어 데이터 조회 · 비밀번호 검증 서버 액션
 * @description 공개 뷰어용 일정 데이터 조회와 비공개 일정 잠금 해제.
 *              조회는 메모리 스토어(lib/store/plans.ts)를 거친다 — 픽스처로 씨앗을 뿌리고
 *              편집기가 같은 곳에 쓴다. **공개 상태(draft/public/private)도 스토어가 진실이다.**
 *              만료만 아직 픽스처 규칙이다.
 *
 * 'use server'
 *
 * @auth 불필요 (뷰어는 익명 접근) / 비공개 일정만 비밀번호
 *
 * @actions
 *  - getBySlug(slug)              → slug로 일정 전체 데이터 조회 (plan + notices + days + items + places + transport)
 *  - verifyPassword(slug, pw)     → 비공개 일정 비밀번호 검증 + 통과 시 httpOnly 쿠키 발급
 *
 * @connects
 *  - lib/store/plans.ts           → 일정·상태 조회 (getPlan, getPlanStatus) — 편집기가 쓰는 그 스토어다
 *  - lib/fixtures/viewer.ts       → 만료 판정과 비밀번호 (isLockedSlug, EXPIRED_SLUGS, FIXTURE_PASSWORD_HASH, MAX_ATTEMPTS)
 *  - types/viewer.ts              → 반환 타입 (ViewerResult, ViewerPlan)
 *
 * @security
 *  - 인가 판정(isUnlocked)은 이 파일 안에 있다. 호출부가 `unlocked`를 넘기던 구조를
 *    걷어냈다 — 파라미터로 받으면 호출부 하나만 잊어도 게이트가 통째로 우회된다.
 *  - isUnlocked는 export하지 않는다. `'use server'` 파일의 export는 전부 공개
 *    엔드포인트가 되므로, 내부 배관은 모듈 안에 둔다.
 *
 * @todo Supabase 연동 — getBySlug 내부 조회 블록과 FIXTURE_PASSWORD_HASH만 교체 예정.
 */

"use server";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getPlan as getStoredPlan, getPlanStatus } from "@/lib/store/plans";
import {
  isLockedSlug,
  EXPIRED_SLUGS,
  FIXTURE_PASSWORD_HASH,
  MAX_ATTEMPTS,
} from "@/lib/fixtures/viewer";
import type { ViewerResult } from "@/types/viewer";

/** slug는 URL 조각이다. 이 형식이 아니면 조회도 검증도 하지 않는다. */
const SLUG_RE = /^[a-z0-9-]{1,64}$/;

function viewerSecret(): string {
  const s = process.env.VIEWER_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    // 값을 로그에 남기지 않는다. 이름만 말한다.
    throw new Error("VIEWER_SECRET이 설정되지 않았습니다.");
  }
  return "dev-only-viewer-secret";
}

function unlockToken(slug: string): string {
  return createHmac("sha256", viewerSecret()).update(slug).digest("hex");
}

const cookieName = (slug: string) => `planit_unlock_${slug}`;

/**
 * 이 요청이 해당 slug의 비밀번호를 이미 통과했는지.
 * 쿠키 값은 서버 비밀로 서명된 토큰이라 클라이언트가 위조할 수 없다.
 */
async function isUnlocked(slug: string): Promise<boolean> {
  const jar = await cookies();
  const got = jar.get(cookieName(slug))?.value;
  if (!got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(unlockToken(slug));
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * slug로 뷰어 데이터를 조회한다.
 * 반환 타입에 기획자 전용 필드가 없다 — 공개 경로가 볼 수 있는 것만 담는다.
 *
 * 비공개 일정의 인가는 여기서 스스로 판정한다(쿠키). 호출부는 넘길 것이 없다.
 * cookies()를 읽으므로 이 경로는 동적 렌더가 된다 — 스펙 §7.4의 캐시 우선 정책과
 * 부딪히지만 지금은 정확성을 택한다. DB가 붙을 때 "공개는 정적 · 비공개는 동적"으로 나눈다.
 */
export async function getBySlug(slug: string): Promise<ViewerResult> {
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    return { status: "notFound" };
  }

  // TODO(supabase): 이 블록만 Postgres 조회로 교체한다. 아래 분기 구조는 그대로 쓴다.
  if (EXPIRED_SLUGS.has(slug)) return { status: "expired" };

  // 공개 상태는 스토어가 진실이다 — 편집기의 setStatus가 쓰는 그 맵이다.
  // 세그먼트를 옮기면 이 경로가 즉시 따라야 상태가 장식이 아니게 된다.
  const status = getPlanStatus(slug);

  // 임시저장은 기획자만 보는 상태다. "있지만 못 본다"가 아니라 없는 것으로 답한다 —
  // 404와 403이 갈리면 링크를 받은 사람이 일정의 존재를 알아낼 수 있다.
  if (status === "draft") return { status: "notFound" };
  if (status === "private" && !(await isUnlocked(slug))) return { status: "locked", slug };

  const plan = getStoredPlan(slug);
  return plan ? { status: "ok", plan } : { status: "notFound" };
}

/**
 * 시도 횟수. 인스턴스 메모리에 둔다.
 *
 * ponytail: 프로세스 메모리 · slug 전역 카운터 — 인스턴스가 여럿이면 새어나가고,
 *           한 사람이 남을 잠글 수 있다(DoS). Redis가 붙는 시점에 IP+slug 키로 옮긴다.
 */
const attempts = new Map<string, { count: number; at: number }>();
const WINDOW_MS = 10 * 60_000;

/**
 * 창(window)이 지난 항목을 걷어낸다.
 *
 * 없으면 아무도 다시 오지 않는 slug의 항목이 프로세스가 죽을 때까지 남는다 —
 * `'use server'` export는 누구나 POST할 수 있으므로 그 상태는 바운드가 없다.
 * 카운터를 올릴 때만 부른다: Map에는 비공개 slug만 들어오고(아래 verifyPassword의
 * isLockedSlug 가드), 항목은 10분 뒤 전부 청소 대상이 되므로 크기가 곧 상한이다.
 *
 * ponytail: 매 실패마다 O(n) 전수 스윕 — n이 "최근 10분 안에 틀린 비공개 slug 수"라
 *           작다. Redis로 옮기면 TTL이 이 일을 대신한다.
 */
function sweepAttempts(now: number): void {
  for (const [k, v] of attempts) {
    if (now - v.at > WINDOW_MS) attempts.delete(k);
  }
}

function remainingFor(slug: string): number {
  return Math.max(0, MAX_ATTEMPTS - (attempts.get(slug)?.count ?? 0));
}

/**
 * 비공개 일정의 비밀번호를 검증한다. 통과하면 httpOnly 쿠키를 발급한다.
 * 클라이언트 검증은 UX용일 뿐이다 — 타입·길이·형식을 여기서 다시 본다.
 */
export async function verifyPassword(
  slug: string,
  password: string,
): Promise<{ ok: true } | { ok: false; remaining: number }> {
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) return { ok: false, remaining: 0 };
  // 비공개 일정이 아니면 검증할 것이 없다. 이 가드가 없으면 존재하지도 않는 slug마다
  // attempts에 항목이 생겨 공격자 입력만으로 Map이 무한히 자란다.
  // (열람 가능 여부는 이미 GET /p/[slug]가 드러내므로 새로 새는 정보는 없다.)
  if (!isLockedSlug(slug)) return { ok: false, remaining: 0 };
  if (typeof password !== "string" || password.length === 0 || password.length > 64) {
    return { ok: false, remaining: remainingFor(slug) };
  }

  const rec = attempts.get(slug);
  if (rec && Date.now() - rec.at > WINDOW_MS) attempts.delete(slug);
  if (remainingFor(slug) <= 0) return { ok: false, remaining: 0 };

  const want = FIXTURE_PASSWORD_HASH.get(slug);
  const got = createHash("sha256").update(password).digest("hex");
  const match = !!want && timingSafeEqual(Buffer.from(got, "hex"), Buffer.from(want, "hex"));

  if (!match) {
    const now = Date.now();
    sweepAttempts(now);
    const cur = attempts.get(slug) ?? { count: 0, at: now };
    attempts.set(slug, { count: cur.count + 1, at: now });
    return { ok: false, remaining: remainingFor(slug) };
  }

  attempts.delete(slug);
  const jar = await cookies();
  jar.set(cookieName(slug), unlockToken(slug), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/p/${slug}`,
    maxAge: 60 * 60 * 12,
  });
  return { ok: true };
}
