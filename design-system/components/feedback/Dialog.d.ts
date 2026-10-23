import * as React from 'react';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default true. */
  open?: boolean;
  /** Called on scrim click, × button and Esc. */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Right-aligned action row (e.g. ghost Cancel + primary Confirm). */
  footer?: React.ReactNode;
  /** Panel width in px. Default 520. */
  width?: number;
  /** Render the panel in-flow without the scrim (for previews/docs). */
  inline?: boolean;
}

/** Modal: flat rgba(10,10,10,.4) scrim, white 16px panel with hairline border, no shadow. */
export function Dialog(props: DialogProps): JSX.Element | null;
