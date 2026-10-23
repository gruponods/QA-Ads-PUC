import React from 'react';

/** Native select styled to match Input: hairline border, 12px radius, chevron icon. */
export function Select({ label, hint, error, options = [], placeholder, size = 'md', id, disabled = false, style = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const uid = id || autoId;
  const border = error ? 'var(--data-down)' : focus ? 'var(--accent)' : 'var(--border-hairline-color)';
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)', minWidth: 0, ...style }}>
      {label && <label htmlFor={uid} style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <select
          id={uid} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: '100%', height: h, boxSizing: 'border-box', appearance: 'none', WebkitAppearance: 'none', padding: '0 40px 0 14px', border: `1px solid ${border}`, borderRadius: 'var(--radius-card-sm)', background: disabled ? 'var(--gray-050)' : 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? '14px' : '15px', color: 'var(--text)', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, transition: 'border-color .15s ease' }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      </div>
      {(error || hint) && <span style={{ fontSize: '12px', lineHeight: 1.4, color: error ? 'var(--data-down)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
