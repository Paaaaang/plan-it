/**
 * @file E2E 픽스처 되돌리기
 * @route POST /api/test/reseed/[slug]
 *
 * 스토어가 프로세스 메모리라(`lib/store/plans.ts`) 테스트가 남긴 값이 **다음 실행까지**
 * 살아남는다. 중간에 죽은 런이 바꿔 놓은 순서 위에서 다음 런이 시작해 첫 단언부터
 * 넘어지는 일이 실제로 있었다. 테스트가 끝에서 되돌리는 방식으로는 못 막는다 —
 * 되돌리기에 닿기 전에 넘어지면 그 되돌리기는 돌지 않는다.
 *
 * 그래서 되돌리기를 **시작 쪽**으로 옮긴다: 각 테스트가 자기 slug를 씨앗부터 다시 세운다.
 *
 * 프로덕션에는 이 문이 존재하지 않는다(404). 인증 뒤에 두지 않고 아예 없애는 쪽을
 * 고른 이유: 인증은 실수로 풀릴 수 있지만 없는 라우트는 풀릴 것이 없다. 받는 값도
 * slug 하나뿐이고, 하는 일은 **서버가 들고 있는 픽스처로 되돌리기**다 — 본문으로 상태를
 * 주입할 수 없다.
 *
 * TODO(supabase): 이 라우트는 메모리 스토어의 산물이 아니라 **테스트 격리 장치**다.
 *   Postgres로 옮긴 뒤에도 남는다. 트랜잭션 롤백으로 바꾸려면 Playwright가 서버의
 *   요청 경계와 트랜잭션을 공유해야 하는데 dev 서버 구조상 그럴 수 없다.
 */

import { reseedPlan } from "@/lib/store/plans";

export async function POST(_req: Request, ctx: RouteContext<"/api/test/reseed/[slug]">) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });

  const { slug } = await ctx.params;
  // 픽스처에 없는 slug는 되돌릴 씨앗이 없다 — 조용히 성공하면 테스트가 오타를 못 본다.
  return new Response(null, { status: (await reseedPlan(slug)) ? 204 : 404 });
}
