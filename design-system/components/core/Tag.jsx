import React from 'react';

const TAG_VARIANTS = {
  outline: { background: 'transparent', color: 'var(--text)', border: 'var(--border-hairline)' },
  soft: { background: 'var(--accent-soft)', color: 'var(--accent-strong)', border: '1px solid transparent' },
  solid: { background: 'var(--accent-fill)', color: '#fff', border: '1px solid transparent' },
  neutral: { background: 'var(--gray-100)', color: 'var(--gray-700)', border: '1px solid transparent' },
};

/** Pill-shaped tag / chip. Uppercase micro-label, optional leading icon. */
export function Tag({ children, variant = 'outline', icon, style = {}, ...rest }) {
  const v = TAG_VARIANTS[variant] || TAG_VARIANTS.outline;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)',
        fontSize: 'var(--fs-caption)', letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap',
        padding: '7px 12px', borderRadius: 'var(--radius-pill)', ...v, ...style,
      }}
      {...rest}
    >
      {icon && <i className={`ti ti-${icon}`} style={{ fontSize: '14px' }} />}
      {children}
    </span>
  );
}
