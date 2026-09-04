"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { lockBodyScroll, unlockBodyScroll, pushModal, popModal, isTopModal } from "@/components/ui/bottom-sheet";
import { useFocusTrap } from "@/lib/focus-trap";

/**
 * Dialog — 되돌리기 어려운 행동을 확인받는 자리.
 * 파괴적 행동이면 tone="danger"로 확인 버튼만 danger를 쓴다.
 * 취소가 기본 초점이다 — 실수로 Enter를 눌러도 지워지지 않게.
 */
export function Dialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  tone = "brand",
  testId = "dialog-panel",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "brand" | "danger";
  // 갤러리에 같은 Dialog가 여러 인스턴스 있을 때(중첩 데모 등) 구분용.
  testId?: string;
}) {
  const titleId = useId();
  const descId = useId();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* 파괴적 행동을 확인받는 alertdialog다 — 스크림 클릭으로는 닫히지 않는다.
          Escape는 취소와 동등해서 안전하니 남겨둔다(위 useEffect). */}
      <div data-testid="dialog-scrim" className="absolute inset-0" style={{ background: "var(--overlay-scrim)" }} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        data-testid={testId}
        className="relative w-full max-w-sm rounded-dialog bg-raised p-5 shadow-pop"
        style={{ animation: "planit-dialog-in var(--dur-base) var(--ease-out)" }}
        {...focusScopeProps}
      >
        <h2 id={titleId} className="text-title-3 font-extrabold tracking-tight">{title}</h2>
        {description && (
          <p id={descId} className="mt-2 text-label text-secondary">{description}</p>
        )}
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" block autoFocus onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} block onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
