import React from 'react';

const SIZES = {
  sm: { fontSize: '14px', padding: '10px 18px', gap: '8px' },
  md: { fontSize: '16px', padding: '14px 26px', gap: '10px' },
  lg: { fontSize: '18px', padding: '18px 34px', gap: '10px' },
};

/** Pill button. Primary = blue fill; secondary = hairline outline; ghost = bare. */
export function Button({
  children, variant = 'primary', size = 'md', icon, iconRight,
  href, onClick, disabled = false, type = 'button', style = {}, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const palettes = {
    primary: { background: hover && !disabled ? 'var(--accent-fill-hover)' : 'var(--accent-fill)', color: '#fff', border: '1px solid transparent' },
    secondary: { background: 'transparent', color: hover && !disabled ? 'var(--accent)' : 'var(--text)', border: '1px solid', borderColor: hover && !disabled ? 'var(--accent)' : 'var(--border-hairline-color)' },
    ghost: { background: hover && !disabled ? 'var(--gray-100)' : 'transparent', color: 'var(--text)', border: '1px solid transparent' },
  };
  const Comp = href ? 'a' : 'button';
  return (
    <Comp
      href={href} onClick={disabled ? undefined : onClick}
      {...(href ? {} : { type, disabled })}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)',
        borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none', lineHeight: 1, whiteSpace: 'nowrap',
        transition: 'background .15s ease, border-color .15s ease, color .15s ease',
        opacity: disabled ? 0.45 : 1, ...SIZES[size], ...palettes[variant], ...style,
      }}
      {...rest}
    >
      {icon && <i className={`ti ti-${icon}`} style={{ fontSize: '1.15em' }} />}
      {children}
      {iconRight && <i className={`ti ti-${iconRight}`} style={{ fontSize: '1.15em' }} />}
    </Comp>
  );
}
