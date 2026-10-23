import * as React from 'react';

export interface VersusSide {
  label: string;
  /** Tabler icon, e.g. "brand-instagram". */
  icon?: string;
}

export interface VersusMetric {
  key?: string;
  label: string;
  /** Small line under the label, e.g. "por lead". */
  hint?: string;
  left: number;
  right: number;
  format?: (v: number) => string;
  /** Lower wins (costs). */
  lower?: boolean;
  /** No winner highlight (e.g. investment). */
  neutral?: boolean;
}

export interface VersusTableProps extends React.HTMLAttributes<HTMLDivElement> {
  left: VersusSide;
  right: VersusSide;
  metrics: VersusMetric[];
  /** Bars grow on mount. Default true. */
  animate?: boolean;
  /** Center label column width in px. Default 170. */
  labelWidth?: number;
  /** Left series color. Default --chart-1 (blue). */
  leftColor?: string;
  /** Right series color. Default --chart-2 (coral). */
  rightColor?: string;
  /** Optional pattern on the right bars (print / color-blind). */
  rightPattern?: 'diagonal' | 'dots' | 'cross' | 'horizontal';
}

/** Head-to-head KPI comparison with butterfly bars (solid vs pattern), winner bold + advantage %. */
export function VersusTable(props: VersusTableProps): JSX.Element;
