import React from "react";

/** Planit SearchField — TextField variant with a leading search glyph. */
export function SearchField({ value, onChange, placeholder = "검색", onClear, style = {}, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 14px",
      background: focused ? "var(--surface-card)" : "var(--fill-secondary)",
      border: `${focused ? 1.5 : 1}px solid ${focused ? "var(--border-primary)" : "var(--border-secondary)"}`,
      borderRadius: "var(--radius-m)",
      transition: "border-color var(--dur-base) var(--ease), background var(--dur-base) var(--ease)",
      ...style,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
          letterSpacing: "var(--body-2-ls)", color: "var(--text-primary)",
        }}
        {...rest}
      />
      {value && onClear && (
        <button onClick={onClear} type="button" aria-label="지우기" style={{
          display: "grid", placeItems: "center", width: 20, height: 20, padding: 0,
          border: "none", borderRadius: "50%", background: "var(--grey-300)", cursor: "pointer",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" stroke="var(--white)" strokeWidth="3" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
