import React from 'react';
import { thresholdTone } from './ThresholdValue.jsx';

const FILL = { bad: 'var(--data-down)', warn: 'var(--data-warn)', good: 'var(--data-up)' };
const FG = { bad: 'var(--data-down-fg)', warn: 'var(--data-warn-fg)', good: 'var(--data-up-fg)' };

/** In-cell data bar: value + thin bar. Blue by default; muted state color past thresholds. */
export function DataBar({ value = 0, max = 100, unit = '', warn, bad, higherIsBetter = true, width = 120, style = {}, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tone = thresholdTone(value, { warn, bad, higherIsBetter });
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <span style={{ fontSize: '13px', fontWeight: tone ? 'var(--fw-bold)' : 'var(--fw-medium)', color: tone ? FG[tone] : 'var(--text)', minWidth: '40px', textAlign: 'right' }}>{value}{unit}</span>
      <span style={{ width, height: '8px', borderRadius: '999px', background: 'var(--gray-100)', overflow: 'hidden', flex: `0 0 ${typeof width === 'number' ? width + 'px' : width}` }}>
        <span style={{ display: 'block', width: `${pct}%`, height: '100%', borderRadius: '999px', background: tone ? FILL[tone] : 'var(--accent)' }} />
      </span>
    </span>
  );
}
