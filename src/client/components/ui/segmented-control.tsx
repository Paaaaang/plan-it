"use client";

import { useRef } from "react";

/**
 * SegmentedControl — 채움형. 상태 전환처럼 "지금 무엇인가"가 중요한 자리에 쓴다.
 * 화면 전환에는 Tabs를 쓴다.
 * WAI-ARIA APG radiogroup 패턴을 따른다: 화살표로 이동하며 선택도 함께 옮기고,
 * 로빙 탭인덱스로 선택된 것만 Tab 순서에 둔다. (tabs.tsx와 같은 로직이지만
 * role·키 매핑이 달라 그대로 옮겨온다 — 공통 훅으로 추출하지 않는다.)
 */
export type SegmentItem = { value: string; label: string };

export function SegmentedControl({
  items,
  value,
  onChange,
  label = "상태",
  className = "",
  role,
  onKeyDown,
  ...rest
}: {
  items: SegmentItem[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
  className?: string;
  // HTMLAttributes의 onChange와 충돌하므로 Omit한다.
  // aria-label도 Omit한다 — 안 그러면 rest의 aria-label이 label prop을 조용히 덮어쓴다.
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "aria-label">) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const i = items.findIndex((it) => it.value === value);
    if (i < 0) return;
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % items.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role={role ?? "radiogroup"}
      aria-label={label}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) handleKeyDown(e);
      }}
      className={`inline-flex gap-0.5 rounded-control bg-neutral-fill p-0.5 ${className}`}
      {...rest}
    >
      {items.map((it, i) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(it.value)}
            className={[
              "rounded-xs px-3.5 py-1.5 text-caption font-bold",
              "transition-colors duration-fast ease-planit",
              active ? "bg-surface text-primary shadow-card" : "text-secondary hover:text-primary",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
