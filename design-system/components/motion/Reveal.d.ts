import * as React from 'react';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Stagger position — adds index × 70ms delay. Default 0. */
  index?: number;
  /** Extra delay in ms. Default 0. */
  delay?: number;
  /** Rise distance in px. Default 12. */
  y?: number;
  /** Duration in ms. Default 420. */
  duration?: number;
  /** Animate only the first time it enters the viewport. Default true. */
  once?: boolean;
  /** Rendered element. Default "div". */
  as?: keyof JSX.IntrinsicElements;
}

/** Fade + short rise on entering the viewport; stagger with index. No bounce. Respects reduced motion. */
export function Reveal(props: RevealProps): JSX.Element;
