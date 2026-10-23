import * as React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** info = blue · success/warning/error = muted data-state colors. Default info. */
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Override the tone's Tabler icon. */
  icon?: string;
  /** Node under the message (e.g. a small Button). */
  action?: React.ReactNode;
  /** Shows a close (×) button when provided. */
  onClose?: () => void;
}

/** Inline message or toast body — white, hairline border; tone shown only by the icon color. */
export function Alert(props: AlertProps): JSX.Element;
