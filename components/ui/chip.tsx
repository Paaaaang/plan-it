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
  onClick?: () => void;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "onClick">) {
  const look = [
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
    "text-caption font-bold transition-colors duration-[120ms] ease-planit",
    selected ? "bg-brand text-on-accent" : "bg-neutral-fill text-tertiary",
    className,
  ].join(" ");

  if (!interactive) {
    return <span className={look} {...rest}>{children}</span>;
  }

  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={look} {...rest}>
      {children}
    </button>
  );
}
