"use client";

import { useEffect, useId } from "react";
import { Button } from "@/components/ui/button";

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
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "brand" | "danger";
}) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div onClick={onClose} className="absolute inset-0" style={{ background: "var(--overlay-scrim)" }} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative w-full max-w-sm rounded-[20px] bg-raised p-5 shadow-pop"
        style={{ animation: "planit-dialog-in var(--dur-base) var(--ease-out)" }}
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
