/* @ds-bundle: {"format":4,"namespace":"PlanitDesignSystem_e6392f","components":[{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Chip","sourcePath":"components/display/Chip.jsx"},{"name":"Icon","sourcePath":"components/display/Icon.jsx"},{"name":"ListRow","sourcePath":"components/display/ListRow.jsx"},{"name":"BottomSheet","sourcePath":"components/feedback/BottomSheet.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Loader","sourcePath":"components/feedback/Loader.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"BottomCTA","sourcePath":"components/navigation/BottomCTA.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"TopBar","sourcePath":"components/navigation/TopBar.jsx"}],"sourceHashes":{"components/display/Avatar.jsx":"a138b98bda72","components/display/Badge.jsx":"0207543a9d1b","components/display/Card.jsx":"6cf6bf6ae467","components/display/Chip.jsx":"9ddac2d03240","components/display/Icon.jsx":"bd3e31465774","components/display/ListRow.jsx":"958ab9edb155","components/feedback/BottomSheet.jsx":"7e8917bae9f1","components/feedback/Dialog.jsx":"46869378211d","components/feedback/Loader.jsx":"2e6bfd453bc8","components/feedback/Toast.jsx":"10b0f88f04de","components/forms/Button.jsx":"5588386e9b96","components/forms/Checkbox.jsx":"d5e06d89d3d9","components/forms/SearchField.jsx":"b86050db21bb","components/forms/SegmentedControl.jsx":"bf3f837fe7b6","components/forms/Switch.jsx":"4d5d39e79313","components/forms/TextField.jsx":"831ca47552be","components/navigation/BottomCTA.jsx":"6a531efc35de","components/navigation/TabBar.jsx":"6c2e974e0cf6","components/navigation/TopBar.jsx":"75ee1fd81c01","ui_kits/admin/AdminScreens.jsx":"08c936114f07","ui_kits/planner/PlannerScreens.jsx":"6e505167fa48","ui_kits/viewer/ViewerScreens.jsx":"d873f7546f2e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PlanitDesignSystem_e6392f = window.PlanitDesignSystem_e6392f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
/** Planit Avatar — rounded-square (radius 14) or circle. Image, or initial on blue-50 tint. */
function Avatar({
  src,
  name = "",
  size = 44,
  shape = "rounded",
  tone = "brand",
  style = {}
}) {
  const radius = shape === "circle" ? "50%" : "var(--radius-l)";
  const tones = {
    brand: {
      bg: "var(--blue-100)",
      fg: "var(--blue-700)"
    },
    neutral: {
      bg: "var(--grey-200)",
      fg: "var(--grey-700)"
    }
  };
  const t = tones[tone] || tones.brand;
  const initial = (name || "").trim().charAt(0).toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      placeItems: "center",
      width: size,
      height: size,
      borderRadius: radius,
      overflow: "hidden",
      background: t.bg,
      color: t.fg,
      flex: "0 0 auto",
      font: `700 ${Math.round(size * 0.4)}px/1 var(--font-sans)`,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initial);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
/** Planit Badge — 22px, 6px radius, washed semantic background. Denser than Chip. */
const TONES = {
  neutral: {
    bg: "var(--grey-100)",
    fg: "var(--text-secondary)"
  },
  brand: {
    bg: "var(--blue-50)",
    fg: "var(--text-brand)"
  },
  success: {
    bg: "var(--green-50)",
    fg: "var(--text-success)"
  },
  danger: {
    bg: "var(--red-50)",
    fg: "var(--text-danger)"
  },
  warning: {
    bg: "var(--amber-50)",
    fg: "var(--text-warning)"
  },
  info: {
    bg: "var(--blue-50)",
    fg: "var(--text-info)"
  }
};
function Badge({
  children,
  tone = "neutral",
  dot = false,
  style = {}
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 22,
      padding: "0 8px",
      borderRadius: 6,
      background: t.bg,
      color: t.fg,
      font: "var(--label-s-fw) 12px/1 var(--font-sans)",
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.fg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Planit Card — flat white surface, hairline border, rounded. Not both heavy shadow + border.
 * `interactive` adds hover lift (shadow-2). `padding` in px.
 */
function Card({
  children,
  padding = 20,
  radius = "var(--radius-xl)",
  interactive = false,
  elevated = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-card)",
      border: elevated ? "none" : "1px solid var(--border-secondary)",
      borderRadius: radius,
      padding,
      boxShadow: elevated ? "var(--shadow-2)" : hover ? "var(--shadow-2)" : "none",
      transform: interactive && hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--dur-base) var(--ease), transform var(--dur-base) var(--ease)",
      cursor: interactive ? "pointer" : "default",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Planit Chip — 34px full pill, multi-filter selection.
 * resting: hairline + white. active: grey-900 fill + white. brand: blue-50 + blue text.
 */
function Chip({
  children,
  active = false,
  variant = "neutral",
  leadingIcon = null,
  onClick,
  style = {},
  ...rest
}) {
  let bg = "var(--surface-card)",
    color = "var(--text-secondary)",
    border = "1px solid var(--border-secondary)";
  if (active && variant === "neutral") {
    bg = "var(--fill-primary)";
    color = "var(--text-alt)";
    border = "1px solid var(--fill-primary)";
  }
  if (variant === "brand") {
    bg = "var(--fill-brand-weak)";
    color = "var(--text-brand)";
    border = "1px solid transparent";
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 34,
      padding: "0 14px",
      borderRadius: "var(--radius-full)",
      background: bg,
      color,
      border,
      font: "var(--label-s-fw) var(--label-s-size)/1 var(--font-sans)",
      cursor: "pointer",
      transition: "background var(--dur-base) var(--ease), color var(--dur-base) var(--ease)",
      ...style
    }
  }, rest), leadingIcon, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Chip.jsx", error: String((e && e.message) || e) }); }

// components/display/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Planit Icon — Lucide glyph wrapper. Outline set, 1.5px stroke, inherits currentColor.
 * Requires the Lucide UMD script on the page (window.lucide). Renders a placeholder box
 * until lucide.createIcons() swaps in the SVG.
 */
function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.75,
  style = {},
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      try {
        window.lucide.createIcons({
          nameAttr: "data-lucide",
          icons: window.lucide.icons,
          attrs: {}
        });
      } catch (e) {}
    }
  }, [name]);
  return /*#__PURE__*/React.createElement("i", _extends({
    ref: ref,
    "data-lucide": name,
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      color,
      verticalAlign: "middle",
      flex: "0 0 auto",
      ...style
    },
    "data-icon-size": size,
    "data-icon-stroke": strokeWidth
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Planit ListRow — the standard schedule/list unit. Whole row is the hit area.
 * left slot (avatar/icon) + title/subtitle stack + right slot (value/time/chevron).
 */
function ListRow({
  left = null,
  title,
  subtitle = null,
  right = null,
  chevron = false,
  onClick,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 24px",
      minHeight: 64,
      background: "var(--surface-card)",
      cursor: clickable ? "pointer" : "default",
      ...style
    }
  }, rest), clickable && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--overlay-press)",
      opacity: pressed ? 1 : 0,
      transition: "opacity var(--dur-fast) var(--ease)",
      pointerEvents: "none"
    }
  }), left, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--title-2-fw) var(--title-2-size)/1.35 var(--font-sans)",
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--body-3-fw) var(--body-3-size)/1.4 var(--font-sans)",
      color: "var(--text-tertiary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, subtitle)), right && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "0 0 auto",
      textAlign: "right",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, right), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--grey-400)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 6 6 6-6 6"
  })));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/BottomSheet.jsx
