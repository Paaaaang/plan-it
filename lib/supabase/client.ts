/**
 * @file Supabase 브라우저 클라이언트
 * @description Client Component에서 사용하는 Supabase 클라이언트.
 *              소셜 로그인 등 브라우저 사이드 인증에 사용.
 *
 * @usage Client Component ('use client')에서 import하여 사용
 *
 * @connects
 *  - app/(auth)/login/page.tsx   → 소셜 로그인 시
 *  - hooks/use-auth.ts           → 클라이언트 사이드 인증 상태 구독
 *  - hooks/use-plan.ts           → 실시간 구독 (필요 시)
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
