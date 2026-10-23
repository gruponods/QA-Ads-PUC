import * as React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** "rule" = hairline gray line · "accent" = short blue brand bar. Default "rule". */
  variant?: 'rule' | 'accent';
  /** Length along the main axis (CSS length). */
  length?: string;
  /** Thickness (CSS length). accent default 3px; rule is always 1px. */
  thickness?: string;
  /** Orient vertically. Default false. */
  vertical?: boolean;
}

/** Hairline rule or short blue accent bar. The only two separators in the system. */
export function Divider(props: DividerProps): JSX.Element;
