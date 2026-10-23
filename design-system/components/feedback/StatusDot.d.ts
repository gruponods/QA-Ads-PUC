import * as React from 'react';

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** ok = muted green · warn = muted amber · risk = muted red · neutral = gray · accent = blue. Default ok. */
  tone?: 'ok' | 'warn' | 'risk' | 'neutral' | 'accent';
  children?: React.ReactNode;
}

/** 8px colored dot + ink label — the app's status pattern (no filled color badges). */
export function StatusDot(props: StatusDotProps): JSX.Element;
