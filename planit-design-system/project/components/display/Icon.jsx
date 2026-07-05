import React from "react";

/**
 * Planit Icon — Lucide glyph wrapper. Outline set, 1.5px stroke, inherits currentColor.
 * Requires the Lucide UMD script on the page (window.lucide). Renders a placeholder box
 * until lucide.createIcons() swaps in the SVG.
 */
export function Icon({ name, size = 24, color = "currentColor", strokeWidth = 1.75, style = {}, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      try { window.lucide.createIcons({ nameAttr: "data-lucide", icons: window.lucide.icons, attrs: {} }); } catch (e) {}
    }
  }, [name]);
  return (
    <i
      ref={ref}
      data-lucide={name}
      style={{
        display: "inline-flex", width: size, height: size, color,
        verticalAlign: "middle", flex: "0 0 auto", ...style,
      }}
      data-icon-size={size}
      data-icon-stroke={strokeWidth}
      {...rest}
    />
  );
}
