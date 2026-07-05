import * as React from "react";

/** 56pt top app bar — back/leading slot, title, trailing action slot. */
export interface TopBarProps {
  title?: React.ReactNode;
  onBack?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  centered?: boolean;
  border?: boolean;
}
export function TopBar(props: TopBarProps): JSX.Element;
