import React from 'react';

/** Text input with label, optional leading icon, hint and error. Focus = blue border, no ring/shadow. */
export function Input({ label, hint, error, icon, size = 'md', id, disabled = false, onFocus, onBlur, style = {}, inputStyle = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const uid = id || autoId;
  const border = error ? 'var(--data-down)' : focus ? 'var(--accent)' : 'var(--border-hairline-color)';
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)', minWidth: 0, ...style }}>
      {label && <label htmlFor={uid} style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: h, padding: '0 14px', boxSizing: 'border-box', border: `1px solid ${border}`, borderRadius: 'var(--radius-card-sm)', background: disabled ? 'var(--gray-050)' : 'var(--surface)', opacity: disabled ? 0.6 : 1, transition: 'border-color .15s ease' }}>
        {icon && <i className={`ti ti-${icon}`} style={{ fontSize: '18px', color: focus ? 'var(--accent)' : 'var(--text-faint)' }} />}
        <input
          id={uid} disabled={disabled} aria-invalid={!!error}
          onFocus={(e) => { setFocus(true); onFocus && onFocus(e); }}
          onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
          style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? '14px' : '15px', color: 'var(--text)', ...inputStyle }}
          {...rest}
        />
      </div>
      {(error || hint) && <span style={{ fontSize: '12px', lineHeight: 1.4, color: error ? 'var(--data-down)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
