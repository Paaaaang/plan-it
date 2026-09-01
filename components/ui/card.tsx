import type { HTMLAttributes, ReactNode } from "react";

/**
 * Card — 플랫이 기본. 그림자는 떠 있는 것에만 쓴다.
 * interactive면 키보드로도 눌린다.
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
}

export function Card({
  children,
  elevated = false,
  interactive = false,
  className = "",
  onClick,
  ...rest
}: CardProps) {
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                (e.currentTarget as HTMLDivElement).click();
              }
            }
          : undefined
      }
      className={[
        "rounded-card bg-surface p-4",
        elevated ? "shadow-pop" : "shadow-card",
        interactive ? "cursor-pointer transition-transform duration-[120ms] ease-planit hover:-translate-y-0.5" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
