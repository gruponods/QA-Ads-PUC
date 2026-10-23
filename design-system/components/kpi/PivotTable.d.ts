import * as React from 'react';

export interface PivotGroup {
  key: string;
  /** Group header, e.g. "S35". */
  label: React.ReactNode;
  /** Secondary line, e.g. "24–30 ago · 2026". */
  sub?: React.ReactNode;
  /** Blue header (current period). */
  highlight?: boolean;
}

export interface PivotMeasure {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Cell renderer (conditional formatting goes here). */
  render?: (value: any, row: PivotRow, group: PivotGroup) => React.ReactNode;
  /** Plain formatter for the total row. */
  format?: (value: any) => React.ReactNode;
  /** Custom renderer for the total row. */
  renderTotal?: (value: any) => React.ReactNode;
}

export interface PivotRow {
  id?: string;
  label: React.ReactNode;
  cells: Record<string, Record<string, any>>;
}

export interface PivotTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header of the sticky first column. */
  rowLabel?: React.ReactNode;
  rows: PivotRow[];
  groups: PivotGroup[];
  measures: PivotMeasure[];
  /** Bold footer row. */
  total?: { label?: React.ReactNode; cells: Record<string, Record<string, any>> };
  /** striped (default) · lines. */
  variant?: 'striped' | 'lines';
  /** Preferred width of the first column in px (labels wrap; shrinks to 220 on narrow screens). Default 320. */
  firstColWidth?: number;
}

/** Entity × period pivot (e.g. program × ISO week with CPL and Leads): sticky first column, zebra, total row. */
export function PivotTable(props: PivotTableProps): JSX.Element;
