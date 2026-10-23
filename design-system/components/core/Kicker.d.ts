import * as React from 'react';

export interface KickerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Show the short blue accent tick before the label. Default true. */
  accent?: boolean;
  /** Override label color. Default var(--text-muted). Use #fff on dark dividers. */
  color?: string;
  /** Rendered element. Default "span". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Eyebrow / kicker: 13px Medium, uppercase, wide tracking. Sits above titles on
 * covers, section dividers and slide headers.
 */
export function Kicker(props: KickerProps): JSX.Element;
