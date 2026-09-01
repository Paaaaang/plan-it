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
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  return (
    <div
      role={role ?? "radiogroup"}
      aria-label={label}
      className={`inline-flex gap-0.5 rounded-[10px] bg-neutral-fill p-0.5 ${className}`}
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
              "rounded-[8px] px-3.5 py-1.5 text-caption font-bold",
              "transition-colors duration-[120ms] ease-planit",
              active ? "bg-surface text-primary shadow-card" : "text-tertiary hover:text-secondary",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
