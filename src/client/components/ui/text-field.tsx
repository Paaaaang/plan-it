"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FieldChrome, useFieldA11y } from "./field-shell";

/**
 * TextField — 라벨·힌트·오류를 접근성 속성으로 묶는다.
 * 오류는 색만으로 말하지 않는다: aria-invalid + 문구를 함께 낸다.
 *
 * multiline을 판별자로 쓰는 판별 유니온이라 <TextField multiline cols={40} />처럼
 * 반대쪽 요소 전용 속성을 섞어 넘기면 타입 오류가 난다.
 */
type OmittedKeys = "className" | "id" | "aria-invalid" | "aria-describedby";

type FieldCommon = { label: string; hint?: string; error?: string };

type SingleProps = FieldCommon &
  Omit<InputHTMLAttributes<HTMLInputElement>, OmittedKeys> & { multiline?: false };

type MultiProps = FieldCommon &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, OmittedKeys> & { multiline: true };

type Props = SingleProps | MultiProps;

export function TextField({ label, hint, error, multiline, ...rest }: Props) {
  const { id, msgId, message, describedBy, invalid } = useFieldA11y(error, hint);

  const className = [
    "w-full rounded-field border bg-sunken px-3 py-2.5",
    "text-label font-medium text-primary placeholder:text-tertiary",
    "transition-colors duration-fast ease-planit",
    "focus:outline-none focus:ring-[3px]",
    error
      ? "border-danger focus:border-danger focus:ring-danger-weak"
      : "border-default focus:border-brand focus:ring-accent-ring",
  ].join(" ");

  // rest를 먼저 펼치고 계약이 있는 속성(id·aria-invalid·aria-describedby·className)을
  // 뒤에 둔다 — caller가 rest로 무엇을 넘기든 이 필드의 접근성 배선은 항상 이긴다.
  return (
    <FieldChrome id={id} label={label} msgId={msgId} message={message} isError={!!error}>
      {multiline ? (
        <textarea
          rows={3}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={className}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={className}
        />
      )}
    </FieldChrome>
  );
}
