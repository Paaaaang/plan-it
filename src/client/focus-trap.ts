"use client";

import { useEffect, useId, useRef } from "react";

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
 *
 * 반환값의 data-focus-scope를 호출부가 패널 요소에 반드시 붙여야 한다 — 이 훅이
 * "패널 안"을 판정하는 유일한 근거다.
 */
export function useFocusTrap(open: boolean, panelRef: React.RefObject<HTMLElement | null>) {
  const scopeId = useId();
  const restoreRef = useRef<HTMLElement | null>(null);

  // 패널 밖에서 마지막으로 초점을 가졌던 요소를 항상 추적한다(렌더와 무관하게, 이벤트로).
  // "open이 될 때 effect에서 activeElement를 잡는" 방식은 패널 안 autoFocus(예: Dialog
  // 취소 버튼)가 커밋 단계에서 먼저 끝나 버려 트리거 요소를 이미 놓친 뒤가 된다.
  // focusin은 트리거를 클릭하는 순간(state 갱신·리렌더보다 먼저) 발생하므로 안전하다.
  //
  // "패널 안"은 이 인스턴스 자신의 data-focus-scope로만 판정한다(전역 role 조회가 아니라).
  // 중첩 상황(시트 안에서 다이얼로그를 여는 트리거)에서 role="dialog"|"alertdialog"
  // 전역 조회를 쓰면, 바깥 시트도 role="dialog"라 시트 안 트리거까지 "패널 안"으로
  // 걸러져 안쪽 다이얼로그가 닫힐 때 돌아갈 곳(그 트리거)을 잃고 배경으로 튄다.
  // data-focus-scope는 panelRef.current(ref 커밋 타이밍)가 아니라 JSX 렌더 결과로
  // DOM에 실리므로, 이전 role 검사와 같은 타이밍 보장(첫 focusin보다 먼저 존재)을 유지한다.
  //
  // closest는 "가장 가까운 패널"이 아니라 "내 scope와 일치하는 가장 가까운 조상"을 찾는다
  // — 즉 target이 내 패널 안이면(직접이든, 내 안에서 연 자식 모달 안이든) 항상 걸린다.
  // nearest-only로 판정하면 자식 모달(시트 안에서 연 다이얼로그)의 내부 초점이 nearest를
  // 자식의 scope로 가려버려 바깥 시트의 restoreRef를 자식 안 요소로 오염시킨다 — 그 요소가
  // 자식이 닫힐 때 사라지면 시트를 나중에 닫아도 돌아갈 곳이 없어 배경(body)으로 떨어진다.
  useEffect(() => {
    function record(target: HTMLElement | null) {
      if (!target || target === document.body) return;
      // 패널 컨테이너 자신(어느 scope든)은 복원 대상이 될 수 없다. 초점을 가진 요소가
      // DOM에서 제거되면(모달이 닫히며 패널이 통째로 사라질 때) 브라우저가 남아있는
      // 가장 가까운 포커스 가능한 조상으로 초점을 옮기는데(WebKit에서 특히 그렇다),
      // 중첩 상황에서 그 조상이 바깥 패널(예: 시트, tabIndex=-1)이라 이 focusin이
      // "패널 컨테이너 자체"를 target으로 기록해 버리면 정작 복원해야 할 트리거를
      // 지운다. 패널 컨테이너는 애초에 유효한 복원 지점이 아니므로 통째로 걸러낸다.
      if (target.hasAttribute("data-focus-scope")) return;
      if (target.closest(`[data-focus-scope="${scopeId}"]`)) return;
      restoreRef.current = target;
    }
    // 리스너가 붙기 전(하이드레이션 전)에 이미 초점을 가진 요소를 놓치지 않도록 한 번 씨앗을 심는다.
    // 이게 없으면 하이드레이션 전에 Tab으로 트리거에 초점을 두고 하이드레이션 후 여는 흐름에서
    // restoreRef가 비어 닫을 때 초점이 body로 떨어진다.
    record(document.activeElement as HTMLElement | null);
    function onFocusIn(e: FocusEvent) {
      record(e.target as HTMLElement | null);
    }
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [scopeId]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // autoFocus가 이미 패널 안으로 초점을 넣었으면 건드리지 않는다.
    if (!panel.contains(document.activeElement)) {
      // 패널이 스스로 tabindex를 선언했으면 거기서 시작한다. 첫 컨트롤로 뛰면
      // **스크롤되는 패널이 그 컨트롤까지 스크롤돼 제목이 화면 밖으로 밀린다**
      // (BottomSheet: 액션이 맨 아래에 있다). 컨테이너 포커스는 APG의 기본 권고이기도 하다.
      const first = panel.hasAttribute("tabindex") ? panel : focusables(panel)[0];
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

  return { "data-focus-scope": scopeId };
}
