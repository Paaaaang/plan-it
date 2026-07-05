import React from "react";

/** Planit Checkbox — 22px, 6px radius. Unchecked hairline → blue fill + white check. */
export function Checkbox({ checked = false, onChange, label, disabled = false, style = {} }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "default" : "pointer",
      opacity: disabled ? "var(--disabled-opacity)" : 1, ...style,
    }}>
      <span
        role="checkbox"
        aria-checked={checked}
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          display: "grid", placeItems: "center", width: 22, height: 22, borderRadius: 6,
          background: checked ? "var(--fill-brand)" : "var(--surface-card)",
          border: checked ? "none" : "1.5px solid var(--border-strong)",
          transition: "background var(--dur-base) var(--ease)",
        }}
      >
        {checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 9.5 18 20 6.5" />
          </svg>
        )}
      </span>
      {label && (
        <span style={{ font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)", color: "var(--text-primary)" }}>
          {label}
        </span>
      )}
    </label>
  );
}
