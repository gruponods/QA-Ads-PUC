import React from 'react';

/** Tabler outline icon. Single icon system for the whole brand. */
export function Icon({ name, size = 24, color = 'currentColor', className = '', style = {}, title, ...rest }) {
  return (
    <i
      className={`ti ti-${name} ${className}`.trim()}
      role="img"
      aria-label={title || undefined}
      aria-hidden={title ? undefined : 'true'}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size, color, lineHeight: 1, display: 'inline-flex', ...style }}
      {...rest}
    />
  );
}
