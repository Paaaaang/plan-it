"use client";

import { useCallback, useState } from "react";
import type { ActionResult } from "@/types/editor";

/**
 * 저장 상태. 넷이다: idle(변경 없음) · saving · saved(+언제) · error.
 *
 * `at`은 **클라이언트에서만** 찍힌다. 서버가 상대 시각("방금")을 계산하면
 * 하이드레이션 불일치가 난다 — 저장은 애초에 클라이언트 상호작용이라 그럴 일이 없다.
 */
export type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: number }
  | { kind: "error"; message: string; field?: string };

export function useEditorPlan() {
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  /** Server Action 하나를 감싸 저장 상태를 굴린다. 성공하면 true. */
  const run = useCallback(async (action: () => Promise<ActionResult<unknown>>) => {
    setSave({ kind: "saving" });
    const res = await action();
    if (res.ok) {
      setSave({ kind: "saved", at: Date.now() });
      return true;
    }
    setSave({ kind: "error", message: res.message, field: res.field });
    return false;
  }, []);

  const clearError = useCallback(() => setSave({ kind: "idle" }), []);

  return { save, run, clearError };
}
