import * as React from "react";

/**
 * Planit primary action button. Reads like a sentence; one primary per screen.
 * @startingPoint section="Forms" subtitle="Primary/secondary/danger/ghost, XL–S" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. `primary` (blue) is reserved for the single most important action per screen. */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Size scales height, radius and label weight together. */
  size?: "xl" | "l" | "m" | "s";
  /** Stretch to container width. */
  block?: boolean;
  disabled?: boolean;
  /** Replace label with a 3-dot pulse (never a spinner/shimmer). */
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
