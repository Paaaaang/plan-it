import * as React from "react";

/** 22px checkbox — hairline unchecked, blue fill + white check when on. */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
