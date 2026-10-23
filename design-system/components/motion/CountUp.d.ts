import * as React from 'react';

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Starting value on first reveal. Default 0. */
  from?: number;
  /** ms. Default 900. */
  duration?: number;
  /** Decimals for the default es-AR formatter. Default 0. */
  decimals?: number;
  /** Custom formatter (receives the in-between value). */
  format?: (v: number) => string;
}

/** Big numbers count up with ease-out on reveal and tween on change. Tabular numerals. Respects reduced motion. */
export function CountUp(props: CountUpProps): JSX.Element;
