import * as React from 'react';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: React.ReactNode;
  /** primary = blue fill · secondary = hairline outline · ghost = bare. Default primary. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Default "md". */
  size?: 'sm' | 'md' | 'lg';
  /** Tabler icon name before the label. */
  icon?: string;
  /** Tabler icon name after the label (e.g. "arrow-right"). */
  iconRight?: string;
  /** Render as an anchor when set. */
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/** Fully-rounded (pill) button. No shadow — flat, with a color/border hover shift. */
export function Button(props: ButtonProps): JSX.Element;
