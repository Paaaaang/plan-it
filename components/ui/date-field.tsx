"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * DateField — 네이티브 <input type="date">를 쓴다.
 * 달력 라이브러리를 얹지 않는다: 모바일에서 OS 피커가 가장 좋고, 접근성이 공짜다.
 * 값 형식은 YYYY-MM-DD.
 */
type Props = { label: string; hint?: string; error?: string } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
>;

export function DateField({ label, hint, error, ...rest }: Props) {
  const id = useId();
  const msgId = `${id}-msg`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-bold text-tertiary">
        {label}
      </label>
      <input
        id={id}
        type="date"
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? msgId : undefined}
        className={[
          "w-full rounded-[11px] border bg-sunken px-3 py-2.5",
          "text-label font-medium text-primary tnum",
          "transition-colors duration-[120ms] ease-planit",
          "focus:outline-none focus:ring-[3px]",
          error
            ? "border-danger focus:border-danger focus:ring-danger-weak"
            : "border-default focus:border-brand focus:ring-accent-ring",
        ].join(" ")}
        {...rest}
      />
      {message && (
        <p id={msgId} className={`text-caption ${error ? "text-danger font-semibold" : "text-tertiary"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
