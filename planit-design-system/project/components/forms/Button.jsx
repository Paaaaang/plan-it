import React from "react";

/**
 * Planit Button — the workhorse action. Reads like a sentence, not decoration.
 * Sizes scale height + radius + label weight together (XL/L/M/S).
 * variant: primary (one per screen) · secondary · danger · ghost
 */
const SIZES = {
  xl: { height: 56, radius: "var(--radius-xl)", padX: 24, fs: "var(--label-l-size)", fw: "var(--label-l-fw)" },
  l:  { height: 48, radius: "var(--radius-l)",  padX: 20, fs: "var(--label-l-size)", fw: "var(--label-l-fw)" },
  m:  { height: 40, radius: "var(--radius-m)",  padX: 16, fs: "var(--label-m-size)", fw: "var(--label-m-fw)" },
  s:  { height: 32, radius: "10px",             padX: 12, fs: "var(--label-s-size)", fw: "var(--label-s-fw)" },
};

const VARIANTS = {
  primary:   { background: "var(--fill-brand)",     color: "var(--text-alt)",     border: "none" },
  secondary: { background: "var(--fill-secondary)", color: "var(--text-primary)", border: "none" },
  danger:    { background: "var(--fill-danger)",    color: "var(--text-alt)",     border: "none" },
  ghost:     { background: "transparent",           color: "var(--text-brand)",   border: "none" },
};

export function Button({
  children,
  variant = "primary",
  size = "l",
  block = false,
  disabled = false,
  loading = false,
  leadingIcon = null,
  trailingIcon = null,
  style = {},
  ...rest
}) {
  const s = SIZES[size] || SIZES.l;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: "relative",
        display: block ? "flex" : "inline-flex",
        width: block ? "100%" : "auto",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: s.height,
        padding: `0 ${s.padX}px`,
        borderRadius: s.radius,
        fontFamily: "var(--font-sans)",
        fontSize: s.fs,
        fontWeight: s.fw,
        letterSpacing: "-0.005em",
        lineHeight: 1,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? "var(--disabled-opacity)" : 1,
        transition: `background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)`,
        overflow: "hidden",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {/* press overlay */}
      <span style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        background: "var(--overlay-press)",
        opacity: pressed && !disabled ? 1 : 0,
        transition: "opacity var(--dur-fast) var(--ease)",
        pointerEvents: "none",
      }} />
      {loading ? (
        <Dots color={variant === "secondary" || variant === "ghost" ? "var(--text-secondary)" : "var(--text-alt)"} />
      ) : (
        <>
          {leadingIcon}
          <span style={{ position: "relative" }}>{children}</span>
          {trailingIcon}
        </>
      )}
    </button>
  );
}

function Dots({ color }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, position: "relative" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          animation: "planit-dot 900ms var(--ease) infinite",
          animationDelay: `${i * 150}ms`,
        }} />
      ))}
      <style>{`@keyframes planit-dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}`}</style>
    </span>
  );
}
