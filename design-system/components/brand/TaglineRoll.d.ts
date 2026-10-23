import * as React from 'react';

export interface TaglineRollProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Words that roll inside the pill. The LAST one is where it lands and lights up. Default ends in "education". */
  words?: string[];
  /** Fixed label before the pill. Default "Technology for". */
  label?: string;
  /** sm (24px pill — topbars) · md (30px — login / hero). Default sm. */
  size?: 'sm' | 'md';
  /** Restart from the first word after `hold` ms. Default true. */
  loop?: boolean;
  /** Delay before the first roll, ms. Default 800. */
  startDelay?: number;
  /** Time the last word stays lit before looping, ms. Default 3600. */
  hold?: number;
}

/** Animated "Technology for ___" brand tagline. Respects prefers-reduced-motion (shows the final word, lit). */
export function TaglineRoll(props: TaglineRollProps): JSX.Element;
