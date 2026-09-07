/**
 * @file 커버 이미지 바이트 서빙
 * @route GET /api/cover/[slug]
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
 */

import { getCoverBlob } from "@/lib/store/plans";

export async function GET(_req: Request, ctx: RouteContext<"/api/cover/[slug]">) {
  const { slug } = await ctx.params;
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
