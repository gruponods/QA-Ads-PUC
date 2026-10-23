import React from 'react';

const STROKE = { accent: 'var(--accent)', ok: 'var(--data-up)', warn: 'var(--data-warn)', risk: 'var(--data-down)', neutral: 'var(--gray-400)' };
const FG = { accent: 'var(--accent)', ok: 'var(--data-up-fg)', warn: 'var(--data-warn-fg)', risk: 'var(--data-down-fg)', neutral: 'var(--text-muted)' };

/** Small circular progress with the value inside. null value = empty dashed ring (future period). */
export function ProgressRing({ value, max = 100, size = 36, stroke = 3, tone = 'accent', showValue = true, format, title, style = {}, ...rest }) {
  const empty = value === null || value === undefined;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const f = empty ? 0 : Math.max(0, Math.min(1, value / max));
  const txt = empty ? '–' : format ? format(value) : `${Math.round(value)}%`;
  const fs = Math.max(8, size * (txt.length > 4 ? 0.24 : 0.28));
  return (
    <span title={title} style={{ position: 'relative', display: 'inline-flex', width: size, height: size, flex: `0 0 ${size}px`, ...style }} {...rest}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} style={{ fill: 'none', stroke: 'var(--gray-200)', strokeWidth: stroke, strokeDasharray: empty ? '2 3' : undefined }} />
        {f > 0 && <circle cx={size / 2} cy={size / 2} r={r} strokeDasharray={`${(f * c).toFixed(2)} ${c.toFixed(2)}`} style={{ fill: 'none', stroke: STROKE[tone] || tone, strokeWidth: stroke, strokeLinecap: 'round' }} />}
      </svg>
      {showValue && (
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 700, letterSpacing: '-0.03em', color: empty ? 'var(--text-faint)' : FG[tone] || 'var(--text)' }}>{txt}</span>
      )}
    </span>
  );
}
