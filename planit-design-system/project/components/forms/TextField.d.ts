import * as React from "react";

/** Planit text input — grey-100 resting, white + 1.5px blue on focus, red error state. */
export interface TextFieldProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  /** Neutral helper text below the field. */
  helper?: string;
  /** Error message — flips border to 1.5px red and colors the helper. */
  error?: string;
  disabled?: boolean;
  type?: string;
  leadingIcon?: React.ReactNode;
  /** Slot at the trailing edge (e.g. a clear button or unit). */
  trailingSlot?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

export function TextField(props: TextFieldProps): JSX.Element;
