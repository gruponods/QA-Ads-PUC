import * as React from 'react';

export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  /** Target / 100% mark. Default 100. */
  max?: number;
  /** Small label above the value, e.g. "vs presupuesto". */
  label?: string;
  /** Value formatter. Default es-AR with 2 decimals + "%". */
  format?: (v: number) => string;
  /** Fill color: accent (default) · ok · warn · risk, or any CSS color. */
  tone?: 'accent' | 'ok' | 'warn' | 'risk' | string;
  minLabel?: string;
  maxLabel?: string;
  /** Caption shown when value > max. Default "+X sobre el objetivo". */
  overflowLabel?: string;
  /** Width in px (scales down to container). Default 300. */
  width?: number;
}

/** Flat semicircle gauge; overflow above max shown as a thin muted-red outer arc + caption. */
export function Gauge(props: GaugeProps): JSX.Element;
