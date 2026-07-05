import React from "react";

/**
 * Planit ListRow — the standard schedule/list unit. Whole row is the hit area.
 * left slot (avatar/icon) + title/subtitle stack + right slot (value/time/chevron).
 */
export function ListRow({ left = null, title, subtitle = null, right = null, chevron = false, onClick, style = {}, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const clickable = !!onClick;
  return (
    <div
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: "relative", display: "flex", alignItems: "center", gap: 14,
        padding: "14px 24px", minHeight: 64, background: "var(--surface-card)",
        cursor: clickable ? "pointer" : "default", ...style,
      }}
      {...rest}
    >
      {clickable && (
        <span style={{
          position: "absolute", inset: 0, background: "var(--overlay-press)",
          opacity: pressed ? 1 : 0, transition: "opacity var(--dur-fast) var(--ease)", pointerEvents: "none",
        }} />
      )}
      {left}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{
          font: "var(--title-2-fw) var(--title-2-size)/1.35 var(--font-sans)", letterSpacing: "-0.01em",
          color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{title}</span>
        {subtitle && (
          <span style={{
            font: "var(--body-3-fw) var(--body-3-size)/1.4 var(--font-sans)", color: "var(--text-tertiary)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{subtitle}</span>
        )}
      </div>
      {right && <div style={{ flex: "0 0 auto", textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>{right}</div>}
      {chevron && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--grey-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      )}
    </div>
  );
}
