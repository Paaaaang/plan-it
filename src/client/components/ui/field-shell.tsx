"use client";

import { useId } from "react";
import type { ReactNode } from "react";

/**
 * TextField·DateField가 공유하는 접근성 배선.
 * id → msgId → aria-invalid/aria-describedby 파생을 한 곳에서만 계산해서
 * 같은 배선 버그(id 충돌 등)가 두 파일에 따로 생기지 않게 한다.
 */
export function useFieldA11y(error?: string, hint?: string) {
  const id = useId();
  const msgId = `${id}-msg`;
  const message = error ?? hint;

  return {
    id,
    msgId,
    message,
    describedBy: message ? msgId : undefined,
    invalid: error ? (true as const) : undefined,
  };
}

/** 라벨 + 필드(children) + 힌트/오류 메시지를 감싸는 공통 마크업. */
export function FieldChrome({
  id,
  label,
  msgId,
  message,
  isError,
  children,
}: {
  id: string;
  label: string;
  msgId: string;
  message?: string;
  isError: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-bold text-tertiary">
        {label}
      </label>
      {children}
      {message && (
        <p id={msgId} className={`text-caption ${isError ? "text-danger font-semibold" : "text-tertiary"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
