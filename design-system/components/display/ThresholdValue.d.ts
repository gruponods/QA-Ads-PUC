import * as React from 'react';

export interface ThresholdValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Below this (or above, if higherIsBetter=false) → amber. */
  warn?: number;
  /** Below this (or above) → red. */
  bad?: number;
  /** At/above this (or at/below) → green. Omit to keep good values neutral ink (recommended). */
  good?: number;
  /** Default true. Set false for metrics like "pending tasks". */
  higherIsBetter?: boolean;
  format?: (v: number) => string;
  /** Appended to the value, e.g. "%". */
  suffix?: string;
  /** text (default) · pill (soft tinted background). */
  variant?: 'text' | 'pill';
  /** Show the state icon. Default true. */
  icon?: boolean;
}

/** Conditional-format number for table cells — muted state colors + icon, never color alone. */
export function ThresholdValue(props: ThresholdValueProps): JSX.Element;
