import React from "react";

/**
 * Planit Card — flat white surface, hairline border, rounded. Not both heavy shadow + border.
 * `interactive` adds hover lift (shadow-2). `padding` in px.
 */
export function Card({ children, padding = 20, radius = "var(--radius-xl)", interactive = false, elevated = false, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
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
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
