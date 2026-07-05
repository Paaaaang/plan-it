import React from "react";
import { Button } from "../forms/Button.jsx";

/**
 * Planit BottomCTA — fixed bottom action zone with a white→transparent protection gradient
 * above it and safe-area padding. One screen-level action. Do not pair with a primary Button.
 */
export function BottomCTA({ children, onClick, disabled = false, loading = false, info = null, sticky = true, style = {} }) {
  return (
    <div style={{
      position: sticky ? "sticky" : "static", bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingTop: 28, ...style,
    }}>
      {/* protection gradient */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 28,
        background: "linear-gradient(to bottom, rgba(255,255,255,0), var(--surface-card))",
        pointerEvents: "none",
      }} />
      <div style={{
        background: "var(--surface-card)", padding: "0 16px calc(16px + env(safe-area-inset-bottom))",
      }}>
        {info && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "var(--fill-brand-weak)", color: "var(--text-brand)",
              borderRadius: "var(--radius-full)", font: "var(--label-s-fw) var(--label-s-size)/1 var(--font-sans)",
            }}>{info}</span>
          </div>
        )}
        <Button variant="primary" size="xl" block onClick={onClick} disabled={disabled} loading={loading}>
          {children}
        </Button>
      </div>
    </div>
  );
}
