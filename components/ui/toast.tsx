"use client";

import { ReactNode } from "react";

/**
 * Planit Toast — grey-900 surface + white label, radius-l, shadow-toast.
 * tone: default / success (green check) / danger (red alert).
 * `floating` positions it fixed at bottom center.
 *
 * @source planit-design-system/project/components/feedback/Toast.jsx
 */

type ToastTone = "default" | "success" | "danger";

interface ToastProps {
  children: ReactNode;
  tone?: ToastTone;
  floating?: boolean;
  style?: React.CSSProperties;
}

function SuccessIcon() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "var(--fill-success)",
        flex: "0 0 auto",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--white)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12.5 9.5 18 20 6.5" />
      </svg>
    </span>
  );
}

function DangerIcon() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "var(--fill-danger)",
        flex: "0 0 auto",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        stroke="var(--white)"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M12 7v6M12 17h.01" />
      </svg>
    </span>
  );
}

export function Toast({ children, tone = "default", floating = false, style = {} }: ToastProps) {
  const icon =
    tone === "success" ? <SuccessIcon /> : tone === "danger" ? <DangerIcon /> : null;

  return (
    <div
      style={{
        ...(floating
          ? {
              position: "fixed",
              left: "50%",
              bottom: 32,
              transform: "translateX(-50%)",
              zIndex: 60,
            }
          : {}),
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        maxWidth: 440,
        padding: "13px 18px",
        background: "var(--fill-primary)",
        color: "var(--text-alt)",
        borderRadius: "var(--radius-l)",
        boxShadow: "var(--shadow-toast)",
        font: "var(--label-m-fw) var(--label-m-size)/1.35 var(--font-sans)",
        animation: "planit-toast-in var(--dur-base) var(--ease-out)",
        ...style,
      }}
    >
      {icon}
      {children}
    </div>
  );
}
