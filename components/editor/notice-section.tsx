"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { SortableList } from "@/components/editor/sortable-list";
import { useEditor } from "@/components/editor/editor-shell";
import { reorderNotices } from "@/actions/notice-actions";
import type { ViewerNotice } from "@/types/viewer";

/**
 * 2번 섹션 — 공지 목록.
 *
 * **지금은 목록과 순서 변경까지다.** 인라인 편집·추가·삭제는 Task 5다 — 그래서 행에
 * 삭제 버튼도, "공지 추가" 줄도 아직 없다(확정 시안에는 있다).
 *
 * 거부 사유는 토스트로 낸다. 저장 상태(상단 바)에도 같은 문구가 뜨지만, 순서는 화면이
 * 이미 바뀐 뒤에 되돌아가는 일이라 눈이 가 있는 곳에서 이유를 말해야 한다.
 */
export function NoticeSection({ notices }: { notices: ViewerNotice[] }) {
  const { slug, run } = useEditor();
  const { show } = useToast();

  const reorder = useCallback(
    async (ids: string[]) => {
      let reason = "";
      const ok = await run(async () => {
        const res = await reorderNotices(slug, ids);
        if (!res.ok) reason = res.message;
        return res;
      });
      if (!ok) show(reason || "순서를 바꾸지 못했어요.", "danger");
      return ok;
    },
    [slug, run, show],
  );

  return (
    <div data-testid="notice-section">
      <SortableList
        items={notices}
        labelOf={(notice) => notice.title}
        onReorder={reorder}
        rowTestId="notice-row"
        renderItem={(notice) => (
          <div className="min-w-0 flex-1">
            <h5 className="text-caption font-bold">{notice.title}</h5>
            <p className="truncate text-micro text-tertiary">{notice.body}</p>
          </div>
        )}
      />
    </div>
  );
}
