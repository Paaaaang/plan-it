import * as React from "react";

/** Grey-900 toast with white label; success/danger show a status circle. */
export interface ToastProps {
  children?: React.ReactNode;
  tone?: "default" | "success" | "danger";
  /** Fix to bottom-center of the viewport. */
  floating?: boolean;
}
export function Toast(props: ToastProps): JSX.Element;
