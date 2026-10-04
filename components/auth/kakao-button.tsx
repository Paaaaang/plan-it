"use client";

import { createBrowserClient } from "@/lib/supabase/client";

/**
 * 카카오 OAuth를 시작한다. Supabase가 /auth/v1/callback으로 받은 뒤 아래 redirectTo로
 * 되돌리고, app/auth/callback/route.ts가 코드를 세션으로 교환한다.
 *
 * 카카오 키가 아직 없다 — provider가 설정되지 않으면 Supabase가 오류를 돌려주고
 * 그 문구를 그대로 보여준다. 버튼이 조용히 아무것도 안 하는 것보다 낫다.
 */
export function KakaoButton() {
  async function start() {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(`로그인을 시작하지 못했어요: ${error.message}`);
  }

  return (
    <button
      type="button"
      onClick={start}
      // 카카오 브랜드 색(#FEE500·#191600)은 토큰에 없고 카카오가 지정한 고정값이다.
      // 임의로 만든 값이 아니므로 인라인으로 둔다 — 이 파일 한 곳에서만 쓴다.
      className="flex w-full items-center justify-center gap-2 rounded-field bg-[#FEE500] py-3 text-label font-bold text-[#191600]"
    >
      카카오로 시작하기
    </button>
  );
}
