import React from 'react';

/**
 * Category chip: muted categorical color (1–6) to tell categories apart at a glance.
 * soft = tinted pill · outline = hairline pill with a color dot (quieter, closer to the blue-only rule).
 */
export function CategoryChip({ children, tone = 1, variant = 'soft', icon, count, selected, onClick, style = {}, ...rest }) {
  const t = Math.min(6, Math.max(1, Number(tone) || 1));
  const fg = `var(--cat-${t})`; const soft = `var(--cat-${t}-soft)`;
  const interactive = typeof onClick === 'function';
  const outline = variant === 'outline';
  const on = selected !== false;
  const Comp = interactive ? 'button' : 'span';
  return (
    <Comp
      type={interactive ? 'button' : undefined} onClick={onClick} aria-pressed={interactive ? !!selected : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 'var(--fw-medium)', lineHeight: 1, whiteSpace: 'nowrap',
        padding: '6px 11px', borderRadius: 'var(--radius-pill)', cursor: interactive ? 'pointer' : 'default', transition: 'background .15s ease, border-color .15s ease, opacity .15s ease',
        background: outline ? 'var(--surface)' : soft, color: outline ? 'var(--text)' : fg,
        border: '1px solid', borderColor: outline ? (interactive && selected ? fg : 'var(--border-hairline-color)') : (interactive && selected ? fg : 'transparent'),
        opacity: interactive && !on ? 0.55 : 1, ...style,
      }}
      {...rest}
    >
      {icon ? <i className={`ti ti-${icon}`} style={{ fontSize: '15px', color: fg }} /> : outline && <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: fg, flex: '0 0 8px' }} />}
      {children}
      {count !== undefined && <span style={{ fontSize: '12px', fontWeight: 'var(--fw-medium)', color: outline ? 'var(--text-muted)' : fg, opacity: 0.8 }}>{count}</span>}
    </Comp>
  );
}
