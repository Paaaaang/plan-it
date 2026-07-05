import React from "react";

/**
 * Planit BottomSheet — primary mobile alternative to Dialog. 20–24px top radius,
 * sheet shadow, scrim, grabber handle. Slides up.
 */
export function BottomSheet({ open = true, title, children, onClose, header = null }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column",
        justifyContent: "flex-end", background: "var(--overlay-scrim)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface-card)", borderTopLeftRadius: "var(--radius-3xl)", borderTopRightRadius: "var(--radius-3xl)",
          boxShadow: "var(--shadow-sheet)", padding: "10px 24px calc(24px + env(safe-area-inset-bottom))",
          animation: "planit-sheet-in var(--dur-slow) var(--ease-out)", maxHeight: "86%", overflowY: "auto",
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--grey-200)", margin: "0 auto 16px" }} />
        {header}
        {title && <div style={{ font: "var(--h4-fw) var(--h4-size)/1.35 var(--font-sans)", letterSpacing: "-0.015em", color: "var(--text-primary)", marginBottom: 16 }}>{title}</div>}
        {children}
      </div>
      <style>{`@keyframes planit-sheet-in{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}
