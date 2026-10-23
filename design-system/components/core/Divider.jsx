import React from 'react';

/** Separator: `rule` = hairline line; `accent` = short blue brand bar. */
export function Divider({ variant = 'rule', length, thickness, vertical = false, style = {}, ...rest }) {
  if (variant === 'accent') {
    return (
      <span
        style={{
          display: 'block', flex: '0 0 auto',
          width: vertical ? (thickness || '3px') : (length || '48px'),
          height: vertical ? (length || '48px') : (thickness || '3px'),
          background: 'var(--accent)', borderRadius: '999px', ...style,
        }}
        {...rest}
      />
    );
  }
  return (
    <hr
      style={{
        border: 'none', margin: 0, alignSelf: 'stretch',
        ...(vertical
          ? { borderLeft: 'var(--border-hairline)', width: 0, height: length || 'auto' }
          : { borderTop: 'var(--border-hairline)', height: 0, width: length || '100%' }),
        ...style,
      }}
      {...rest}
    />
  );
}
