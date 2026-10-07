import type { ReactNode } from "react";

/**
 * Chip — 두 가지로 쓴다.
 *  - 선택형(일차 전환 등): interactive={true}, aria-pressed로 상태를 알린다
 *  - 정보형(장소 태그 등): interactive={false}, 그냥 span
 */
export function Chip({
  children,
  selected = false,
  interactive = false,
  onClick,
  className = "",
  ...rest
}: {
  children: ReactNode;
  selected?: boolean;
  interactive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "onClick" | "aria-pressed">) {
  const look = [
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
    "text-caption font-bold transition-colors duration-fast ease-planit",
    selected ? "bg-brand text-on-accent" : "bg-neutral-fill text-secondary",
    className,
  ].join(" ");

  if (!interactive) {
    return (
      <span {...rest} onClick={onClick} className={look}>
        {children}
      </span>
    );
  }

  return (
    <button {...rest} type="button" aria-pressed={selected} onClick={onClick} className={look}>
      {children}
    </button>
  );
}
