import * as React from "react";

/** Avatar — rounded-square (radius 14) or circle; image or initial on a tint. */
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
  shape?: "rounded" | "circle";
  tone?: "brand" | "neutral";
}
export function Avatar(props: AvatarProps): JSX.Element;
