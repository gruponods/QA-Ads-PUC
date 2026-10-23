import * as React from 'react';

export interface HeatCellProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** null/undefined renders an empty gray cell. */
  value?: number | null;
  /** Default 100. */
  max?: number;
  /** Default 0. */
  min?: number;
  /** Tooltip prefix, e.g. "Lun". */
  label?: string;
  /** Cell width in px (height = size − 6). Default 34. */
  size?: number;
  /** Print the number inside. Default true. */
  showValue?: boolean;
}

/** Heat-map cell on the 5-step blue ramp (same tokens as maps), readable text per step, theme-aware. */
export function HeatCell(props: HeatCellProps): JSX.Element;
