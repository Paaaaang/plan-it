import React from "react";

/**
 * Planit TabBar — floating mobile bottom nav. 2–5 items, max-width 420, radius-3xl, hairline.
 * Active item: filled icon + blue label. Requires window.lucide for icons.
 */
export function TabBar({ items = [], value, onChange, style = {} }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <nav style={{
      display: "flex", maxWidth: 420, margin: "0 auto", padding: 6,
      background: "var(--surface-card)", border: "1px solid var(--border-secondary)",
      borderRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-2)", ...style,
    }}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange && onChange(it.value)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "8px 4px", border: "none", background: "transparent", cursor: "pointer",
              color: active ? "var(--text-brand)" : "var(--text-tertiary)",
            }}
          >
            <i data-lucide={it.icon} style={{ width: 24, height: 24 }} data-icon-fill={active ? "1" : "0"} />
            <span style={{ font: `${active ? 700 : 500} 11px/1 var(--font-sans)` }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
