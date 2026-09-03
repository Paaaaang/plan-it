"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * 열린 모달 안에 초점을 가둔다 (WAI-ARIA APG dialog 기준선).
 * 스크림은 포인터만 막는다 — 키보드는 이 훅이 막는다.
 * 열 때 첫 포커스 요소로 이동하고, 닫을 때 열었던 요소로 돌려준다.
 */
export function useFocusTrap(open: boolean, panelRef: React.RefObject<HTMLElement | null>) {
  const restoreRef = useRef<HTMLElement | null>(null);

  // 패널 밖에서 마지막으로 초점을 가졌던 요소를 항상 추적한다(렌더와 무관하게, 이벤트로).
  // "open이 될 때 effect에서 activeElement를 잡는" 방식은 패널 안 autoFocus(예: Dialog
  // 취소 버튼)가 커밋 단계에서 먼저 끝나 버려 트리거 요소를 이미 놓친 뒤가 된다.
  // focusin은 트리거를 클릭하는 순간(state 갱신·리렌더보다 먼저) 발생하므로 안전하다.
  // 대상이 패널 안인지는 panelRef가 아니라 실제 DOM 조상(role)으로 판단한다 — panelRef.current는
  // 커밋 중 ref가 붙는 타이밍이라, autoFocus의 focusin이 그보다 먼저 도착하면 아직 null일 수 있다.
  useEffect(() => {
    function onFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[role="dialog"], [role="alertdialog"]')) return;
      restoreRef.current = target;
    }
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // autoFocus가 이미 패널 안으로 초점을 넣었으면 건드리지 않는다.
    if (!panel.contains(document.activeElement)) {
      const first = focusables(panel)[0];
      if (first) first.focus();
      else {
        panel.tabIndex = -1;
        panel.focus();
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const items = focusables(panel!);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      // 다음/이전 칸을 항상 직접 계산해 옮긴다 — 네이티브 Tab 순서에 기대지 않는다.
      // WebKit은 기본값(Full Keyboard Access 꺼짐)에서 버튼을 Tab 순서에서 뺀다:
      // 경계에서만 개입하면 중간 이동이 브라우저 기본 동작에 맡겨져 WebKit에서 새 나간다.
      e.preventDefault();
      const active = document.activeElement;
      const idx = items.indexOf(active as HTMLElement);
      const from = idx === -1 ? (e.shiftKey ? 0 : -1) : idx;
      const next = (from + (e.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next].focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus();
    };
  }, [open, panelRef]);
}
