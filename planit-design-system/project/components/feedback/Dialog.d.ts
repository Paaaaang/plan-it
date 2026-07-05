import * as React from "react";

/** Centered modal dialog with scrim and stacked CTAs. On mobile, prefer BottomSheet. */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  body?: React.ReactNode;
  primary?: string;
  secondary?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
  illustration?: React.ReactNode;
}
export function Dialog(props: DialogProps): JSX.Element;
