import React from 'react';

/** Checkbox: 20px rounded box, blue fill + white check when on. Controlled or uncontrolled. */
export function Checkbox({ label, description, checked, defaultChecked = false, onChange, disabled = false, style = {}, ...rest }) {
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
      role="checkbox" aria-checked={on} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: disabled ? 0.45 : 1, outline: 'none', userSelect: 'none', ...style }}
      {...rest}
    >
      <span style={{ width: '20px', height: '20px', flex: '0 0 20px', boxSizing: 'border-box', marginTop: '1px', borderRadius: '6px', border: on ? 'none' : '1.5px solid var(--gray-300)', background: on ? 'var(--accent-fill)' : 'var(--surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s ease' }}>
        {on && <i className="ti ti-check" style={{ fontSize: '14px', color: '#fff' }} />}
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {label && <span style={{ fontSize: '15px', lineHeight: 1.4, color: 'var(--text)' }}>{label}</span>}
          {description && <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text-muted)' }}>{description}</span>}
        </span>
      )}
    </span>
  );
}
