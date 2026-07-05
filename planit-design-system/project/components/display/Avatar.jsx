import React from "react";

/** Planit Avatar — rounded-square (radius 14) or circle. Image, or initial on blue-50 tint. */
export function Avatar({ src, name = "", size = 44, shape = "rounded", tone = "brand", style = {} }) {
  const radius = shape === "circle" ? "50%" : "var(--radius-l)";
  const tones = {
    brand:   { bg: "var(--blue-100)", fg: "var(--blue-700)" },
    neutral: { bg: "var(--grey-200)",   fg: "var(--grey-700)" },
  };
  const t = tones[tone] || tones.brand;
  const initial = (name || "").trim().charAt(0).toUpperCase();
  return (
    <div style={{
      display: "grid", placeItems: "center", width: size, height: size, borderRadius: radius,
      overflow: "hidden", background: t.bg, color: t.fg, flex: "0 0 auto",
      font: `700 ${Math.round(size * 0.4)}px/1 var(--font-sans)`, ...style,
    }}>
      {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initial}
    </div>
  );
}
