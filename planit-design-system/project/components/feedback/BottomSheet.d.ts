import * as React from "react";

/** Bottom sheet — the primary mobile alternative to Dialog. Grabber, top radius, slide-up. */
export interface BottomSheetProps {
  open?: boolean;
  title?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
}
export function BottomSheet(props: BottomSheetProps): JSX.Element;
