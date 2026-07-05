import React from "react";

/**
 * Planit Chip — 34px full pill, multi-filter selection.
 * resting: hairline + white. active: grey-900 fill + white. brand: blue-50 + blue text.
 */
export function Chip({ children, active = false, variant = "neutral", leadingIcon = null, onClick, style = {}, ...rest }) {
  let bg = "var(--surface-card)", color = "var(--text-secondary)", border = "1px solid var(--border-secondary)";
  if (active && variant === "neutral") { bg = "var(--fill-primary)"; color = "var(--text-alt)"; border = "1px solid var(--fill-primary)"; }
  if (variant === "brand") { bg = "var(--fill-brand-weak)"; color = "var(--text-brand)"; border = "1px solid transparent"; }
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px",
        borderRadius: "var(--radius-full)", background: bg, color, border,
        font: "var(--label-s-fw) var(--label-s-size)/1 var(--font-sans)", cursor: "pointer",
        transition: "background var(--dur-base) var(--ease), color var(--dur-base) var(--ease)",
        ...style,
      }}
      {...rest}
    >
      {leadingIcon}{children}
    </button>
  );
}
