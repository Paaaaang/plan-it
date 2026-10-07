/**
 * @file Supabase 관리자/서비스 롤 클라이언트
 * @description RLS를 우회하는 서비스 롤 키 기반 클라이언트.
 *              뷰어 데이터 조회(공개 읽기), analytics 이벤트 기록,
 *              관리자 작업(모더레이션/공지) 등 서버 전용 작업에 사용.
 *
 * @security 서버 사이드에서만 사용. 절대 클라이언트에 노출 금지.
 *
 * @connects — 실제로 **부르는** 곳 다섯 자리뿐이다(그렙 확인). 콘솔 액션(plan·notice·
 * place·schedule·transport)은 전부 lib/supabase/server.ts(사용자 JWT)를 쓰고, 이 파일을
 * import조차 하지 않는다 — eslint.config.mjs의 no-restricted-imports가 그걸 고정한다.
 *  - actions/viewer-actions.ts                     → 공개 뷰어. 로그인이 없어 auth.uid()가 없다
 *  - app/api/cover/[slug]/[v]/route.ts              → 공개 커버. 뷰어와 같은 문(status 검사)
 *  - app/api/test/session/[userKey]/route.ts        → 테스트 전용. admin API가 서비스 롤을 요구한다
 *  - lib/store/plans.ts (reseedPlan)                → 테스트 전용. RLS 우회가 목적이다
 *
 *  actions/admin-actions.ts·actions/analytics-actions.ts는 본문 0줄인 문서 스텁이다 —
 *  관리자 콘솔(2c)이 실제로 구현되면 그때 소비자가 된다.
 *
 * @env SUPABASE_SERVICE_ROLE_KEY (서버 전용, NEXT_PUBLIC_ 아님)
 *
 * 1단계에서는 패키지가 없어 못 넣었다. Next 문서의 DAL 예시가 이 import를 쓰고,
 * 이 단계에서 @supabase/ssr과 함께 들어왔다 — 서비스 롤 키가 클라이언트 번들에
 * 닿는 경로를 컴파일 타임에 막는다.
 */

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | undefined;

/**
 * 서비스 롤 클라이언트. **서버 전용이다** — 'use client' 파일에서 import하면 안 된다.
 *
 * 왜 서비스 롤인가: 공개 뷰어는 로그인이 없다(스펙 §3.3 — "뷰어는 서버를 통해
 * slug + status 조건으로만 조회"). 인가는 이 파일이 아니라 부르는 쪽이 한다
 * (viewer-actions.ts의 status·expires_at·쿠키 판정).
 *
 * 모듈 캐시를 쓰는 이유: 요청마다 클라이언트를 새로 만들면 연결이 쌓인다.
 * 세션이 없는 클라이언트라 요청 간에 공유해도 사용자 상태가 섞이지 않는다.
 */
export function adminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // 값을 로그에 남기지 않는다. 이름만 말한다(viewerSecret과 같은 규칙).
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
