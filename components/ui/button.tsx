"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button — 의미 토큰만 참조한다.
 * 액센트 예산: primary는 화면당 하나. 나머지는 secondary나 ghost를 쓴다.
 */
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3.5 text-caption rounded-xs gap-1.5",
  md: "h-11 px-4 text-label rounded-btn gap-2",
  lg: "h-[52px] px-6 text-item-title rounded-[14px] gap-2",
};

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand text-on-accent hover:bg-brand-hover",
  secondary: "bg-neutral-fill text-primary hover:bg-strong/30",
  ghost: "bg-transparent text-secondary hover:bg-neutral-fill",
  danger: "bg-danger text-white hover:opacity-90",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  disabled = false,
  leadingIcon = null,
  trailingIcon = null,
  className = "",
  ...rest
}: ButtonProps) {
  const isOff = disabled || loading;

  return (
    <button
      type="button"
      disabled={isOff}
      aria-busy={loading || undefined}
      className={[
        "relative inline-flex items-center justify-center font-bold tracking-tight",
        "transition-colors duration-[120ms] ease-planit",
        "disabled:cursor-default disabled:opacity-40",
        block ? "flex w-full" : "",
        SIZE[size],
        VARIANT[variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? <Dots /> : (<>{leadingIcon}{children}{trailingIcon}</>)}
    </button>
  );
}

/** 로딩 표시 — 색에만 의존하지 않도록 aria-busy와 함께 쓴다. */
function Dots() {
  return (
    <span className="inline-flex gap-1" role="status" aria-label="처리 중이에요">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-current"
          style={{ animation: `planit-dot 900ms var(--ease-out) ${i * 150}ms infinite` }}
        />
      ))}
    </span>
  );
}
