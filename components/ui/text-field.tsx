"use client";

import { useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * TextField — 라벨·힌트·오류를 접근성 속성으로 묶는다.
 * 오류는 색만으로 말하지 않는다: aria-invalid + 문구를 함께 낸다.
 */
type Base = {
  label: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
};

type Props = Base &
  Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export function TextField({ label, hint, error, multiline = false, ...rest }: Props) {
  const id = useId();
  const msgId = `${id}-msg`;
  const message = error ?? hint;

  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": message ? msgId : undefined,
    className: [
      "w-full rounded-[11px] border bg-sunken px-3 py-2.5",
      "text-label font-medium text-primary placeholder:text-tertiary",
      "transition-colors duration-[120ms] ease-planit",
      "focus:outline-none focus:ring-[3px]",
      error
        ? "border-danger focus:border-danger focus:ring-danger-weak"
        : "border-default focus:border-brand focus:ring-accent-ring",
    ].join(" "),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-bold text-tertiary">
        {label}
      </label>
      {multiline ? (
        <textarea rows={3} {...shared} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input {...shared} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {message && (
        <p id={msgId} className={`text-caption ${error ? "text-danger font-semibold" : "text-tertiary"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
