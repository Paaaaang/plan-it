/**
 * @file 인증 서버 액션
 * @description 로그아웃 처리. 로그인은 카카오 OAuth 한 흐름뿐이라 이메일/비밀번호
 *              가입·로그인 액션이 없다 — 클라이언트에서 바로
 *              `components/auth/kakao-button.tsx`가 Supabase에 OAuth를 요청하고,
 *              `app/auth/callback/route.ts`가 코드를 세션으로 교환한다.
 *
 * @spec F-AUTH-1 (카카오 OAuth 기반 로그인/로그아웃)
 *
 * @actions
 *  - signOut() → 로그아웃 후 /login으로 리다이렉트
 *
 * @connects
 *  - lib/supabase/server.ts      → Supabase 서버 클라이언트
 *  - components/editor/top-bar.tsx → 로그아웃 버튼에서 호출
 */

"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

/** 로그아웃. 대시보드가 아직 없어 편집기 상단 바가 유일한 호출부다(2b에서 대시보드도). */
export async function signOut(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
