import * as React from 'react';

export interface DataBarProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Default 100. */
  max?: number;
  /** Appended to the value label, e.g. "%". */
  unit?: string;
  /** Threshold → amber bar + bold amber value. */
  warn?: number;
  /** Threshold → red bar + bold red value. */
  bad?: number;
  /** Default true. */
  higherIsBetter?: boolean;
  /** Bar width (px number or CSS length). Default 120. */
  width?: number | string;
}

/** In-cell data bar (conditional formatting): blue, switching to muted amber/red past thresholds. */
export function DataBar(props: DataBarProps): JSX.Element;
