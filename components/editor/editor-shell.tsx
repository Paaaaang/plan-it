"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { TopBar } from "@/components/editor/top-bar";
import { useEditorPlan, type SaveState } from "@/hooks/use-editor-plan";
import { saveBasicInfo } from "@/actions/plan-actions";
import type { ActionResult, BasicInfoInput, PlanStatus } from "@/types/editor";
import type { ViewerPlan } from "@/types/viewer";

type EditorContextValue = {
  slug: string;
  /** 편집 중인 기본 정보. 상단 바와 1번 섹션이 **같은 한 벌**을 본다. */
  basics: BasicInfoInput;
  /** 입력 중 로컬 반영. 저장하지 않는다. */
  edit: (patch: Partial<BasicInfoInput>) => void;
  /** 서버에 저장한다. 거부되면 마지막 저장 값으로 되돌린다. */
  commit: () => Promise<void>;
  save: SaveState;
  /** 다른 액션(상태 전환·커버)도 같은 저장 상태 슬롯을 쓴다. */
  run: (action: () => Promise<ActionResult<unknown>>) => Promise<boolean>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor(): EditorContextValue {
  const value = useContext(EditorContext);
  if (!value) throw new Error("useEditor는 EditorShell 안에서만 쓴다.");
  return value;
}

/**
 * 편집기 셸 — 전폭 상단 바 + 좌우 2단(왼쪽 섹션 · 오른쪽 미리보기).
 *
 * 1024px 미만에서는 1단으로 접히고 미리보기가 아래로 내려간다(스펙 §5.2).
 * **레이아웃까지만이다** — 하단 시트로 바꿔 다는 것은 Task 7이다.
 *
 * 스크롤은 왼쪽 열이 갖는다(h-dvh + 내부 overflow). 상단 바는 항상 화면에 남는다.
 *
 * ## 기본 정보 편집 상태가 왜 여기 있나
 *
 * 제목은 상단 바에도, 1번 섹션에도 있다. `saveBasicInfo`는 다섯 필드를 **한 벌로** 받으므로,
 * 두 화면이 각자의 스냅샷을 들고 부르면 나중에 저장한 쪽이 먼저 저장한 값을 되돌린다
 * (날짜를 고쳐 저장한 직후 제목에서 blur → 날짜가 초기 서버 렌더 값으로 돌아간다).
 * 액션이 오갈 때 RSC가 새 props를 내려주긴 하지만 그건 **경합**이다 — 새 props가 닿기 전에
 * 두 번째 저장이 떠나면 진다.
 *
 * 그래서 스냅샷을 하나로 만든다. 필드를 쪼개 부분 저장하는 길도 있었지만, 그래도 제목
 * 입력 두 개가 서로 다른 값을 보여주는 문제는 남는다 — 상태를 합치는 쪽이 둘 다 닫는다.
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
  const { save, run } = useEditorPlan();

  const [basics, setBasics] = useState<BasicInfoInput>(() => ({
    title: plan.title,
    startDate: plan.startDate,
    endDate: plan.endDate,
    planType: plan.planType,
    // partyLabel은 비어 있을 수 있다(ViewerPlan에서 null) — 빈 문자열로 보내면 다시 null이 된다.
    partyLabel: plan.partyLabel ?? "",
  }));

  // commit의 정체성을 안정적으로 두려고 ref로 최신 값을 읽는다. blur는 렌더·이펙트가
  // 끝난 뒤에 오므로 여기 담긴 값이 화면에 보이는 값과 같다.
  const latest = useRef(basics);
  const saved = useRef(basics);
  useEffect(() => {
    latest.current = basics;
  }, [basics]);

  const edit = useCallback((patch: Partial<BasicInfoInput>) => {
    setBasics((prev) => ({ ...prev, ...patch }));
  }, []);

  const commit = useCallback(async () => {
    const next = latest.current;
    const before = saved.current;
    if (JSON.stringify(next) === JSON.stringify(before)) return;

    const ok = await run(() => saveBasicInfo(plan.slug, next));
    // 서버가 거부하면 입력을 마지막 저장 값으로 되돌린다 — 화면과 서버가 어긋난 채로
    // 남으면 다음 저장이 사용자가 본 적 없는 값을 밀어 넣는다.
    if (ok) saved.current = next;
    else setBasics(before);
  }, [plan.slug, run]);

  const value = useMemo<EditorContextValue>(
    () => ({ slug: plan.slug, basics, edit, commit, save, run }),
    [plan.slug, basics, edit, commit, save, run],
  );

  return (
    <ToastProvider>
      <EditorContext.Provider value={value}>
        <div className="flex h-dvh flex-col">
          <TopBar slug={plan.slug} status={status} />

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
      </EditorContext.Provider>
    </ToastProvider>
  );
}
