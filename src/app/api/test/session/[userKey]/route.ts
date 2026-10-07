/**
 * @file E2E 세션 발급
 * @route POST /api/test/session/[userKey]
 *
 * 카카오 OAuth 왕복은 로컬에서 탈 수 없다. 그래서 테스트는 admin API로 사용자를 만들고
 * 매직링크 토큰을 세션으로 교환한다. 덮는 범위는 **콜백 이후 전부**다 — 세션 쿠키,
 * proxy 게이트, DAL, RLS, 소유권 격리. 못 덮는 것은 provider 설정 몇 줄이다.
 *
 * 비밀번호 grant를 켜지 않는 이유: 카카오만 쓰는 앱에 비밀번호 로그인 엔드포인트를
 * 열면 테스트 편의를 위해 인증 표면이 넓어진다. 매직링크는 admin API가 생성할 뿐
 * 공개 가입 흐름을 만들지 않는다.
 *
 * 프로덕션에는 존재하지 않는다(reseed와 같은 규약). 받는 값은 고정된 키 두 개뿐이라
 * 요청이 임의 계정을 만들 수 없다.
 */

import { adminClient } from "@/server/supabase/admin";
import { createServerClient } from "@/server/supabase/server";
import { SEED_OWNER_EMAIL, SEED_OWNER_ID } from "@/server/store/seed-sql";

/** 테스트가 쓸 수 있는 정체성. 요청이 임의 이메일을 넣지 못하게 고정 목록으로 둔다. */
const USERS: Record<string, { id?: string; email: string }> = {
  owner: { id: SEED_OWNER_ID, email: SEED_OWNER_EMAIL },
  other: { email: "other-planner@plan-it.test" },
};

export async function POST(_req: Request, ctx: RouteContext<"/api/test/session/[userKey]">) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });

  const { userKey } = await ctx.params;
  const user = USERS[userKey];
  if (!user) return new Response(null, { status: 404 });

  const admin = adminClient();

  // owner는 seed가 이미 만들었다. other는 처음 호출될 때 만든다 — 두 번째 호출부터는
  // "이미 있다"(email_exists)가 정상 진행 상태다. 그 외 에러(쿼터·GoTrue 다운·스키마
  // 문제처럼 seedOwnerSql()에서 실제로 겪은 것)를 삼키면 안 된다 — 삼키면 아래
  // generateLink가 기존 사용자를 찾아 204를 돌려주는 것처럼 보여도 "방금 만든 계정"과
  // "방금 실패해서 예전 상태 그대로인 계정"을 구분할 길이 없어진다.
  if (!user.id) {
    const { error: createError } = await admin.auth.admin.createUser({ email: user.email, email_confirm: true });
    if (createError && createError.code !== "email_exists") return new Response(null, { status: 500 });
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: user.email,
  });
  if (error || !data.properties) return new Response(null, { status: 500 });

  // verifyOtp가 쿠키를 심는다 — SSR 클라이언트를 써야 응답 쿠키에 실린다.
  const supabase = await createServerClient();
  const { error: otpError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: data.properties.hashed_token,
  });
  if (otpError) return new Response(null, { status: 500 });

  return new Response(null, { status: 204 });
}
