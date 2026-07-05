import React from "react";

/** Planit Switch — 44×26 track, 20px knob, 200ms ease translate. */
export function Switch({ checked = false, onChange, disabled = false, style = {} }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange && onChange(!checked)}
      style={{
        position: "relative", width: 44, height: 26, padding: 0, border: "none",
        borderRadius: "var(--radius-full)",
        background: checked ? "var(--fill-brand)" : "var(--grey-300)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? "var(--disabled-opacity)" : 1,
        transition: "background var(--dur-base) var(--ease)", ...style,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: 3, width: 20, height: 20, borderRadius: "50%",
        background: "var(--white)", boxShadow: "var(--shadow-1)",
        transform: checked ? "translateX(18px)" : "translateX(0)",
        transition: "transform var(--dur-base) var(--ease)",
      }} />
    </button>
  );
}
