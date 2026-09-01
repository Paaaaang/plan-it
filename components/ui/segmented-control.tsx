"use client";

/**
 * SegmentedControl — 채움형. 상태 전환처럼 "지금 무엇인가"가 중요한 자리에 쓴다.
 * 화면 전환에는 Tabs를 쓴다.
 */
export type SegmentItem = { value: string; label: string };

export function SegmentedControl({
  items,
  value,
  onChange,
  label = "상태",
  className = "",
  role,
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
  return (
    <div
      role={role ?? "radiogroup"}
      aria-label={label}
      className={`inline-flex gap-0.5 rounded-control bg-neutral-fill p-0.5 ${className}`}
      {...rest}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="radio"
            aria-checked={active}
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
