import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tabler icon name (no `ti-` prefix). */
  icon: string;
  /** Accessible label + tooltip. Required for icon-only buttons. */
  label: string;
  /** ghost (default) · outline · primary */
  variant?: 'ghost' | 'outline' | 'primary';
  /** sm 32px · md 40px · lg 48px. Default md. */
  size?: 'sm' | 'md' | 'lg';
  /** Show a small blue notification dot. */
  badge?: boolean;
  disabled?: boolean;
}

/** Round icon-only button for app toolbars and topbars. Flat, no shadow. */
export function IconButton(props: IconButtonProps): JSX.Element;
