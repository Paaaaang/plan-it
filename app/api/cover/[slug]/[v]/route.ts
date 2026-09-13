/**
 * @file 커버 이미지 바이트 서빙
 * @route GET /api/cover/[slug]/[v]
 *
 * `[v]`는 캐시 무효화 조각이다. 라우트는 이 값을 읽지 않는다 — **경로에 있는 이유**는
 * `next/image`가 로컬 이미지의 쿼리 문자열을 기본적으로 막기 때문이다(`images.localPatterns`
 * 기본값은 `search: ''`). 버전을 `?v=`로 붙였을 때 뷰어가 500으로 떨어졌다: 커버를 올린
 * 일정의 공개 링크가 통째로 죽는다. 설정을 열어 쿼리를 허용할 수도 있었지만, 그러면 우리
 * 경로에 임의 쿼리로 이미지 최적화를 요청할 수 있게 된다(Next 문서가 경고하는 그대로).
 * 경로 조각은 기본 허용 규칙 안에 있어 설정을 열 필요가 없다.
 *
 * 업로드된 커버는 아직 어디에도 올라가지 않는다(스토리지가 없다). `setCover`가 바이트를
 * 메모리 스토어에 넣고 `coverImageUrl`에는 **이 경로**를 저장한다. 그래서 저장된 값이
 * `validateCoverUrl`의 허용 목록(앱 내부 경로 또는 https)을 그대로 통과하고,
 * `<img src>`·OG 메타가 지금과 똑같이 동작한다.
 *
 * TODO(supabase): Storage가 붙으면 이 라우트는 사라지고 `coverImageUrl`이
 * 버킷 공개 URL(https)이 된다. 부르는 쪽은 바뀌지 않는다.
 *
 * 공개 경로다 — 커버는 뷰어가 로그인 없이 보는 그림이다. 기획자 전용 데이터는 없다.
 * **그래서 뷰어와 같은 문을 지나야 한다**: 뷰어(`getBySlug`)가 안 보여주는 일정의 커버를
 * 여기서 내주면 slug만 아는 사람이 임시저장·비공개 일정의 사진을 그대로 받아 간다.
 *
 * ponytail: 공개(public)가 아니면 전부 404 — 비공개는 잠금을 통과해도 막힌다.
 *   잠금 쿠키(`planit_unlock_<slug>`)가 `path=/p/<slug>`로 좁혀져 있어 이 경로로는
 *   애초에 오지 않는다. 쿠키 path를 `/`로 넓히면 통과시킬 수 있지만, 사진 한 장 때문에
 *   모든 요청에 잠금 토큰을 실어 보내는 건 나쁜 거래다. 대가는 "비공개 일정 + 업로드
 *   커버"일 때 잠금을 푼 참가자도 그 사진을 못 본다는 것 — Supabase Storage가 붙어
 *   서명 URL이 되는 순간 이 라우트와 함께 사라진다.
 */

import { getCoverBlob, getPlanStatus } from "@/lib/store/plans";

export async function GET(_req: Request, ctx: RouteContext<"/api/cover/[slug]/[v]">) {
  const { slug } = await ctx.params;
  // 없는 일정과 못 보는 일정이 같은 답을 준다 — 404와 403이 갈리면 존재가 새어 나간다.
  if (getPlanStatus(slug) !== "public") return new Response(null, { status: 404 });

  const cover = getCoverBlob(slug);
  if (!cover) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(cover.bytes), {
    headers: {
      // 업로더가 보낸 문자열이 아니라 서버 허용 목록에서 고른 값이다(setCover).
      "Content-Type": cover.contentType,
      // 브라우저가 내용을 보고 타입을 다시 추측하지 못하게 막는다 — 이미지라고 주장하는
      // HTML이 스크립트로 실행되는 경로를 여기서 끊는다.
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      // 메모리 스토어라 서버가 재시작하면 사라진다. 캐시에 남아 404를 가리면 더 헷갈린다.
      "Cache-Control": "no-store",
    },
  });
}
