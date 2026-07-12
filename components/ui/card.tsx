"use client";

import { ReactNode, useState } from "react";

/**
 * Planit Card — flat white surface, hairline border, rounded.
 * `interactive` adds hover lift (shadow-2). `elevated` uses shadow instead of border.
 *
 * @source planit-design-system/project/components/display/Card.jsx
 */

interface CardProps {
  children: ReactNode;
  padding?: number;
  radius?: string;
  interactive?: boolean;
  elevated?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({
  children,
  padding = 20,
  radius = "var(--radius-xl)",
  interactive = false,
  elevated = false,
  style = {},
  onClick,
  ...rest
}: CardProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: elevated ? "none" : "1px solid var(--border-secondary)",
        borderRadius: radius,
        padding,
        boxShadow: elevated ? "var(--shadow-2)" : hover ? "var(--shadow-2)" : "none",
        transform: interactive && hover ? "translateY(-2px)" : "none",
        transition: "box-shadow var(--dur-base) var(--ease), transform var(--dur-base) var(--ease)",
        cursor: interactive || onClick ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
