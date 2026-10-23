import * as React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Optional Tabler icon name. */
  icon?: string;
  /** Optional count pill (underline variant). */
  count?: number;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  /** Controlled active id. Omit to use defaultValue. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** underline (page sections) · segmented (pill filter/range toggle). Default underline. */
  variant?: 'underline' | 'segmented';
}

/** Tabs — blue 2px underline indicator, or a gray pill segmented control. */
export function Tabs(props: TabsProps): JSX.Element;
