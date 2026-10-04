import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

/**
 * @file 인가의 단일 지점 (Data Access Layer)
 *
 * Next 문서가 권하는 구조다(authentication.md의 "Creating a Data Access Layer").
 * proxy는 쿠키 유무만 보는 낙관적 검사라 **보증이 되지 않는다** — prefetch에서도 돌고,
 * 쿠키가 있다는 것이 유효한 세션을 뜻하지도 않는다. 진짜 판정은 데이터에 가까운 여기서 한다.
 *
 * `cache()`로 감싸는 이유: 한 렌더 패스에서 페이지와 여러 액션이 각각 불러도 검증이
 * 한 번만 돈다(lib/viewer/get-plan.ts가 같은 이유로 쓴다).
 *
 * getUser()를 쓴다 — getSession()은 쿠키를 그대로 믿어서 위조를 통과시킨다.
 */
export const getSessionUserId = cache(async (): Promise<string | null> => {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
});

/**
 * 세션이 없으면 /login으로 보낸다. 콘솔 페이지가 쓴다.
 *
 * **액션은 이걸 쓰지 않는다** — 액션에서 redirect를 던지면 사용자는 폼이 조용히
 * 사라지는 것을 본다. 액션은 `getSessionUserId()`를 직접 보고 ActionResult로 답한다.
 */
export const verifySession = cache(async (): Promise<{ userId: string }> => {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  return { userId };
});
