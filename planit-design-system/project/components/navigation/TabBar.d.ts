import * as React from "react";

interface TabItem { value: string; label: string; icon: string; }

/** Floating mobile bottom nav — 2–5 items, active item shows blue label. Needs window.lucide. */
export interface TabBarProps {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
}
export function TabBar(props: TabBarProps): JSX.Element;
