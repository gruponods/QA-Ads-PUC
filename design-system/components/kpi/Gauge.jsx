import React from 'react';

const TONES = { accent: 'var(--accent)', ok: 'var(--data-up)', warn: 'var(--data-warn)', risk: 'var(--data-down)' };

function arc(cx, cy, r, f0, f1) {
  const p = (f) => { const a = Math.PI * (1 - f); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
  const [x0, y0] = p(f0); const [x1, y1] = p(f1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * Semicircle gauge for compliance vs target. Flat: gray track + solid fill.
 * Values above max fill the track and add a thin muted-red outer arc for the overflow.
 */
export function Gauge({ value = 0, max = 100, label, format, tone = 'accent', minLabel = '0%', maxLabel = '100%', overflowLabel, width = 300, style = {}, ...rest }) {
  const f = Math.max(0, Math.min(1, value / max));
  const over = value > max ? Math.min(1, (value - max) / max) : 0;
  const fmt = format || ((v) => `${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`);
  const small = { fontFamily: 'var(--font-sans)', fontSize: 10, fill: 'var(--text-faint)' };
  return (
    <div style={{ width, maxWidth: '100%', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <svg viewBox="0 0 220 136" role="img" aria-label={`${label || ''} ${fmt(value)}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <path d={arc(110, 112, 86, 0, 1)} style={{ fill: 'none', stroke: 'var(--gray-100)', strokeWidth: 20, strokeLinecap: 'round' }} />
        {f > 0 && <path d={arc(110, 112, 86, 0, f)} style={{ fill: 'none', stroke: TONES[tone] || tone, strokeWidth: 20, strokeLinecap: 'round' }} />}
        {over > 0 && <path d={arc(110, 112, 104, 0, over)} style={{ fill: 'none', stroke: 'var(--data-down)', strokeWidth: 5, strokeLinecap: 'round' }} />}
        <text x="110" y="100" textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', fill: 'var(--text)' }}>{fmt(value)}</text>
        {label && <text x="110" y="121" textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fill: 'var(--text-muted)' }}>{label}</text>}
        <text x="24" y="134" textAnchor="middle" style={small}>{minLabel}</text>
        <text x="196" y="134" textAnchor="middle" style={small}>{maxLabel}</text>
      </svg>
      {over > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '13px', fontWeight: 500, color: 'var(--data-down-fg)' }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: '16px' }} />
          {overflowLabel || `+${fmt(value - max)} sobre el objetivo`}
        </div>
      )}
    </div>
  );
}
