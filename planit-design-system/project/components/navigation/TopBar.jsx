import React from "react";

/** Planit TopBar — 56pt app bar. Back/logo slot, centered or leading title, trailing action slot. */
export function TopBar({ title, onBack, leading = null, trailing = null, centered = false, border = true, style = {} }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 8, height: 56, padding: "0 12px",
      background: "var(--surface-card)",
      borderBottom: border ? "1px solid var(--border-secondary)" : "none", ...style,
    }}>
      {onBack ? (
        <button type="button" aria-label="뒤로" onClick={onBack} style={iconBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
        </button>
      ) : leading}
      <div style={{
        flex: 1, minWidth: 0, textAlign: centered ? "center" : "left",
        padding: centered ? 0 : "0 4px",
        font: "var(--title-1-fw) var(--title-1-size)/1 var(--font-sans)", letterSpacing: "-0.01em",
        color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>{trailing}</div>
    </header>
  );
}

const iconBtn = {
  display: "grid", placeItems: "center", width: 40, height: 40, padding: 0,
  border: "none", background: "transparent", borderRadius: "var(--radius-m)", cursor: "pointer", flex: "0 0 auto",
};
