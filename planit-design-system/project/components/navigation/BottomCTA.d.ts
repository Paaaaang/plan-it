import * as React from "react";

/**
 * Fixed bottom action zone (56pt) with white→transparent protection gradient + safe-area padding.
 * The screen-level primary action. Never pair with a primary Button on the same screen.
 * @startingPoint section="Navigation" subtitle="Sticky bottom CTA with protection gradient" viewport="390x160"
 */
export interface BottomCTAProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Optional pill of context above the button (e.g. "수수료 없이 공유해요"). */
  info?: React.ReactNode;
  sticky?: boolean;
}
export function BottomCTA(props: BottomCTAProps): JSX.Element;
