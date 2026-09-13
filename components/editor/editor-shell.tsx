"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ToastProvider } from "@/components/ui/toast";
import { TopBar } from "@/components/editor/top-bar";
import { PreviewPane } from "@/components/editor/preview-pane";
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

  /**
   * 미리보기가 보는 일정. 서버가 내려준 일정 위에 **편집 중인 기본 정보를 덮는다.**
   *
   * 서버 값만 쓰면 저장이 끝난 뒤에야 따라온다 — 기획자가 제목을 고치는 동안 참가자 화면이
   * 옛 제목을 들고 있다. 반대로 나머지(공지·타임테이블·장소)는 저장이 곧 진실이라
   * 서버 값 그대로다: 액션이 끝나면 RSC가 새 props를 내려준다.
   */
  const previewPlan = useMemo<ViewerPlan>(
    () => ({
      ...plan,
      title: basics.title,
      startDate: basics.startDate,
      endDate: basics.endDate,
      planType: basics.planType,
      // 빈 문자열은 "값 없음"이다 — 뷰어 DTO에서는 null이 그 뜻이다(부제 줄이 그걸 본다).
      partyLabel: basics.partyLabel || null,
    }),
    [plan, basics],
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  // 모달 핸들러는 안정적이어야 한다 — 매 렌더 새 클로저를 넘기면 Escape 리스너가
  // 재등록되어 모달 스택 순서가 흔들린다(bottom-sheet.tsx의 modalStack).
  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

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

            {/*
              1024px 미만에서는 오른쪽 열을 접는다(스펙 §5.2). **CSS 브레이크포인트 하나로
              한다** — 미디어 쿼리를 JS로 재면 서버 렌더와 첫 페인트가 어긋나고(폭을 모른다),
              그 사이 미리보기가 깜빡인다. 접힌 동안에도 DOM에는 남는데, 그게 비용이
              아니다: 같은 데이터를 그리는 순수 렌더라 네트워크도 타이머도 없다.
            */}
            <aside className="hidden shrink-0 flex-col items-center gap-3 border-default bg-sunken p-5 lg:flex lg:w-[424px] lg:border-l">
              <p className="flex-none text-micro font-extrabold tracking-wide text-tertiary">
                참가자가 보는 화면
              </p>
              {/* 남는 높이를 전부 준다 — 프레임은 그 높이에서 폰 비율로 폭을 정한다. */}
              <div className="flex min-h-0 flex-1 justify-center self-stretch">
                <PreviewPane plan={previewPlan} />
              </div>
            </aside>
          </div>

          {/* 접혔을 때의 입구. 시트는 버튼이 있을 때만 열리므로 이것도 CSS로 충분하다. */}
          <div className="flex-none border-t border-default bg-surface p-3 lg:hidden">
            <button
              type="button"
              onClick={openSheet}
              className="w-full rounded-field bg-neutral-fill py-2.5 text-label font-bold text-secondary"
            >
              미리보기
            </button>
          </div>
        </div>

        <BottomSheet open={sheetOpen} onClose={closeSheet} title="참가자가 보는 화면">
          {/* 시트 안에서도 높이는 부모가 준다. 패널 자체 상한(85dvh)보다 낮게 잡아 제목이 남는다. */}
          <div className="mt-3 flex h-[68dvh] justify-center">
            <PreviewPane plan={previewPlan} />
          </div>
        </BottomSheet>
      </EditorContext.Provider>
    </ToastProvider>
  );
}
