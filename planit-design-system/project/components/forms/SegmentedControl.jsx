import React from "react";

/**
 * Planit SegmentedControl — mutually-exclusive single choice.
 * grey-100 track; selected segment lifts to white + shadow-1.
 */
export function SegmentedControl({ options = [], value, onChange, size = "m", style = {} }) {
  const h = size === "s" ? 32 : 40;
  return (
    <div style={{
      display: "inline-flex", padding: 3, gap: 2, background: "var(--fill-secondary)",
      borderRadius: "var(--radius-l)", ...style,
    }}>
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const active = val === value;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange && onChange(val)}
            style={{
              height: h, padding: "0 16px", border: "none", borderRadius: "var(--radius-m)",
              background: active ? "var(--surface-card)" : "transparent",
              boxShadow: active ? "var(--shadow-1)" : "none",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              font: `${active ? "var(--label-m-fw)" : "var(--fw-medium)"} var(--label-m-size)/1 var(--font-sans)`,
              cursor: "pointer",
              transition: "background var(--dur-base) var(--ease), color var(--dur-base) var(--ease)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
