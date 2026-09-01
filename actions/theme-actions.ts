/**
 * @file 테마 서버 액션
 * @description 라이트/다크/시스템 테마 선호를 쿠키에 저장.
 *
 * 'use server'
 *
 * @actions
 *  - setTheme(theme) → 테마 선호를 쿠키에 저장하고 레이아웃을 재검증
 *
 * @connects
 *  - lib/theme.ts                    → Theme 타입, 쿠키 이름
 *  - components/ui/theme-toggle.tsx  → 클라이언트에서 호출
 */

"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

const VALID: readonly Theme[] = ["light", "dark", "system"];

/**
 * 테마 선호를 쿠키에 저장한다.
 * httpOnly가 아닌 이유: 값이 비밀이 아니고, 클라이언트가 즉시 반영해야 하기 때문이다.
 * 인증 토큰은 이 규칙의 예외가 아니다 — 그건 언제나 httpOnly + secure다.
 */
export async function setTheme(theme: Theme): Promise<void> {
  if (!VALID.includes(theme)) {
    throw new Error("알 수 없는 테마예요");
  }
  const store = await cookies();
  store.set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/", "layout");
}
