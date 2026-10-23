import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name — used for initials and tooltip. */
  name?: string;
  /** Photo URL; falls back to initials. */
  src?: string;
  /** Diameter in px. Default 36. */
  size?: number;
}

/** Circular avatar — photo or initials on the soft-blue tint. */
export function Avatar(props: AvatarProps): JSX.Element;
