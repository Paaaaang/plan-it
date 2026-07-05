import React from "react";

/** Planit Loader — 3-dot pulse (never shimmer). size scales dot diameter. */
export function Loader({ size = 8, color = "var(--text-brand)", style = {} }) {
  return (
    <span style={{ display: "inline-flex", gap: size * 0.6, alignItems: "center", ...style }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: size, height: size, borderRadius: "50%", background: color,
          animation: "planit-loader 900ms var(--ease) infinite", animationDelay: `${i * 150}ms`,
        }} />
      ))}
      <style>{`@keyframes planit-loader{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
    </span>
  );
}
