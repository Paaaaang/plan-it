import * as React from "react";

/** Lucide icon wrapper — outline set, inherits currentColor. Needs window.lucide on the page. */
export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "map-pin", "share-2", "calendar"). */
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}
export function Icon(props: IconProps): JSX.Element;