try { (() => {
/**
 * Planit BottomSheet — primary mobile alternative to Dialog. 20–24px top radius,
 * sheet shadow, scrim, grabber handle. Slides up.
 */
function BottomSheet({
  open = true,
  title,
  children,
  onClose,
  header = null
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 80,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      background: "var(--overlay-scrim)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--surface-card)",
      borderTopLeftRadius: "var(--radius-3xl)",
      borderTopRightRadius: "var(--radius-3xl)",
      boxShadow: "var(--shadow-sheet)",
      padding: "10px 24px calc(24px + env(safe-area-inset-bottom))",
      animation: "planit-sheet-in var(--dur-slow) var(--ease-out)",
      maxHeight: "86%",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 999,
      background: "var(--grey-200)",
      margin: "0 auto 16px"
    }
  }), header, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--h4-fw) var(--h4-size)/1.35 var(--font-sans)",
      letterSpacing: "-0.015em",
      color: "var(--text-primary)",
      marginBottom: 16
    }
  }, title), children), /*#__PURE__*/React.createElement("style", null, `@keyframes planit-sheet-in{from{transform:translateY(100%)}to{transform:translateY(0)}}`));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Loader.jsx
try { (() => {
/** Planit Loader — 3-dot pulse (never shimmer). size scales dot diameter. */
function Loader({
  size = 8,
  color = "var(--text-brand)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: size * 0.6,
      alignItems: "center",
      ...style
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      animation: "planit-loader 900ms var(--ease) infinite",
      animationDelay: `${i * 150}ms`
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes planit-loader{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`));
}
Object.assign(__ds_scope, { Loader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Loader.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/**
 * Planit Toast — grey-900 surface + white label, radius-l, shadow-toast.
 * tone success shows a green check circle. Inline (position it yourself) or fixed via `floating`.
 */
function Toast({
  children,
  tone = "default",
  floating = false,
  style = {}
}) {
  const icon = tone === "success" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "var(--fill-success)",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--white)",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5 9.5 18 20 6.5"
  }))) : tone === "danger" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "var(--fill-danger)",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    stroke: "var(--white)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 7v6M12 17h.01"
  }))) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...(floating ? {
        position: "fixed",
        left: "50%",
        bottom: 32,
        transform: "translateX(-50%)",
        zIndex: 60
      } : {}),
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      maxWidth: 440,
      padding: "13px 18px",
      background: "var(--fill-primary)",
      color: "var(--text-alt)",
      borderRadius: "var(--radius-l)",
      boxShadow: "var(--shadow-toast)",
      font: "var(--label-m-fw) var(--label-m-size)/1.35 var(--font-sans)",
      ...style
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Planit Button — the workhorse action. Reads like a sentence, not decoration.
 * Sizes scale height + radius + label weight together (XL/L/M/S).
 * variant: primary (one per screen) · secondary · danger · ghost
 */
const SIZES = {
  xl: {
    height: 56,
    radius: "var(--radius-xl)",
    padX: 24,
    fs: "var(--label-l-size)",
    fw: "var(--label-l-fw)"
  },
  l: {
    height: 48,
    radius: "var(--radius-l)",
    padX: 20,
    fs: "var(--label-l-size)",
    fw: "var(--label-l-fw)"
  },
  m: {
    height: 40,
    radius: "var(--radius-m)",
    padX: 16,
    fs: "var(--label-m-size)",
    fw: "var(--label-m-fw)"
  },
  s: {
    height: 32,
    radius: "10px",
    padX: 12,
    fs: "var(--label-s-size)",
    fw: "var(--label-s-fw)"
  }
};
const VARIANTS = {
  primary: {
    background: "var(--fill-brand)",
    color: "var(--text-alt)",
    border: "none"
  },
  secondary: {
    background: "var(--fill-secondary)",
    color: "var(--text-primary)",
    border: "none"
  },
  danger: {
    background: "var(--fill-danger)",
    color: "var(--text-alt)",
    border: "none"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-brand)",
    border: "none"
  }
};
function Button({
  children,
  variant = "primary",
  size = "l",
  block = false,
  disabled = false,
  loading = false,
  leadingIcon = null,
  trailingIcon = null,
  style = {},
  ...rest
}) {
  const s = SIZES[size] || SIZES.l;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [pressed, setPressed] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      position: "relative",
      display: block ? "flex" : "inline-flex",
      width: block ? "100%" : "auto",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: s.height,
      padding: `0 ${s.padX}px`,
      borderRadius: s.radius,
      fontFamily: "var(--font-sans)",
      fontSize: s.fs,
      fontWeight: s.fw,
      letterSpacing: "-0.005em",
      lineHeight: 1,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? "var(--disabled-opacity)" : 1,
      transition: `background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)`,
      overflow: "hidden",
      ...v,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: "var(--overlay-press)",
      opacity: pressed && !disabled ? 1 : 0,
      transition: "opacity var(--dur-fast) var(--ease)",
      pointerEvents: "none"
    }
  }), loading ? /*#__PURE__*/React.createElement(Dots, {
    color: variant === "secondary" || variant === "ghost" ? "var(--text-secondary)" : "var(--text-alt)"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, leadingIcon, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, children), trailingIcon));
}
function Dots({
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 4,
      position: "relative"
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: color,
      animation: "planit-dot 900ms var(--ease) infinite",
      animationDelay: `${i * 150}ms`
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes planit-dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}`));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/**
 * Planit Dialog — white, radius-2xl, 24px padding, shadow-3, scrim.
 * Stacked CTAs: primary + optional secondary, each 48px.
 */
function Dialog({
  open = true,
  title,
  body,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  onClose,
  illustration = null
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 80,
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "var(--overlay-scrim)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 340,
      background: "var(--surface-card)",
      borderRadius: "var(--radius-2xl)",
      padding: 24,
      boxShadow: "var(--shadow-3)",
      textAlign: "center",
      animation: "planit-dialog-in var(--dur-slow) var(--ease-out)"
    }
  }, illustration && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: "flex",
      justifyContent: "center"
    }
  }, illustration), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--title-1-fw) var(--title-1-size)/1.4 var(--font-sans)",
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      marginBottom: 8
    }
  }, title), body && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--body-2-fw) var(--body-2-size)/1.5 var(--font-sans)",
      color: "var(--text-secondary)",
      marginBottom: 24
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, primary && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "l",
    block: true,
    onClick: onPrimary
  }, primary), secondary && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "l",
    block: true,
    onClick: onSecondary || onClose
  }, secondary))), /*#__PURE__*/React.createElement("style", null, `@keyframes planit-dialog-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Planit Checkbox — 22px, 6px radius. Unchecked hairline → blue fill + white check. */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? "var(--disabled-opacity)" : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: "grid",
      placeItems: "center",
      width: 22,
      height: 22,
      borderRadius: 6,
      background: checked ? "var(--fill-brand)" : "var(--surface-card)",
      border: checked ? "none" : "1.5px solid var(--border-strong)",
      transition: "background var(--dur-base) var(--ease)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--white)",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5 9.5 18 20 6.5"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Planit SearchField — TextField variant with a leading search glyph. */
function SearchField({
  value,
  onChange,
  placeholder = "검색",
  onClear,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 48,
      padding: "0 14px",
      background: focused ? "var(--surface-card)" : "var(--fill-secondary)",
      border: `${focused ? 1.5 : 1}px solid ${focused ? "var(--border-primary)" : "var(--border-secondary)"}`,
      borderRadius: "var(--radius-m)",
      transition: "border-color var(--dur-base) var(--ease), background var(--dur-base) var(--ease)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-tertiary)",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.5-3.5"
  })), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
      letterSpacing: "var(--body-2-ls)",
      color: "var(--text-primary)"
    }
  }, rest)), value && onClear && /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    type: "button",
    "aria-label": "\uC9C0\uC6B0\uAE30",
    style: {
      display: "grid",
      placeItems: "center",
      width: 20,
      height: 20,
      padding: 0,
      border: "none",
      borderRadius: "50%",
      background: "var(--grey-300)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    stroke: "var(--white)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  }))));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
/**
 * Planit SegmentedControl — mutually-exclusive single choice.
 * grey-100 track; selected segment lifts to white + shadow-1.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = "m",
  style = {}
}) {
  const h = size === "s" ? 32 : 40;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      padding: 3,
      gap: 2,
      background: "var(--fill-secondary)",
      borderRadius: "var(--radius-l)",
      ...style
    }
  }, options.map(opt => {
    const val = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    const active = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      onClick: () => onChange && onChange(val),
      style: {
        height: h,
        padding: "0 16px",
        border: "none",
        borderRadius: "var(--radius-m)",
        background: active ? "var(--surface-card)" : "transparent",
        boxShadow: active ? "var(--shadow-1)" : "none",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        font: `${active ? "var(--label-m-fw)" : "var(--fw-medium)"} var(--label-m-size)/1 var(--font-sans)`,
        cursor: "pointer",
        transition: "background var(--dur-base) var(--ease), color var(--dur-base) var(--ease)"
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Planit Switch — 44×26 track, 20px knob, 200ms ease translate. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      position: "relative",
      width: 44,
      height: 26,
      padding: 0,
      border: "none",
      borderRadius: "var(--radius-full)",
      background: checked ? "var(--fill-brand)" : "var(--grey-300)",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? "var(--disabled-opacity)" : 1,
      transition: "background var(--dur-base) var(--ease)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 3,
      left: 3,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "var(--white)",
      boxShadow: "var(--shadow-1)",
      transform: checked ? "translateX(18px)" : "translateX(0)",
      transition: "transform var(--dur-base) var(--ease)"
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Planit TextField — 48px, grey-100 resting → white + 1.5px blue on focus.
 * Error state: 1.5px red border + red helper text.
 */
function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  helper = "",
  error = "",
  disabled = false,
  type = "text",
  leadingIcon = null,
  trailingSlot = null,
  multiline = false,
  rows = 3,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const hasError = !!error;
  const borderColor = hasError ? "var(--fill-danger)" : focused ? "var(--border-primary)" : "var(--border-secondary)";
  const borderWidth = hasError || focused ? 1.5 : 1;
  const Field = multiline ? "textarea" : "input";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--pair-gap)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--label-s-fw) var(--label-s-size)/var(--label-s-lh) var(--font-sans)",
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: multiline ? "flex-start" : "center",
      gap: 8,
      minHeight: multiline ? "auto" : 48,
      padding: multiline ? "14px 16px" : "0 16px",
      background: focused ? "var(--surface-card)" : "var(--fill-secondary)",
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: "var(--radius-m)",
      opacity: disabled ? "var(--disabled-opacity)" : 1,
      transition: "border-color var(--dur-base) var(--ease), background var(--dur-base) var(--ease)"
    }
  }, leadingIcon, /*#__PURE__*/React.createElement(Field, _extends({
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    type: multiline ? undefined : type,
    rows: multiline ? rows : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      resize: multiline ? "vertical" : "none",
      font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
      letterSpacing: "var(--body-2-ls)",
      color: "var(--text-primary)",
      padding: multiline ? 0 : "0"
    }
  }, rest)), trailingSlot), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--body-3-fw) var(--body-3-size)/var(--body-3-lh) var(--font-sans)",
      color: hasError ? "var(--text-danger)" : "var(--text-tertiary)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomCTA.jsx
try { (() => {
/**
 * Planit BottomCTA — fixed bottom action zone with a white→transparent protection gradient
 * above it and safe-area padding. One screen-level action. Do not pair with a primary Button.
 */
function BottomCTA({
  children,
  onClick,
  disabled = false,
  loading = false,
  info = null,
  sticky = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: sticky ? "sticky" : "static",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      paddingTop: 28,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 28,
      background: "linear-gradient(to bottom, rgba(255,255,255,0), var(--surface-card))",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      padding: "0 16px calc(16px + env(safe-area-inset-bottom))"
    }
  }, info && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      background: "var(--fill-brand-weak)",
      color: "var(--text-brand)",
      borderRadius: "var(--radius-full)",
      font: "var(--label-s-fw) var(--label-s-size)/1 var(--font-sans)"
    }
  }, info)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "xl",
    block: true,
    onClick: onClick,
    disabled: disabled,
    loading: loading
  }, children)));
}
Object.assign(__ds_scope, { BottomCTA });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomCTA.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/**
 * Planit TabBar — floating mobile bottom nav. 2–5 items, max-width 420, radius-3xl, hairline.
 * Active item: filled icon + blue label. Requires window.lucide for icons.
 */
function TabBar({
  items = [],
  value,
  onChange,
  style = {}
}) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      maxWidth: 420,
      margin: "0 auto",
      padding: 6,
      background: "var(--surface-card)",
      border: "1px solid var(--border-secondary)",
      borderRadius: "var(--radius-3xl)",
      boxShadow: "var(--shadow-2)",
      ...style
    }
  }, items.map(it => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      onClick: () => onChange && onChange(it.value),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "8px 4px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: active ? "var(--text-brand)" : "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": it.icon,
      style: {
        width: 24,
        height: 24
      },
      "data-icon-fill": active ? "1" : "0"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: `${active ? 700 : 500} 11px/1 var(--font-sans)`
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopBar.jsx
try { (() => {
/** Planit TopBar — 56pt app bar. Back/logo slot, centered or leading title, trailing action slot. */
function TopBar({
  title,
  onBack,
  leading = null,
  trailing = null,
  centered = false,
  border = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 56,
      padding: "0 12px",
      background: "var(--surface-card)",
      borderBottom: border ? "1px solid var(--border-secondary)" : "none",
      ...style
    }
  }, onBack ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\uB4A4\uB85C",
    onClick: onBack,
    style: iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-primary)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))) : leading, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      textAlign: centered ? "center" : "left",
      padding: centered ? 0 : "0 4px",
      font: "var(--title-1-fw) var(--title-1-size)/1 var(--font-sans)",
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, trailing));
}
const iconBtn = {
  display: "grid",
  placeItems: "center",
  width: 40,
  height: 40,
  padding: 0,
  border: "none",
  background: "transparent",
  borderRadius: "var(--radius-m)",
  cursor: "pointer",
  flex: "0 0 auto"
};
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminScreens.jsx
try { (() => {
// Planit — Admin console UI kit (desktop web). Operations KPI dashboard.
const {
  Button,
  SearchField,
  Card,
  Badge,
  Avatar,
  Chip,
  Icon
} = window.PlanitDesignSystem_e6392f;
const KPIS = [{
  k: "주간 신규 생성",
  v: "342",
  d: "+12%",
  up: true,
  i: "calendar-plus"
}, {
  k: "공유 전환율",
  v: "64%",
  d: "+3%p",
  up: true,
  i: "share-2"
}, {
  k: "일정당 평균 조회",
  v: "7.8",
  d: "+0.6",
  up: true,
  i: "eye"
}, {
  k: "실용 액션 클릭률",
  v: "31%",
  d: "-1%p",
  up: false,
  i: "mouse-pointer-click"
}];
const BARS = [42, 55, 48, 63, 71, 58, 82, 76, 91, 68, 88, 95];
const ROWS = [{
  t: "제주 워크샵 2026",
  u: "김플랜",
  v: 1280,
  s: "정상"
}, {
  t: "가을 동아리 MT",
  u: "이여행",
  v: 412,
  s: "정상"
}, {
  t: "★★ 초특가 여행 상품 ★★",
  u: "unknown_39",
  v: 21,
  s: "신고"
}, {
  t: "사내 오프사이트",
  u: "박총무",
  v: 0,
  s: "비공개"
}, {
  t: "부산 미식 투어",
  u: "정푸드",
  v: 638,
  s: "정상"
}];
const SBADGE = {
  정상: {
    tone: "success",
    dot: true
  },
  신고: {
    tone: "danger",
    dot: true
  },
  비공개: {
    tone: "neutral"
  }
};
function Sidebar() {
  const nav = [{
    label: "운영 지표",
    icon: "bar-chart-3",
    on: true
  }, {
    label: "일정 관리",
    icon: "calendar"
  }, {
    label: "사용자 관리",
    icon: "users"
  }, {
    label: "신고 · 검토",
    icon: "flag"
  }, {
    label: "공지 템플릿",
    icon: "megaphone"
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 220,
      flex: "0 0 auto",
      borderRight: "1px solid var(--border-secondary)",
      background: "var(--surface-card)",
      padding: "20px 14px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "4px 8px 8px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-blue.png",
    style: {
      width: 24,
      height: 24,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 17px/1 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "\uD50C\uB79C\uC787"), /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, "\uC6B4\uC601")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      marginTop: 12
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: "var(--radius-m)",
      background: n.on ? "var(--fill-brand-weak)" : "transparent",
      color: n.on ? "var(--text-brand)" : "var(--text-secondary)",
      font: `${n.on ? 700 : 500} 14px/1 var(--font-sans)`,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon,
    size: 18
  }), " ", n.label))));
}
function Dashboard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "26px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: "700 24px/1.2 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "\uC6B4\uC601 \uC9C0\uD45C"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      font: "400 13px/1.4 var(--font-sans)",
      color: "var(--text-tertiary)"
    }
  }, "\uCD5C\uADFC 12\uC8FC \xB7 2026.07.05 \uAE30\uC900")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    placeholder: "\uC77C\uC815 \xB7 \uC0AC\uC6A9\uC790 \uAC80\uC0C9"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "l",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 17
    })
  }, "\uB0B4\uBCF4\uB0B4\uAE30"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16,
      marginBottom: 16
    }
  }, KPIS.map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.k,
    padding: 18
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 28,
      height: 28,
      color: "var(--text-brand)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.i,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      font: "600 12px/1 var(--font-sans)",
      color: m.up ? "var(--text-success)" : "var(--text-danger)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.up ? "trending-up" : "trending-down",
    size: 13
  }), m.d)), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      font: "700 30px/1.1 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)",
      marginTop: 14
    }
  }, m.v), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px/1 var(--font-sans)",
      color: "var(--text-tertiary)",
      marginTop: 5
    }
  }, m.k)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 15px/1 var(--font-sans)",
      color: "var(--text-primary)",
      marginBottom: 4
    }
  }, "\uC8FC\uAC04 \uC2E0\uADDC \uC0DD\uC131 \uC77C\uC815"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px/1 var(--font-sans)",
      color: "var(--text-tertiary)",
      marginBottom: 20
    }
  }, "\uCD5C\uADFC 12\uC8FC"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 8,
      height: 150
    }
  }, BARS.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: `${h}%`,
      borderRadius: "6px 6px 0 0",
      background: i === BARS.length - 1 ? "var(--fill-brand)" : "var(--grey-200)"
    }
  })))), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 18px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 15px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, "\uCD5C\uADFC \uC77C\uC815"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "500 12px/1 var(--font-sans)",
      color: "var(--text-brand)",
      cursor: "pointer"
    }
  }, "\uC804\uCCB4\uBCF4\uAE30")), ROWS.map((r, i) => {
    const b = SBADGE[r.s];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderTop: "1px solid var(--border-secondary)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "600 13px/1.3 var(--font-sans)",
        color: "var(--text-primary)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, r.t), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "400 11px/1.3 var(--font-sans)",
        color: "var(--text-tertiary)"
      }
    }, r.u, " \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "tnum"
    }, r.v.toLocaleString()), " \uC870\uD68C")), /*#__PURE__*/React.createElement(Badge, {
      tone: b.tone,
      dot: b.dot
    }, r.s), r.s === "신고" && /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      size: "s"
    }, "\uBE14\uB77C\uC778\uB4DC"));
  }))));
}
Object.assign(window, {
  PlanitAdmin: {
    Sidebar,
    Dashboard
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/planner/PlannerScreens.jsx
try { (() => {
// Planit — Planner UI kit (desktop web). Dashboard · Editor · Share manager.
const {
  Button,
  TextField,
  SearchField,
  Card,
  ListRow,
  Chip,
  Badge,
  Avatar,
  Switch,
  SegmentedControl,
  Toast,
  Icon
} = window.PlanitDesignSystem_e6392f;
const SCHEDULES = [{
  id: "jeju",
  title: "제주 워크샵 2026",
  meta: "10.24–10.26 · 12명",
  views: 1280,
  status: "public",
  cover: "linear-gradient(150deg,var(--blue-600),var(--blue-400))"
}, {
  id: "mt",
  title: "가을 동아리 MT",
  meta: "11.08–11.09 · 24명",
  views: 412,
  status: "public",
  cover: "linear-gradient(150deg,#12B886,#3BC9A0)"
}, {
  id: "off",
  title: "사내 오프사이트",
  meta: "12.02–12.03 · 40명",
  views: 0,
  status: "private",
  cover: "linear-gradient(150deg,#45454F,#82828E)"
}, {
  id: "bday",
  title: "지현 생일 모임",
  meta: "10.30 · 8명",
  views: 96,
  status: "draft",
  cover: "linear-gradient(150deg,#F5A623,#FFCE73)"
}];
const STATUS = {
  public: {
    tone: "success",
    label: "공개중",
    dot: true
  },
  private: {
    tone: "neutral",
    label: "비공개"
  },
  draft: {
    tone: "warning",
    label: "임시저장"
  }
};

// ---- Shell -------------------------------------------------------
function Sidebar({
  view,
  setView
}) {
  const nav = [{
    k: "dash",
    label: "대시보드",
    icon: "layout-dashboard"
  }, {
    k: "editor",
    label: "일정 편집",
    icon: "square-pen"
  }, {
    k: "share",
    label: "공유 · 통계",
    icon: "share-2"
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flex: "0 0 auto",
      borderRight: "1px solid var(--border-secondary)",
      background: "var(--surface-card)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "4px 8px 20px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-blue.png",
    style: {
      width: 26,
      height: 26,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 19px/1 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "\uD50C\uB79C\uC787")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, nav.map(n => {
    const on = view === n.k;
    return /*#__PURE__*/React.createElement("button", {
      key: n.k,
      onClick: () => setView(n.k),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        border: "none",
        borderRadius: "var(--radius-m)",
        background: on ? "var(--fill-brand-weak)" : "transparent",
        color: on ? "var(--text-brand)" : "var(--text-secondary)",
        font: `${on ? 700 : 500} 14px/1 var(--font-sans)`,
        cursor: "pointer",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 19
    }), " ", n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 8px",
      borderTop: "1px solid var(--border-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "\uAE40\uD50C\uB79C",
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 13px/1.3 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, "\uAE40\uD50C\uB79C"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 11px/1.3 var(--font-sans)",
      color: "var(--text-tertiary)",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "\uCD1D\uBB34 \xB7 \uBB34\uB8CC \uD50C\uB79C"))));
}

// ---- Dashboard ---------------------------------------------------
function Dashboard({
  onOpen,
  onNew
}) {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("전체");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 32px",
      overflowY: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: "700 26px/1.2 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "\uB0B4 \uC77C\uC815"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      font: "400 14px/1.4 var(--font-sans)",
      color: "var(--text-tertiary)"
    }
  }, "\uC5EC\uD589\xB7\uD589\uC0AC\xB7\uBAA8\uC784\uC744 \uB9CC\uB4E4\uACE0 \uB9C1\uD06C\uB85C \uACF5\uC720\uD574\uC694.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "l",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 19
    }),
    onClick: onNew
  }, "\uC0C8 \uC77C\uC815 \uB9CC\uB4E4\uAE30")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    value: q,
    onChange: e => setQ(e.target.value),
    onClear: () => setQ(""),
    placeholder: "\uC77C\uC815 \uAC80\uC0C9"
  })), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ["전체", "공개", "비공개", "임시저장"],
    value: filter,
    onChange: setFilter,
    size: "s"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))",
      gap: 16
    }
  }, SCHEDULES.map(s => {
    const st = STATUS[s.status];
    return /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      interactive: true,
      padding: 0,
      onClick: onOpen,
      style: {
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 96,
        background: s.cover,
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: 12,
        left: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: st.tone,
      dot: st.dot
    }, st.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "700 16px/1.35 var(--font-sans)",
        letterSpacing: "-0.01em",
        color: "var(--text-primary)"
      }
    }, s.title), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "400 13px/1.4 var(--font-sans)",
        color: "var(--text-tertiary)",
        marginTop: 4
      }
    }, s.meta), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginTop: 12,
        color: "var(--text-secondary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 15
    }), /*#__PURE__*/React.createElement("span", {
      className: "tnum",
      style: {
        font: "600 13px/1 var(--font-sans)"
      }
    }, s.views.toLocaleString()), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "400 13px/1 var(--font-sans)",
        color: "var(--text-tertiary)"
      }
    }, "\uD68C \uC870\uD68C"))));
  })));
}

// ---- Editor ------------------------------------------------------
const BLOCKS = [{
  k: "basic",
  label: "기본 정보",
  icon: "info",
  desc: "제목 · 기간 · 설명 · 커버"
}, {
  k: "highlight",
  label: "하이라이트",
  icon: "sparkles",
  desc: "공지 · 준비물 · 회비"
}, {
  k: "timetable",
  label: "타임테이블",
  icon: "calendar-clock",
  desc: "3일 · 9개 항목"
}, {
  k: "place",
  label: "장소",
  icon: "map-pin",
  desc: "4곳 등록됨"
}];
function Editor({
  onShare,
  onToast
}) {
  const [sel, setSel] = React.useState("basic");
  const [title, setTitle] = React.useState("제주 워크샵 2026");
  const [drag, setDrag] = React.useState(null);
  const [blocks, setBlocks] = React.useState(BLOCKS);
  const reorder = (from, to) => {
    const b = [...blocks];
    const [m] = b.splice(from, 1);
    b.splice(to, 0, m);
    setBlocks(b);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 60,
      flex: "0 0 auto",
      borderBottom: "1px solid var(--border-secondary)",
      background: "var(--surface-card)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 16px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, "\uC77C\uC815 \uD3B8\uC9D1"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      font: "500 12px/1 var(--font-sans)",
      color: "var(--text-success)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " \uC790\uB3D9 \uC800\uC7A5\uB428"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "m",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 17
    }),
    onClick: () => onToast("미리보기를 열었어요")
  }, "\uBBF8\uB9AC\uBCF4\uAE30"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "m",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "link",
      size: 17
    }),
    onClick: onShare
  }, "\uACF5\uC720 \uB9C1\uD06C \uBC1C\uD589"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: 24,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 12px/1 var(--font-sans)",
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)",
      marginBottom: 12
    }
  }, "\uCEF4\uD3EC\uB10C\uD2B8 \xB7 \uB4DC\uB798\uADF8\uB85C \uC21C\uC11C \uBCC0\uACBD"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, blocks.map((b, i) => {
    const on = sel === b.k;
    return /*#__PURE__*/React.createElement("div", {
      key: b.k,
      draggable: true,
      onClick: () => setSel(b.k),
      onDragStart: () => setDrag(i),
      onDragOver: e => {
        e.preventDefault();
      },
      onDrop: () => {
        if (drag !== null && drag !== i) reorder(drag, i);
        setDrag(null);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 14px",
        background: "var(--surface-card)",
        border: `1.5px solid ${on ? "var(--border-primary)" : "var(--border-secondary)"}`,
        borderRadius: "var(--radius-l)",
        cursor: "grab",
        opacity: drag === i ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--grey-400)",
        cursor: "grab"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "grip-vertical",
      size: 18
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "grid",
        placeItems: "center",
        width: 30,
        height: 38,
        color: on ? "var(--text-brand)" : "var(--text-secondary)",
        flex: "0 0 auto"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: b.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "600 15px/1.3 var(--font-sans)",
        color: "var(--text-primary)"
      }
    }, b.label), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "400 12px/1.3 var(--font-sans)",
        color: "var(--text-tertiary)"
      }
    }, b.desc)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--grey-400)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18
    })));
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: "12px",
      border: "1.5px dashed var(--border-strong)",
      borderRadius: "var(--radius-l)",
      background: "transparent",
      color: "var(--text-secondary)",
      font: "600 14px/1 var(--font-sans)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 17
  }), " \uCEF4\uD3EC\uB10C\uD2B8 \uCD94\uAC00"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 320,
      flex: "0 0 auto",
      borderLeft: "1px solid var(--border-secondary)",
      background: "var(--surface-card)",
      padding: 24,
      overflowY: "auto"
    }
  }, sel === "basic" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 15px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, "\uAE30\uBCF8 \uC815\uBCF4"), /*#__PURE__*/React.createElement(TextField, {
    label: "\uC81C\uBAA9",
    value: title,
    onChange: e => setTitle(e.target.value)
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "\uAE30\uAC04",
    value: "2026.10.24 \u2013 10.26",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "\uC124\uBA85",
    multiline: true,
    rows: 3,
    value: "\uB514\uC790\uC778\uD300 2\uBC15 3\uC77C \uC81C\uC8FC \uC6CC\uD06C\uC0F5\uC774\uC5D0\uC694.",
    onChange: () => {},
    helper: "\uCC38\uAC00\uC790 \uBDF0\uC5B4 \uC0C1\uB2E8\uC5D0 \uBCF4\uC5EC\uC694."
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 13px/1 var(--font-sans)",
      color: "var(--text-secondary)",
      marginBottom: 8
    }
  }, "\uCEE4\uBC84"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 84,
      borderRadius: "var(--radius-l)",
      background: "linear-gradient(150deg,var(--blue-600),var(--blue-400))"
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 15px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, BLOCKS.find(b => b.k === sel).label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px/1.6 var(--font-sans)",
      color: "var(--text-tertiary)"
    }
  }, "\uC774 \uCEF4\uD3EC\uB10C\uD2B8\uC758 \uD56D\uBAA9\uC744 \uCD94\uAC00\xB7\uC218\uC815\uD558\uACE0 \uC21C\uC11C\uB97C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--border-secondary)"
    }
  }), [1, 2, 3].map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      background: "var(--fill-secondary)",
      borderRadius: "var(--radius-m)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grip-vertical",
    size: 16,
    color: "var(--grey-400)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "500 13px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, "\uD56D\uBAA9 ", n))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "m",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    })
  }, "\uD56D\uBAA9 \uCD94\uAC00")))));
}

// ---- Share manager -----------------------------------------------
function ShareManager({
  onToast
}) {
  const [active, setActive] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 32px",
      overflowY: "auto",
      flex: 1,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: "700 26px/1.2 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, "\uACF5\uC720 \xB7 \uD1B5\uACC4"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 24px",
      font: "400 14px/1.4 var(--font-sans)",
      color: "var(--text-tertiary)"
    }
  }, "\uC81C\uC8FC \uC6CC\uD06C\uC0F5 2026"), /*#__PURE__*/React.createElement(Card, {
    padding: 20,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: active ? "var(--text-brand)" : "var(--text-tertiary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 15px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, "\uACF5\uC720 \uB9C1\uD06C"), /*#__PURE__*/React.createElement(Badge, {
    tone: active ? "success" : "neutral",
    dot: active
  }, active ? "활성화" : "비활성화")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "500 13px/1 var(--font-sans)",
      color: "var(--text-secondary)"
    }
  }, "\uB9C1\uD06C \uD65C\uC131\uD654"), /*#__PURE__*/React.createElement(Switch, {
    checked: active,
    onChange: setActive
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      height: 48,
      background: "var(--fill-secondary)",
      border: "1px solid var(--border-secondary)",
      borderRadius: "var(--radius-m)",
      font: "500 14px/1 var(--font-mono,monospace)",
      color: active ? "var(--text-primary)" : "var(--text-placeholder)",
      overflow: "hidden"
    }
  }, "planit.app/s/", active ? "j3k9x2" : "———"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "l",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 18
    }),
    disabled: !active,
    onClick: () => onToast("링크를 복사했어요")
  }, "\uBCF5\uC0AC"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "l",
    disabled: !active,
    onClick: () => onToast("공유 시트를 열었어요")
  }, "\uACF5\uC720")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
      paddingTop: 16,
      borderTop: "1px solid var(--border-secondary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px/1.5 var(--font-sans)",
      color: "var(--text-tertiary)",
      maxWidth: 380
    }
  }, "\uC0C8 \uB9C1\uD06C\uB97C \uBC1C\uAE09\uD558\uBA74 \uAE30\uC874 \uB9C1\uD06C\uB294 \uBB34\uD6A8\uD654\uB3FC\uC694. \uC774\uBBF8 \uACF5\uC720\uD55C \uCC38\uAC00\uC790\uB294 \uC5F4 \uC218 \uC5C6\uAC8C \uB3FC\uC694."), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "m",
    onClick: () => onToast("새 링크를 발급했어요")
  }, "\uC0C8 \uB9C1\uD06C \uBC1C\uAE09"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16
    }
  }, [{
    n: "1,280",
    l: "총 조회수",
    i: "eye"
  }, {
    n: "384",
    l: "주소 복사",
    i: "copy"
  }, {
    n: "512",
    l: "지도 열기",
    i: "map"
  }].map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.l,
    padding: 18
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-tertiary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.i,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      font: "700 28px/1.1 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)",
      marginTop: 10
    }
  }, m.n), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px/1 var(--font-sans)",
      color: "var(--text-tertiary)",
      marginTop: 4
    }
  }, m.l)))));
}
Object.assign(window, {
  PlanitPlanner: {
    Sidebar,
    Dashboard,
    Editor,
    ShareManager
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/planner/PlannerScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/viewer/ViewerScreens.jsx
try { (() => {
// Planit — Viewer UI kit (mobile-first, login-free). Screens export to window.
// Uses design-system primitives from window.PlanitDesignSystem_e6392f.
const {
  TopBar,
  BottomCTA,
  Button,
  Chip,
  Badge,
  Card,
  SegmentedControl,
  Toast,
  BottomSheet,
  ListRow,
  Avatar,
  Icon
} = window.PlanitDesignSystem_e6392f;
const PLACES = {
  p1: {
    name: "제주국제공항",
    addr: "제주특별자치도 제주시 공항로 2",
    tag: "집결",
    transit: "공항버스 600번 · 셔틀 대기"
  },
  p2: {
    name: "성산일출봉",
    addr: "제주특별자치도 서귀포시 성산읍 성산리 1",
    tag: "관광",
    transit: "성산일출봉 정류장 도보 5분"
  },
  p3: {
    name: "위미 게스트하우스",
    addr: "제주특별자치도 서귀포시 남원읍 위미리 123",
    tag: "숙소",
    transit: "체크인 15:00 · 주차 가능"
  },
  p4: {
    name: "흑돼지 명가",
    addr: "제주특별자치도 서귀포시 중앙로 45",
    tag: "식사",
    transit: "도보 8분 · 예약 완료"
  }
};
const DAYS = [{
  key: "day1",
  label: "1일차",
  date: "10.24 목",
  items: [{
    time: "10:30",
    title: "제주공항 집결",
    place: "p1",
    now: true
  }, {
    time: "12:00",
    title: "점심 · 흑돼지",
    place: "p4"
  }, {
    time: "14:30",
    title: "성산일출봉 트레킹",
    place: "p2"
  }, {
    time: "18:00",
    title: "게스트하우스 체크인",
    place: "p3"
  }]
}, {
  key: "day2",
  label: "2일차",
  date: "10.25 금",
  items: [{
    time: "09:00",
    title: "조식 & 자유시간",
    place: "p3"
  }, {
    time: "11:00",
    title: "해안 드라이브",
    place: "p2"
  }, {
    time: "13:00",
    title: "점심 · 자율",
    place: "p4"
  }]
}, {
  key: "day3",
  label: "3일차",
  date: "10.26 토",
  items: [{
    time: "10:00",
    title: "체크아웃 & 기념품",
    place: "p3"
  }, {
    time: "13:30",
    title: "공항 이동 · 해산",
    place: "p1"
  }]
}];
const HIGHLIGHTS = [{
  icon: "backpack",
  title: "준비물",
  body: "편한 신발, 얇은 패딩(밤 쌀쌀해요), 상비약, 보조배터리"
}, {
  icon: "circle-alert",
  title: "공지",
  body: "집결 시간 10:30 꼭 지켜주세요. 늦으면 셔틀이 먼저 출발해요."
}, {
  icon: "wallet",
  title: "회비",
  body: "1인 12만원 · 도착 후 총무에게 현장 정산해요."
}];

// ---- Cover -------------------------------------------------------
function Cover() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "24px 24px 22px",
      background: "linear-gradient(155deg, var(--blue-600), var(--blue-500) 55%, var(--blue-400))",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      opacity: .9,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-white.png",
    style: {
      width: 20,
      height: 20,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 13px/1 var(--font-sans)"
    }
  }, "\uD50C\uB79C\uC787\uC73C\uB85C \uACF5\uC720\uB41C \uC77C\uC815")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    style: {
      background: "rgba(255,255,255,.22)",
      color: "#fff"
    }
  }, "\uC5EC\uD589"), /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    style: {
      background: "rgba(255,255,255,.22)",
      color: "#fff"
    }
  }, "2\uBC15 3\uC77C")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 27px/1.3 var(--font-sans)",
      letterSpacing: "-0.02em"
    }
  }, "\uC81C\uC8FC \uC6CC\uD06C\uC0F5 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 14px/1.5 var(--font-sans)",
      opacity: .92,
      marginTop: 6
    }
  }, "10.24 \uBAA9 \u2013 10.26 \uD1A0 \xB7 \uB514\uC790\uC778\uD300 12\uBA85"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: 16,
      font: "500 12px/1 var(--font-sans)",
      opacity: .9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "eye",
    size: 15,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tnum"
  }, "\uC870\uD68C 1,280"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .6
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\uCD1D\uBB34 \uAE40\uD50C\uB79C")));
}

// ---- Timetable ---------------------------------------------------
function Timetable({
  onPlace
}) {
  const [day, setDay] = React.useState("day1");
  const d = DAYS.find(x => x.key === day);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 0 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 24px 14px"
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: DAYS.map(x => ({
      value: x.key,
      label: x.label
    })),
    value: day,
    onChange: setDay
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "700 15px/1 var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, d.date), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "500 13px/1 var(--font-sans)",
      color: "var(--text-tertiary)"
    }
  }, "\xB7 ", d.items.length, "\uAC1C \uC77C\uC815")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 47,
      top: 8,
      bottom: 8,
      width: 2,
      background: "var(--grey-200)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, d.items.map((it, i) => {
    const pl = PLACES[it.place];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => onPlace(it.place),
      style: {
        position: "relative",
        display: "flex",
        gap: 14,
        padding: "10px 12px",
        borderRadius: "var(--radius-l)",
        cursor: "pointer",
        background: it.now ? "var(--now-fill)" : "transparent"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 42,
        textAlign: "right",
        flex: "0 0 auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tnum",
      style: {
        font: `${it.now ? 700 : 600} 14px/1.3 var(--font-sans)`,
        color: it.now ? "var(--text-brand)" : "var(--text-primary)"
      }
    }, it.time)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: "0 0 auto",
        zIndex: 1,
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: it.now ? "var(--blue-500)" : "#fff",
        border: `2px solid ${it.now ? "var(--blue-500)" : "var(--grey-300)"}`,
        boxShadow: it.now ? "0 0 0 4px var(--blue-100)" : "none"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "600 15px/1.3 var(--font-sans)",
        color: "var(--text-primary)"
      }
    }, it.title), it.now && /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "\uC9C0\uAE08")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
        color: "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "500 13px/1.3 var(--font-sans)"
      }
    }, pl.name))), /*#__PURE__*/React.createElement("span", {
      style: {
        alignSelf: "center",
        color: "var(--grey-400)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18
    })));
  })))));
}

// ---- Highlights --------------------------------------------------
function Highlights() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, HIGHLIGHTS.map((h, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    padding: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 28,
      color: "var(--text-brand)",
      flex: "0 0 auto",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: h.icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 15px/1.3 var(--font-sans)",
      color: "var(--text-primary)",
      marginBottom: 4
    }
  }, h.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/1.55 var(--font-sans)",
      color: "var(--text-secondary)"
    }
  }, h.body))))));
}

// ---- Places ------------------------------------------------------
function Places({
  onPlace
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, Object.entries(PLACES).map(([k, p], i) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--border-secondary)",
      marginLeft: 24
    }
  }), /*#__PURE__*/React.createElement(ListRow, {
    left: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "grid",
        placeItems: "center",
        width: 32,
        height: 44,
        color: "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 22
    })),
    title: p.name,
    subtitle: p.addr,
    right: /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, p.tag),
    chevron: true,
    onClick: () => onPlace(k)
  }))));
}

// ---- Place detail sheet (map actions) ----------------------------
function PlaceSheet({
  placeKey,
  onClose,
  onToast
}) {
  const p = PLACES[placeKey];
  if (!p) return null;
  return /*#__PURE__*/React.createElement(BottomSheet, {
    open: !!placeKey,
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, p.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 20px/1.3 var(--font-sans)",
      letterSpacing: "-0.015em",
      color: "var(--text-primary)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px/1.5 var(--font-sans)",
      color: "var(--text-secondary)",
      marginTop: 4
    }
  }, p.addr))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 128,
      borderRadius: "var(--radius-l)",
      overflow: "hidden",
      position: "relative",
      background: "repeating-linear-gradient(45deg, var(--grey-100), var(--grey-100) 12px, var(--grey-150) 12px, var(--grey-150) 24px)",
      border: "1px solid var(--border-secondary)",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-100%)",
      color: "var(--blue-500)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 34,
    strokeWidth: 2.2
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 8,
      right: 10,
      font: "500 10px/1 var(--font-sans)",
      color: "var(--text-tertiary)"
    }
  }, "\uC9C0\uB3C4 \uC784\uBCA0\uB4DC")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      padding: "10px 12px",
      background: "var(--fill-secondary)",
      borderRadius: "var(--radius-m)",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bus",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 13px/1.5 var(--font-sans)",
      color: "var(--text-secondary)"
    }
  }, p.transit)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "l",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 18
    }),
    onClick: () => {
      onToast("주소를 복사했어요");
    }
  }, "\uC8FC\uC18C \uBCF5\uC0AC"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "l",
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "navigation",
      size: 18
    }),
    onClick: () => onToast("네이버 지도를 열었어요")
  }, "\uB124\uC774\uBC84 \uC9C0\uB3C4")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "l",
    block: true,
    leadingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "map",
      size: 18
    }),
    onClick: () => onToast("카카오맵을 열었어요")
  }, "\uCE74\uCE74\uC624\uB9F5\uC73C\uB85C \uAE38\uCC3E\uAE30"));
}

// ---- Status / error screen ---------------------------------------
function StatusScreen({
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 560,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 32,
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 72,
      height: 72,
      borderRadius: "var(--radius-3xl)",
      background: "var(--fill-secondary)",
      color: "var(--grey-400)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link-2-off",
    size: 34
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 20px/1.3 var(--font-sans)",
      color: "var(--text-primary)",
      marginBottom: 8
    }
  }, "\uC77C\uC815\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 15px/1.55 var(--font-sans)",
      color: "var(--text-secondary)",
      maxWidth: 260
    }
  }, "\uB9C1\uD06C\uAC00 \uB9CC\uB8CC\uB410\uAC70\uB098 \uBE44\uACF5\uAC1C\uB85C \uBC14\uB010 \uAC83 \uAC19\uC544\uC694. \uACF5\uC720\uD574\uC900 \uBD84\uC5D0\uAC8C \uC0C8 \uB9C1\uD06C\uB97C \uBC1B\uC544\uBCF4\uC138\uC694.")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "l",
    onClick: onBack
  }, "\uD648\uC73C\uB85C"));
}
Object.assign(window, {
  PlanitViewer: {
    Cover,
    Timetable,
    Highlights,
    Places,
    PlaceSheet,
    StatusScreen,
    DAYS,
    PLACES
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/viewer/ViewerScreens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Loader = __ds_scope.Loader;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.BottomCTA = __ds_scope.BottomCTA;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.TopBar = __ds_scope.TopBar;

})();
