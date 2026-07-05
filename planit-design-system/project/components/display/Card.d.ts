import * as React from "react";

/** Flat white surface with hairline border + rounding. Resting is flat; shadow means floating. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: number;
  radius?: string;
  /** Adds hover lift (shadow-2 + −2px). */
  interactive?: boolean;
  /** Drop the border and use shadow-2 instead (for raised/menu-like cards). */
  elevated?: boolean;
  children?: React.ReactNode;
}
export function Card(props: CardProps): JSX.Element;
