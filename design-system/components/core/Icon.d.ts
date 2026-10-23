import * as React from 'react';

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Tabler icon name without the `ti-` prefix, e.g. "rocket", "chart-bar". */
  name: string;
  /** Pixel size (number) or any CSS length. Default 24. */
  size?: number | string;
  /** Icon color. Default currentColor. Use var(--accent) for brand blue. */
  color?: string;
  /** Accessible label; when omitted the icon is aria-hidden. */
  title?: string;
}

/**
 * The one icon system for NODS: Tabler outline webfont (uniform 2px stroke).
 * Requires the Tabler webfont from tokens/icons.css (shipped via styles.css).
 */
export function Icon(props: IconProps): JSX.Element;
