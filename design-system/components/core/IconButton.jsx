import React from 'react';

/** Round icon-only button for toolbars and topbars. Optional blue notification dot. */
export function IconButton({ icon, label, variant = 'ghost', size = 'md', badge = false, onClick, disabled = false, style = {}, ...rest }) {
  const [h, setH] = React.useState(false);
  const d = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const hv = h && !disabled;
  const v = {
    ghost: { background: hv ? 'var(--gray-100)' : 'transparent', border: '1px solid transparent', color: 'var(--text)' },
    outline: { background: 'var(--surface)', border: '1px solid', borderColor: hv ? 'var(--accent)' : 'var(--border-hairline-color)', color: hv ? 'var(--accent)' : 'var(--text)' },
    primary: { background: hv ? 'var(--accent-fill-hover)' : 'var(--accent-fill)', border: '1px solid transparent', color: '#fff' },
  }[variant];
  return (
    <button
      type="button" aria-label={label} title={label} disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', width: d, height: d, flex: `0 0 ${d}px`, padding: 0, borderRadius: 'var(--radius-pill)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, transition: 'background .15s ease, border-color .15s ease, color .15s ease', ...v, ...style }}
      {...rest}
    >
      <i className={`ti ti-${icon}`} style={{ fontSize: Math.round(d * 0.5) }} />
      {badge && <span style={{ position: 'absolute', top: Math.round(d * 0.2), right: Math.round(d * 0.2), width: 8, height: 8, borderRadius: 999, background: 'var(--accent)', border: '2px solid var(--surface)' }} />}
    </button>
  );
}
