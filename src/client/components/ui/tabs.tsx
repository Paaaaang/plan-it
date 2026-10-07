"use client";

import { useRef } from "react";

/**
 * Tabs — 밑줄형. 뷰어와 편집기에서 쓴다.
 * 채운 세그먼트보다 가벼워서 커버 아래 크롬을 덜 무겁게 한다.
 * 좌우 화살표로 이동하는 ARIA 탭 패턴을 따른다.
 */
// id/panelId는 선택 사항이다 — 안 주면 지금처럼 id 없는 탭 버튼만 그린다.
// 주면 WAI-ARIA APG tabs 패턴대로 tab↔tabpanel을 잇는다(id/aria-controls).
export type TabItem = { value: string; label: string; id?: string; panelId?: string };

export function Tabs({
  items,
  value,
  onChange,
  className = "",
  role,
  onKeyDown,
  ...rest
}: {
  items: TabItem[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  // HTMLAttributes의 onChange(ChangeEventHandler)와 시그니처가 달라 반드시 Omit한다.
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const i = items.findIndex((t) => t.value === value);
    if (i < 0) return;
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    else return;
    e.preventDefault();
    onChange(items[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role={role ?? "tablist"}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) handleKeyDown(e);
      }}
      className={`flex gap-5 border-b border-default ${className}`}
      {...rest}
    >
      {items.map((t, i) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            ref={(el) => { refs.current[i] = el; }}
            id={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={t.panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={[
              "-mb-px border-b-2 pb-2.5 text-label transition-colors duration-fast ease-planit",
              active ? "border-brand font-bold text-brand" : "border-transparent font-semibold text-tertiary hover:text-secondary",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
