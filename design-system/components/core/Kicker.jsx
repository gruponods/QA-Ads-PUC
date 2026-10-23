import React from 'react';

/** Uppercase, wide-tracked eyebrow label with an optional leading accent tick. */
export function Kicker({ children, accent = true, color, as = 'span', style = {}, ...rest }) {
  const Comp = as;
  return (
    <Comp
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)',
        fontSize: 'var(--fs-kicker)', letterSpacing: 'var(--tracking-kicker)',
        textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap',
        color: color || 'var(--text-muted)', ...style,
      }}
      {...rest}
    >
      {accent && <span style={{ width: '24px', height: '2px', background: 'var(--accent)', borderRadius: '2px', flex: '0 0 auto' }} />}
      {children}
    </Comp>
  );
}
