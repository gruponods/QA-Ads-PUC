import * as React from 'react';

export interface BudgetDatum {
  /** Period label, e.g. "S24". */
  label: string;
  /** Actual value; null/undefined = future period (hatched budget only). */
  real?: number | null;
  budget: number;
  /** Execution % shown in the ring under the bar. */
  exec?: number;
}

export interface BudgetChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BudgetDatum[];
  /** Label of the current period (highlighted in blue). */
  current?: string;
  /** Plot height in px. Default 260. */
  height?: number;
  /** Ring bands [ok max, warn max]. Default [100, 125]. */
  bands?: [number, number];
  /** Min px per period (scrolls horizontally below that). Default 38. */
  colWidth?: number;
  /** Show every Nth period label. Default 2. */
  labelEvery?: number;
  /** Show legend. Default true. */
  legend?: boolean;
  valueFormat?: (v: number) => string;
}

/** Real vs budget bars per period with execution rings; future periods hatched. */
export function BudgetChart(props: BudgetChartProps): JSX.Element;
