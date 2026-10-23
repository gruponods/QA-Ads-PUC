import * as React from 'react';

export interface DataTableColumn<T = any> {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  /** CSS width for the column. */
  width?: string | number;
  /** Custom cell renderer; defaults to row[key]. */
  render?: (row: T) => React.ReactNode;
  /** Clicking the header cycles desc → asc → off. */
  sortable?: boolean;
  /** Value used for sorting; defaults to row[key]. */
  sortValue?: (row: T) => number | string;
}

export interface DataTableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Row field used as React key. Default "id". */
  rowKey?: string;
  /** Makes rows clickable with a blue-tint hover. */
  onRowClick?: (row: T) => void;
  /** Row distinction. striped (default) = zebra · lines = hairline rows · separated = each row a rounded card. */
  variant?: 'striped' | 'lines' | 'separated';
  /** Tighter 10px row padding. */
  dense?: boolean;
  /** Flag a row: risk / warn / ok / info → tinted row + leading alert icon column. */
  rowTone?: (row: T) => 'risk' | 'warn' | 'ok' | 'info' | null | undefined;
  /** Initial sort. */
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  /** Message when rows is empty. */
  empty?: React.ReactNode;
}

/** Flat table, rows always clearly distinguished (zebra, lines or separated), with row alerts and sorting. No shadow. */
export function DataTable(props: DataTableProps): JSX.Element;
