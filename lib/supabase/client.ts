/**
 * @file Supabase 브라우저 클라이언트
 * @description Client Component에서 사용하는 Supabase 클라이언트.
 *              소셜 로그인 등 브라우저 사이드 인증에 사용.
 *
 * @usage Client Component ('use client')에서 import하여 사용
 *
 * @connects
 *  - components/auth/kakao-button.tsx → 실제 소비자. 소셜 로그인 버튼이 직접 부른다
 *                                        (app/(auth)/login/page.tsx는 이 컴포넌트를
 *                                        렌더할 뿐 자신은 이 클라이언트를 import하지 않는다)
 *  - hooks/use-auth.ts, hooks/use-plan.ts → 본문 0줄 문서 스텁. 아직 아무도 안 부른다
 *
 * @env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

"use client";

import { createBrowserClient as createBrowser } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 브라우저 클라이언트. anon 키만 쓴다 — 이 키는 공개 전제이고,
 * RLS 기본 거부가 걸려 있어 이 키로는 어떤 테이블도 읽히지 않는다(1단계에서 확인).
 * 하는 일은 카카오 OAuth 리다이렉트를 시작하는 것뿐이다.
 */
export function createBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  return createBrowser(url, key);
}
