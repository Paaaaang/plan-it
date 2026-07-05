import * as React from "react";

/** 44×26 toggle switch — grey track off, blue track on. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}
export function Switch(props: SwitchProps): JSX.Element;
