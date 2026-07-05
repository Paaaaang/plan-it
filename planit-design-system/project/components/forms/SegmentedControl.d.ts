import * as React from "react";

type Option = string | { value: string; label: string };

/** Mutually-exclusive segmented control — grey track, selected segment lifts to white. */
export interface SegmentedControlProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  size?: "m" | "s";
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
