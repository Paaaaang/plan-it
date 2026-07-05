import * as React from "react";

/** Search input — 48px with a leading search glyph and optional clear button. */
export interface SearchFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Shows a clear (×) button when value is non-empty. */
  onClear?: () => void;
}

export function SearchField(props: SearchFieldProps): JSX.Element;
