import * as React from "react";

/**
 * The standard Planit list unit — whole row is the hit area. Used for schedule lists,
 * timetable items, place lists, settings, admin tables.
 * @startingPoint section="Display" subtitle="Avatar + title/subtitle + right slot row" viewport="700x160"
 */
export interface ListRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Leading slot — Avatar, Icon, or thumbnail. */
  left?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Trailing slot — value, time, badge (right-aligned). */
  right?: React.ReactNode;
  /** Show a trailing chevron. */
  chevron?: boolean;
  onClick?: () => void;
}
export function ListRow(props: ListRowProps): JSX.Element;
