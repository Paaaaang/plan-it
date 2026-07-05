import React from "react";

/** Planit Badge — 22px, 6px radius, washed semantic background. Denser than Chip. */
const TONES = {
  neutral: { bg: "var(--grey-100)",  fg: "var(--text-secondary)" },
  brand:   { bg: "var(--blue-50)", fg: "var(--text-brand)" },
  success: { bg: "var(--green-50)",  fg: "var(--text-success)" },
  danger:  { bg: "var(--red-50)",    fg: "var(--text-danger)" },
  warning: { bg: "var(--amber-50)",  fg: "var(--text-warning)" },
  info:    { bg: "var(--blue-50)",   fg: "var(--text-info)" },
};
export function Badge({ children, tone = "neutral", dot = false, style = {} }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, height: 22, padding: "0 8px",
      borderRadius: 6, background: t.bg, color: t.fg,
      font: "var(--label-s-fw) 12px/1 var(--font-sans)", ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.fg }} />}
      {children}
    </span>
  );
}
