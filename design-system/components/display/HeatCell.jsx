import React from 'react';

/** Heat-map cell: blue intensity (5-step ramp) by value, with readable text on every step. */
export function HeatCell({ value, max = 100, min = 0, label, size = 34, showValue = true, style = {}, ...rest }) {
  const empty = value === null || value === undefined;
  const r = empty ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  const step = empty ? 0 : Math.min(5, Math.floor(r * 5) + 1);
  return (
    <span title={label ? `${label}: ${empty ? 'sin datos' : value}` : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size - 6, borderRadius: '8px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 'var(--fw-medium)', background: empty ? 'var(--gray-100)' : `var(--map-${step})`, color: empty ? 'var(--text-faint)' : `var(--map-fg-${step})`, ...style }} {...rest}>
      {empty ? '–' : showValue ? value : null}
    </span>
  );
}
