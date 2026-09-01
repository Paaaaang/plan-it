import type { LucideIcon } from "lucide-react";

/**
 * 아이콘 래퍼 — 크기와 획 굵기 기본값을 한 곳에서 정한다.
 * lucide-react 아이콘을 그대로 넘긴다: <Icon name={MapPin} />
 */
export function Icon({
  name: LucideGlyph,
  size = 18,
  strokeWidth = 2.2,
  className,
}: {
  name: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <LucideGlyph
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
      focusable={false}
    />
  );
}
