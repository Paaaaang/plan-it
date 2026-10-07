"use client";

import { useCallback } from "react";
import { useToast } from "@/client/components/ui/toast";
import { useEditor } from "@/client/components/editor/editor-shell";
import type { ActionResult } from "@/shared/types/editor";

/**
 * 섹션 액션 하나를 저장 상태에 걸고, 거부 사유를 토스트로 낸다. 성공하면 true.
 *
 * 공지·타임테이블·장소 세 섹션이 같은 처리를 한다(추가·수정·삭제·정렬·연결). 세 번 베껴
 * 두면 다음에 생기는 섹션이 사유를 안 내거나 저장 상태를 안 굴리는 쪽으로 어긋난다.
 *
 * 왜 토스트도 필요한가: 저장 상태(상단 바)에 같은 문구가 뜨지만 눈은 방금 만진 행에 가 있다.
 */
export function useEditorAction(): (action: () => Promise<ActionResult<unknown>>) => Promise<boolean> {
  const { run } = useEditor();
  const { show } = useToast();

  return useCallback(
    async (action) => {
      let reason = "";
      const ok = await run(async () => {
        const res = await action();
        if (!res.ok) reason = res.message;
        return res;
      });
      // 사유가 비었다 = 응답이 아니라 예외로 끝났다(run이 잡는다). 그래도 말은 해야 한다.
      if (!ok) show(reason || "저장하지 못했어요. 연결을 확인해 주세요.", "danger");
      return ok;
    },
    [run, show],
  );
}
