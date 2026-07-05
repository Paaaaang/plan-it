import * as React from "react";

/** 34px full-pill chip for multi-filter selection (vs SegmentedControl for single choice). */
export interface ChipProps {
  children?: React.ReactNode;
  /** Selected state (neutral variant flips to grey-900 fill). */
  active?: boolean;
  variant?: "neutral" | "brand";
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
}
export function Chip(props: ChipProps): JSX.Element;
