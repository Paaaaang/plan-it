import React from "react";

/**
 * Planit TextField — 48px, grey-100 resting → white + 1.5px blue on focus.
 * Error state: 1.5px red border + red helper text.
 */
export function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  helper = "",
  error = "",
  disabled = false,
  type = "text",
  leadingIcon = null,
  trailingSlot = null,
  multiline = false,
  rows = 3,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const hasError = !!error;
  const borderColor = hasError
    ? "var(--fill-danger)"
    : focused
    ? "var(--border-primary)"
    : "var(--border-secondary)";
  const borderWidth = hasError || focused ? 1.5 : 1;

  const Field = multiline ? "textarea" : "input";

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "var(--pair-gap)", ...style }}>
      {label && (
        <span style={{ font: "var(--label-s-fw) var(--label-s-size)/var(--label-s-lh) var(--font-sans)", color: "var(--text-secondary)" }}>
          {label}
        </span>
      )}
      <div style={{
        display: "flex", alignItems: multiline ? "flex-start" : "center", gap: 8,
        minHeight: multiline ? "auto" : 48,
        padding: multiline ? "14px 16px" : "0 16px",
        background: focused ? "var(--surface-card)" : "var(--fill-secondary)",
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: "var(--radius-m)",
        opacity: disabled ? "var(--disabled-opacity)" : 1,
        transition: "border-color var(--dur-base) var(--ease), background var(--dur-base) var(--ease)",
      }}>
        {leadingIcon}
        <Field
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          type={multiline ? undefined : type}
          rows={multiline ? rows : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, width: "100%", border: "none", outline: "none", background: "transparent",
            resize: multiline ? "vertical" : "none",
            font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
            letterSpacing: "var(--body-2-ls)", color: "var(--text-primary)",
            padding: multiline ? 0 : "0",
          }}
          {...rest}
        />
        {trailingSlot}
      </div>
      {(error || helper) && (
        <span style={{
          font: "var(--body-3-fw) var(--body-3-size)/var(--body-3-lh) var(--font-sans)",
          color: hasError ? "var(--text-danger)" : "var(--text-tertiary)",
        }}>
          {error || helper}
        </span>
      )}
    </label>
  );
}
