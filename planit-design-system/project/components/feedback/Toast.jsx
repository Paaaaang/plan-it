import React from "react";

/**
 * Planit Toast — grey-900 surface + white label, radius-l, shadow-toast.
 * tone success shows a green check circle. Inline (position it yourself) or fixed via `floating`.
 */
export function Toast({ children, tone = "default", floating = false, style = {} }) {
  const icon = tone === "success" ? (
    <span style={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--fill-success)", flex: "0 0 auto" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5" /></svg>
    </span>
  ) : tone === "danger" ? (
    <span style={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--fill-danger)", flex: "0 0 auto" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" stroke="var(--white)" strokeWidth="3" strokeLinecap="round"><path d="M12 7v6M12 17h.01" /></svg>
    </span>
  ) : null;
  return (
    <div style={{
      ...(floating ? { position: "fixed", left: "50%", bottom: 32, transform: "translateX(-50%)", zIndex: 60 } : {}),
      display: "inline-flex", alignItems: "center", gap: 10, maxWidth: 440,
      padding: "13px 18px", background: "var(--fill-primary)", color: "var(--text-alt)",
      borderRadius: "var(--radius-l)", boxShadow: "var(--shadow-toast)",
      font: "var(--label-m-fw) var(--label-m-size)/1.35 var(--font-sans)", ...style,
    }}>
      {icon}{children}
    </div>
  );
}
