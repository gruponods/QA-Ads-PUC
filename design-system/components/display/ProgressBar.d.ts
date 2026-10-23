import * as React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  /** Default 100. */
  max?: number;
  /** Muted label above the bar (left). */
  label?: React.ReactNode;
  /** Show the percentage above the bar (right). */
  showValue?: boolean;
  /** sm 6px · md 8px. Default md. */
  size?: 'sm' | 'md';
  /** Fill grows on mount (respects reduced motion). Default true. */
  animate?: boolean;
  /** Fill color. Default brand blue. */
  color?: string;
}

/** Linear progress — gray pill track with a blue fill. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
