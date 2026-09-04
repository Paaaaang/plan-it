"use client";

import { ToastProvider } from "@/components/ui/toast";
import { TopBar } from "@/components/editor/top-bar";
import type { PlanStatus } from "@/types/editor";
import type { ViewerPlan } from "@/types/viewer";

/**
 * 편집기 셸 — 전폭 상단 바 + 좌우 2단(왼쪽 섹션 · 오른쪽 미리보기).
 *
 * 1024px 미만에서는 1단으로 접히고 미리보기가 아래로 내려간다(스펙 §5.2).
 * **레이아웃까지만이다** — 하단 시트로 바꿔 다는 것은 Task 7이다.
 *
 * 스크롤은 왼쪽 열이 갖는다(h-dvh + 내부 overflow). 상단 바는 항상 화면에 남는다.
 */
export function EditorShell({
  plan,
  status,
  children,
}: {
  plan: ViewerPlan;
  status: PlanStatus;
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex h-dvh flex-col">
        <TopBar plan={plan} status={status} />

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <main className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-y-auto p-5">
            {children}
          </main>

          {/* Task 7이 폰 프레임 미리보기를 채운다. 지금은 자리만 잡는다. */}
          <aside
            data-testid="editor-preview"
            className="flex shrink-0 flex-col items-center gap-3 border-default bg-sunken p-5 lg:w-[424px] lg:border-l"
          >
            <p className="text-micro font-extrabold tracking-wide text-tertiary">
              참가자가 보는 화면
            </p>
          </aside>
        </div>
      </div>
    </ToastProvider>
  );
}
