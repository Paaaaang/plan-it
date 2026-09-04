"use client";

import { useEffect, useId, useRef } from "react";
import { useFocusTrap } from "@/lib/focus-trap";

// 스크롤 잠금 참조 카운트 — 시트/다이얼로그가 중첩 열려도 마지막 하나가 닫힐 때만 복원한다.
// Dialog도 이 헬퍼를 가져다 쓴다 — 구현을 복제하지 않는다.
let lockCount = 0;
let savedOverflow = "";

export function lockBodyScroll() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = savedOverflow;
}

// 모달 스택 — 열린 순서대로 쌓인다. Escape는 최상단(가장 나중에 연) 모달만 반응해야
// 한다(LIFO) — 그렇지 않으면 시트와 그 안 다이얼로그가 동시에 열려 있을 때 Escape가
// 어느 쪽을 닫을지 리스너 등록 순서에 좌우된다. lockCount와 같은 모듈 수준 참조로
// 다룬다. Dialog도 이 스택을 가져다 쓴다 — 구현을 복제하지 않는다.
//
// push/pop은 반드시 "열림 상태" 자체에만 의존하는 effect에서 호출한다(onClose 같은
// 매 렌더 새로 생기는 클로저에 의존하는 effect와 분리) — 그래야 onClose 아이덴티티가
// 바뀌어 effect가 재실행되어도 스택 안 위치가 흔들리지 않는다.
const modalStack: string[] = [];

export function pushModal(id: string) {
  modalStack.push(id);
}

export function popModal(id: string) {
  const idx = modalStack.lastIndexOf(id);
  if (idx !== -1) modalStack.splice(idx, 1);
}

export function isTopModal(id: string) {
  return modalStack.length > 0 && modalStack[modalStack.length - 1] === id;
}

/**
 * BottomSheet — 모바일에서 상세를 여는 자리.
 * 다크에서는 표면을 배경보다 밝게 올린다. 그림자만으로는 떠 보이지 않는다.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const modalId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const focusScopeProps = useFocusTrap(open, panelRef);

  useEffect(() => {
    if (!open) return;
    pushModal(modalId);
    return () => popModal(modalId);
  }, [open, modalId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isTopModal(modalId)) onClose();
    }
    document.addEventListener("keydown", onKey);
    lockBodyScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockBodyScroll();
    };
  }, [open, onClose, modalId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        data-testid="sheet-scrim"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "var(--overlay-scrim)", animation: "planit-fade-in var(--dur-fast) var(--ease-out)" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "상세"}
        data-testid="sheet-panel"
        // 열 때 초점을 패널 자신이 받는다(useFocusTrap). 첫 액션 버튼으로 뛰면
        // 긴 내용에서 패널이 그만큼 스크롤돼 제목이 위로 밀려 나간다.
        tabIndex={-1}
        // 내용이 길어도 패널이 화면 위로 자라면 안 된다. lockBodyScroll이 걸려 있어
        // 밀려 나간 제목을 스크롤로 되돌릴 수 없다 — 넘치는 만큼은 패널 안에서 스크롤한다.
        className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-sheet bg-raised px-5 pb-5 pt-2.5 shadow-sheet"
        style={{ animation: "planit-sheet-in var(--dur-base) var(--ease-out)" }}
        {...focusScopeProps}
      >
        <div aria-hidden="true" className="mx-auto mb-3.5 h-1 w-9 rounded-full bg-strong" />
        {title && (
          <h2 id={titleId} className="text-title-2 font-extrabold tracking-tight">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
