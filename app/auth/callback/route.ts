/**
 * @file OAuth 콜백 — PKCE 코드를 세션으로 교환한다
 * @route GET /auth/callback
 *
 * proxy matcher에 넣지 않는다 — 세션이 없는 상태로 들어오는 것이 정상인 경로다.
 */

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing_code`);

  const supabase = await createServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  // 실패 사유를 URL에 그대로 싣지 않는다 — 로그인 화면이 공격자에게 힌트를 주지 않는다.
  if (error) return NextResponse.redirect(`${origin}/login?error=exchange_failed`);

  return NextResponse.redirect(`${origin}/dashboard`);
}
