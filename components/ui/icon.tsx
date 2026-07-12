/**
 * Planit Icon — Lucide 아이콘 래퍼 (Server Component 호환).
 * lucide-react 패키지의 아이콘을 name 기반으로 동적 렌더링.
 *
 * @source planit-design-system/project/components/display/Icon.jsx
 * @notes lucide-react 설치 후 사용. 설치 전까지는 placeholder 렌더링.
 */

interface IconProps {
  /** Lucide 아이콘 이름 (예: "map-pin", "clock", "share-2") */
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.75,
  style = {},
  className,
}: IconProps) {
  // TODO: lucide-react 설치 후 동적 아이콘 렌더링으로 교체
  // import { icons } from "lucide-react";
  // const LucideIcon = icons[name];
  return (
    <span
      data-icon={name}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color,
        verticalAlign: "middle",
        flex: "0 0 auto",
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Placeholder — lucide-react 설치 후 실제 아이콘으로 교체 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </span>
  );
}
