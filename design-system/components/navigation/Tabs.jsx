import React from 'react';

/** Tabs: `underline` (page sections, blue 2px indicator) or `segmented` (pill toggle for filters/ranges). */
export function Tabs({ items = [], value, defaultValue, onChange, variant = 'underline', style = {}, ...rest }) {
  const [inner, setInner] = React.useState(defaultValue !== undefined ? defaultValue : items[0] && items[0].id);
  const cur = value !== undefined ? value : inner;
  const pick = (id) => { if (value === undefined) setInner(id); onChange && onChange(id); };
  const count = (n, active) => n !== undefined && (
    <span style={{ fontSize: '12px', fontWeight: 'var(--fw-medium)', padding: '2px 8px', borderRadius: '999px', background: active ? 'var(--accent-soft)' : 'var(--gray-100)', color: active ? 'var(--accent-strong)' : 'var(--text-muted)' }}>{n}</span>
  );
  if (variant === 'segmented') {
    return (
      <div role="tablist" style={{ display: 'inline-flex', gap: '2px', maxWidth: '100%', overflowX: 'auto', padding: '3px', background: 'var(--gray-100)', borderRadius: '999px', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        {items.map((it) => {
          const a = it.id === cur;
          return (
            <button key={it.id} role="tab" aria-selected={a} type="button" onClick={() => pick(it.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid', borderColor: a ? 'var(--border-hairline-color)' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: '999px', background: a ? 'var(--surface)' : 'transparent', color: a ? 'var(--text)' : 'var(--text-muted)', transition: 'background .15s ease, color .15s ease' }}>
              {it.icon && <i className={`ti ti-${it.icon}`} style={{ fontSize: '16px' }} />}
              {it.label}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div role="tablist" style={{ display: 'flex', gap: '28px', borderBottom: 'var(--border-hairline)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it) => {
        const a = it.id === cur;
        return (
          <button key={it.id} role="tab" aria-selected={a} type="button" onClick={() => pick(it.id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', borderBottom: `2px solid ${a ? 'var(--accent)' : 'transparent'}`, marginBottom: '-1px', padding: '12px 0', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 'var(--fw-medium)', color: a ? 'var(--text)' : 'var(--text-muted)', transition: 'color .15s ease, border-color .15s ease' }}>
            {it.icon && <i className={`ti ti-${it.icon}`} style={{ fontSize: '18px', color: a ? 'var(--accent)' : 'inherit' }} />}
            {it.label}
            {count(it.count, a)}
          </button>
        );
      })}
    </div>
  );
}
