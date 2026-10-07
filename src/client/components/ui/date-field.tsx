"use client";

import type { InputHTMLAttributes } from "react";
import { FieldChrome, useFieldA11y } from "./field-shell";

/**
 * DateField — 네이티브 <input type="date">를 쓴다.
 * 달력 라이브러리를 얹지 않는다: 모바일에서 OS 피커가 가장 좋고, 접근성이 공짜다.
 * 값 형식은 YYYY-MM-DD.
 */
type Props = { label: string; hint?: string; error?: string } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "id" | "aria-invalid" | "aria-describedby"
>;

export function DateField({ label, hint, error, ...rest }: Props) {
  const { id, msgId, message, describedBy, invalid } = useFieldA11y(error, hint);

  // rest를 먼저 펼치고 계약이 있는 속성을 뒤에 둔다 — caller가 rest로 무엇을 넘기든
  // 이 필드의 접근성 배선(id·type·aria-invalid·aria-describedby)은 항상 이긴다.
  return (
    <FieldChrome id={id} label={label} msgId={msgId} message={message} isError={!!error}>
      <input
        {...rest}
        id={id}
        type="date"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={[
          "w-full rounded-field border bg-sunken px-3 py-2.5",
          "text-label font-medium text-primary tnum",
          "transition-colors duration-fast ease-planit",
          "focus:outline-none focus:ring-[3px]",
          error
            ? "border-danger focus:border-danger focus:ring-danger-weak"
            : "border-default focus:border-brand focus:ring-accent-ring",
        ].join(" ")}
      />
    </FieldChrome>
  );
}
