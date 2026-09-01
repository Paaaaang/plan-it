import type { ReactNode } from "react";

/**
 * Badge — 상태 표시.
 * 색만으로 상태를 말하지 않는다: tone이 중립이 아니면 점을 함께 찍는다.
 * dot={false}로 점을 끄면 이 제약이 깨진다 — 문구만으로 의미가 전달되는 자리에서만 써라.
 */
type Tone = "brand" | "neutral" | "success" | "warning" | "danger";

const TONE: Record<Tone, string> = {
  brand: "bg-brand-weak text-on-brand-weak",
  neutral: "bg-neutral-fill text-secondary",
  success: "bg-success-weak text-on-success-weak",
  warning: "bg-warning-weak text-on-warning-weak",
  danger: "bg-danger-weak text-on-danger-weak",
};

export function Badge({
  children,
  tone = "neutral",
  dot,
  className = "",
  ...rest
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  // 의미가 있는 tone은 점을 기본으로 켠다.
  const showDot = dot ?? tone !== "neutral";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-micro font-extrabold tracking-wide",
        TONE[tone],
        className,
      ].join(" ")}
      {...rest}
    >
      {showDot && <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
