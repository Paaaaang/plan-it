import { cookies } from "next/headers";

/**
 * 테마 선호. 쿠키가 단일 소스다.
 * 뷰어는 로그인이 없어 DB에 저장할 수 없고, 기획자만 DB를 쓰면 두 소스가 어긋난다.
 * 로그인 사용자의 기기 간 이월은 로그인 시점에 DB 값을 쿠키로 내려주는 방식으로만 한다.
 */
export type Theme = "light" | "dark" | "system";

export const THEME_COOKIE = "planit-theme";

const VALID: readonly Theme[] = ["light", "dark", "system"];

function parse(value: string | undefined): Theme {
  return VALID.includes(value as Theme) ? (value as Theme) : "system";
}

/** 서버에서 현재 테마를 읽는다. */
export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return parse(store.get(THEME_COOKIE)?.value);
}
