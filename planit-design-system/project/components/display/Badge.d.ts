import * as React from "react";

/** 22px badge with washed semantic background — status labels, denser than Chip. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "neutral" | "brand" | "success" | "danger" | "warning" | "info";
  /** Leading status dot. */
  dot?: boolean;
}
export function Badge(props: BadgeProps): JSX.Element;
