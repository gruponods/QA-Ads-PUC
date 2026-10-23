import React from 'react';

/**
 * Flat rounded card: hairline border, no shadow. Optional icon chip, title and
 * microcopy — the workhorse of card-grid slides.
 */
export function Card({
  icon, iconNode, eyebrow, title, children, footer,
  padding = '28px', interactive = false, align = 'left', style = {}, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: '14px',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align, background: 'var(--surface)',
        border: '1px solid', borderColor: interactive && hover ? 'var(--accent)' : 'var(--border-hairline-color)',
        borderRadius: 'var(--radius-card)', padding,
        transition: 'border-color .15s ease', ...style,
      }}
      {...rest}
    >
      {(icon || iconNode) && (
        <span style={{ width: '46px', height: '46px', flex: '0 0 46px', borderRadius: 'var(--radius-card-sm)', background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {iconNode || <i className={`ti ti-${icon}`} style={{ fontSize: '24px', color: 'var(--accent)' }} />}
        </span>
      )}
      {eyebrow && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-caption)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{eyebrow}</span>}
      {title && <h3 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)', fontSize: '20px', lineHeight: 1.25, color: 'var(--text)' }}>{title}</h3>}
      {children && <div style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-regular)', fontSize: '15px', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)' }}>{children}</div>}
      {footer}
    </div>
  );
}
