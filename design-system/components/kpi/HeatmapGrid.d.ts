import * as React from 'react';

export interface HeatmapAxisItem { key: string; label: string; }

export interface HeatmapGridProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: HeatmapAxisItem[];
  cols: HeatmapAxisItem[];
  /** values[rowKey][colKey] — null/undefined renders a dashed empty cell. */
  values: Record<string, Record<string, number | null | undefined>>;
  /** sequential (default) · diverging (coral below center, gray around, blue above). */
  scale?: 'sequential' | 'diverging';
  /** Sequential ramp: aurora (cyan → blue → violet, default) · blue. */
  palette?: 'aurora' | 'blue';
  /** Diverging midpoint (e.g. 100 for % of target). Default 100. */
  center?: number;
  /** Diverging half-range for full color; default = max distance from center. */
  spread?: number;
  /** Sequential domain overrides. */
  min?: number;
  max?: number;
  /** Print values in cells. Default true. */
  showValues?: boolean;
  format?: (v: number) => string;
  /** Suffix for the default formatter, e.g. "%". */
  unit?: string;
  /** Cell height in px. Default 34. */
  cellHeight?: number;
  /** Row label column width in px. Default 160. */
  rowLabelWidth?: number;
  /** Row + column totals (sum). Default false. */
  totals?: boolean;
  legend?: boolean;
  legendLow?: string;
  legendHigh?: string;
}

/** Heat-map grid: blue sequential or red–gray–blue diverging, readable text per step, row/column hover highlight. */
export function HeatmapGrid(props: HeatmapGridProps): JSX.Element;
