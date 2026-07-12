"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from "react";

/**
 * Planit TextField — 48px, grey-100 resting → white + 1.5px blue on focus.
 * Error state: 1.5px red border + red helper text.
 *
 * @source planit-design-system/project/components/forms/TextField.jsx
 */

type BaseProps = {
  label?: string;
  helper?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
};

type SingleLineProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    multiline?: false;
    type?: string;
  };

type MultiLineProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
    rows?: number;
  };

type TextFieldProps = SingleLineProps | MultiLineProps;

export function TextField(props: TextFieldProps) {
  const {
    label,
    helper = "",
    error = "",
    leadingIcon = null,
    trailingSlot = null,
    multiline = false,
    style = {},
    disabled = false,
    ...rest
  } = props;

  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const borderColor = hasError
    ? "var(--fill-danger)"
    : focused
    ? "var(--border-primary)"
    : "var(--border-secondary)";
  const borderWidth = hasError || focused ? 1.5 : 1;

  const fieldStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    resize: multiline ? "vertical" : "none",
    font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
    letterSpacing: "var(--body-2-ls)",
    color: "var(--text-primary)",
    padding: 0,
  };

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "var(--pair-gap)", ...(style as React.CSSProperties) }}>
      {label && (
        <span
          style={{
            font: "var(--label-s-fw) var(--label-s-size)/var(--label-s-lh) var(--font-sans)",
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: multiline ? "flex-start" : "center",
          gap: 8,
          minHeight: multiline ? "auto" : 48,
          padding: multiline ? "14px 16px" : "0 16px",
          background: focused ? "var(--surface-card)" : "var(--fill-secondary)",
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: "var(--radius-m)",
          opacity: disabled ? "var(--disabled-opacity)" : 1,
          transition: "border-color var(--dur-base) var(--ease), background var(--dur-base) var(--ease)",
        }}
      >
        {leadingIcon}
        {multiline ? (
          <textarea
            disabled={disabled}
            rows={(props as MultiLineProps).rows ?? 3}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={fieldStyle}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            disabled={disabled}
            type={(props as SingleLineProps).type ?? "text"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={fieldStyle}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {trailingSlot}
      </div>
      {(error || helper) && (
        <span
          style={{
            font: "var(--body-3-fw) var(--body-3-size)/var(--body-3-lh) var(--font-sans)",
            color: hasError ? "var(--text-danger)" : "var(--text-tertiary)",
          }}
        >
          {error || helper}
        </span>
      )}
    </label>
  );
}
