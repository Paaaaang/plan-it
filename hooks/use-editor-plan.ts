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

  /**
   * Server Action 하나를 감싸 저장 상태를 굴린다. 성공하면 true.
   *
   * **거부와 실패는 다르다.** 액션이 `{ok:false}`를 주는 것은 서버가 답한 것이고,
   * 예외로 끝나는 것은 답이 없는 것이다(연결이 끊기면 fetch가 throw한다). 잡지 않으면
   * 상태가 "저장 중…"에 굳고, 부르는 쪽의 되돌리기 코드가 통째로 건너뛰어진다 —
   * 화면은 저장된 것처럼 보이는데 서버에는 아무것도 안 갔다.
   *
   * 편집기의 모든 저장이 이 한 함수를 지난다(제목·커버·상태·정렬·공지). 그래서 잡는
   * 자리도 여기 하나다 — 액션마다 try/catch를 붙이면 다음에 추가되는 액션이 빠뜨린다.
   */
  const run = useCallback(async (action: () => Promise<ActionResult<unknown>>) => {
    setSave({ kind: "saving" });
    let res: ActionResult<unknown>;
    try {
      res = await action();
    } catch {
      // 이유를 그대로 옮기지 않는다 — 네트워크 예외 메시지는 사용자에게 뜻이 없다.
      setSave({ kind: "error", message: "저장하지 못했어요. 연결을 확인해 주세요." });
      return false;
    }
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
