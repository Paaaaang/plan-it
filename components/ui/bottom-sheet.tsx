"use client";

import { useEffect, useId } from "react";

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

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    lockBodyScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockBodyScroll();
    };
  }, [open, onClose]);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "상세"}
        data-testid="sheet-panel"
        className="absolute inset-x-0 bottom-0 rounded-t-sheet bg-raised px-5 pb-5 pt-2.5 shadow-sheet"
        style={{ animation: "planit-sheet-in var(--dur-base) var(--ease-out)" }}
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
