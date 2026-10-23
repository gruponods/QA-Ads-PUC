import * as React from 'react';

export interface ProgressRingProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** null/undefined → empty dashed ring (future / no data). */
  value?: number | null;
  /** Default 100. Values above max draw a full ring. */
  max?: number;
  /** Diameter in px. Default 36. */
  size?: number;
  /** Ring thickness. Default 3. */
  stroke?: number;
  /** accent (default) · ok · warn · risk · neutral. */
  tone?: 'accent' | 'ok' | 'warn' | 'risk' | 'neutral';
  /** Print the value inside. Default true. */
  showValue?: boolean;
  /** Default rounds + "%". */
  format?: (v: number) => string;
  title?: string;
}

/** Small circular progress with the value inside — per-period execution, completion. */
export function ProgressRing(props: ProgressRingProps): JSX.Element;
