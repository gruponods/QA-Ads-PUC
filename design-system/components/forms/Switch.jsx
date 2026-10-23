import React from 'react';

/** Toggle switch: pill track, blue when on. Controlled or uncontrolled. */
export function Switch({ label, checked, defaultChecked = false, onChange, disabled = false, style = {}, ...rest }) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (checked === undefined) setInner(next);
    onChange && onChange(next);
  };
  return (
    <span
      role="switch" aria-checked={on} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: disabled ? 0.45 : 1, outline: 'none', userSelect: 'none', ...style }}
      {...rest}
    >
      <span style={{ position: 'relative', width: '40px', height: '24px', flex: '0 0 40px', borderRadius: '999px', background: on ? 'var(--accent-fill)' : 'var(--gray-300)', transition: 'background .15s ease' }}>
        <span style={{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '18px', height: '18px', borderRadius: '999px', background: '#fff', transition: 'left .15s ease' }} />
      </span>
      {label && <span style={{ fontSize: '15px', color: 'var(--text)' }}>{label}</span>}
    </span>
  );
}
