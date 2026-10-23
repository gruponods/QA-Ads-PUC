import * as React from 'react';

export interface FunnelStage {
  label: string;
  value: number;
  /** Tabler icon for the stage. */
  icon?: string;
  /** Extra line in the hover tooltip. */
  note?: string;
}

export interface FunnelChartProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: FunnelStage[];
  /** Override stage colors (cycled). Default: funnel ramp violet → blue → cyan → teal (--funnel-1…6). */
  colors?: string[];
  /** Bar width scale. auto = linear when last/first ≥ 20%, else sqrt (keeps late stages visible). */
  scale?: 'auto' | 'linear' | 'sqrt';
  format?: (v: number) => string;
  /** Default 190. */
  labelWidth?: number;
  /** Default 120. */
  valueWidth?: number;
  /** Default 46. */
  barHeight?: number;
  /** Drop chips between stages (biggest drop highlighted). Default true. */
  showDrops?: boolean;
  /** Bars grow on mount. Default true. */
  animate?: boolean;
}

/** Marketing funnel with drop % between stages and a hover tooltip (volume, % of total, conversion, drop). */
export function FunnelChart(props: FunnelChartProps): JSX.Element;
