"use client";

import { ReactNode } from "react";
import { Button } from "./button";

/**
 * Planit Dialog — white, radius-2xl, 24px padding, shadow-3, scrim.
 * Stacked CTAs: primary + optional secondary, each 48px.
 *
 * @source planit-design-system/project/components/feedback/Dialog.jsx
 */

interface ModalProps {
  open?: boolean;
  title?: string;
  body?: string;
  primary?: string;
  secondary?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
  illustration?: ReactNode;
}

export function Modal({
  open = true,
  title,
  body,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  onClose,
  illustration = null,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--overlay-scrim)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 340,
          background: "var(--surface-card)",
          borderRadius: "var(--radius-2xl)",
          padding: 24,
          boxShadow: "var(--shadow-3)",
          textAlign: "center",
          animation: "planit-dialog-in var(--dur-slow) var(--ease-out)",
        }}
      >
        {illustration && (
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            {illustration}
          </div>
        )}
        {title && (
          <div
            style={{
              font: "var(--title-1-fw) var(--title-1-size)/1.4 var(--font-sans)",
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            {title}
          </div>
        )}
        {body && (
          <div
            style={{
              font: "var(--body-2-fw) var(--body-2-size)/1.5 var(--font-sans)",
              color: "var(--text-secondary)",
              marginBottom: 24,
            }}
          >
            {body}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {primary && (
            <Button variant="primary" size="lg" block onClick={onPrimary}>
              {primary}
            </Button>
          )}
          {secondary && (
            <Button variant="secondary" size="lg" block onClick={onSecondary || onClose}>
              {secondary}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
