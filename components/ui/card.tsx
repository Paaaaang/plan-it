import type { HTMLAttributes, ReactNode } from "react";

/**
 * Card — elevated는 강한 그림자(shadow-pop), 기본도 옅은 그림자(shadow-card)를 쓴다.
 * 완전 플랫은 쓰지 않는다. interactive면 키보드로도 눌린다.
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
  role,
  tabIndex,
  onKeyDown,
  ...rest
}: CardProps) {
  return (
    <div
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              onKeyDown?.(e);
              if (!e.defaultPrevented && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                (e.currentTarget as HTMLDivElement).click();
              }
            }
          : onKeyDown
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
