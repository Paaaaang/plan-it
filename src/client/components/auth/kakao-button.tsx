"use client";

import { createBrowserClient } from "@/client/supabase/client";
import { ToastProvider, useToast } from "@/client/components/ui/toast";

/**
 * 카카오 OAuth를 시작한다. Supabase가 /auth/v1/callback으로 받은 뒤 아래 redirectTo로
 * 되돌리고, app/auth/callback/route.ts가 코드를 세션으로 교환한다.
 *
 * 카카오 키가 아직 없다 — provider가 설정되지 않으면 Supabase가 오류를 돌려주고
 * 그 문구를 그대로 보여준다. 버튼이 조용히 아무것도 안 하는 것보다 낫다.
 *
 * ToastProvider를 여기서 직접 감싼다 — /login 위에 전역 Provider가 없다(DS에 토스트가
 * 있는데 로그인 실패를 브라우저 기본 alert()로 띄우던 게 문제였다). 루트 레이아웃을
 * 바꾸는 대신 이 버튼 하나의 범위로 좁힌다 — 다른 화면의 스냅샷에 영향이 없다.
 */
export function KakaoButton() {
  return (
    <ToastProvider>
      <KakaoLoginButton />
    </ToastProvider>
  );
}

function KakaoLoginButton() {
  const { show } = useToast();

  async function start() {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) show(`로그인을 시작하지 못했어요: ${error.message}`, "danger");
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
