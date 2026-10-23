import React from 'react';
import { chartPattern } from '../data/PatternSwatch.jsx';

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compact = (v) => (Math.abs(v) >= 100000 ? new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(v) : v.toLocaleString('es-AR', { maximumFractionDigits: 2 }));

/**
 * Head-to-head KPI comparison (butterfly bars). Left series = solid blue, right = blue diagonal pattern.
 * Winner per row is bold with a muted-green advantage %; `lower: true` for cost metrics; `neutral: true` = no winner.
 */
export function VersusTable({ left = { label: 'A' }, right = { label: 'B' }, metrics = [], animate = true, labelWidth = 170, leftColor = 'var(--chart-1)', rightColor = 'var(--chart-2)', rightPattern, style = {}, ...rest }) {
  const fillL = { background: leftColor };
  const fillR = rightPattern ? chartPattern(rightPattern, rightColor) : { background: rightColor };
  const [on, setOn] = React.useState(!animate || reduced());
  React.useEffect(() => { if (on) return undefined; const r = setTimeout(() => setOn(true), 30); return () => clearTimeout(r); }, []);
  const head = (side, align) => (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: align, gap: '8px', fontSize: '15px', fontWeight: 'var(--fw-bold)', color: 'var(--text)' }}>
      {align === 'flex-end' && side.label}
      <span style={{ width: '14px', height: '14px', borderRadius: '4px', boxSizing: 'border-box', ...(side === left ? fillL : fillR) }} />
      {side.icon && <i className={`ti ti-${side.icon}`} style={{ fontSize: '20px', color: side === left ? leftColor : rightColor }} />}
      {align !== 'flex-end' && side.label}
    </span>
  );
  const grid = { display: 'grid', gridTemplateColumns: `minmax(0,1fr) ${labelWidth}px minmax(0,1fr)`, alignItems: 'center', columnGap: '14px' };
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ ...grid, paddingBottom: '12px', borderBottom: 'var(--border-hairline)' }}>
        {head(left, 'flex-end')}
        <span style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>vs</span>
        {head(right, 'flex-start')}
      </div>
      {metrics.map((m, i) => {
        const l = m.left; const r = m.right;
        const max = Math.max(Math.abs(l), Math.abs(r), 1e-9);
        const fmt = m.format || compact;
        let win = null;
        if (!m.neutral && l !== r) win = m.lower ? (l < r ? 'l' : 'r') : (l > r ? 'l' : 'r');
        const adv = win ? Math.round(m.lower ? ((Math.max(l, r) - Math.min(l, r)) / Math.max(l, r)) * 100 : ((Math.max(l, r) - Math.min(l, r)) / Math.max(Math.min(l, r), 1e-9)) * 100) : 0;
        const val = (v, w, align) => (
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: align, minWidth: '74px' }}>
            <span style={{ fontSize: '15px', fontWeight: w ? 'var(--fw-bold)' : 'var(--fw-regular)', color: w ? 'var(--text)' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fmt(v)}</span>
            {w && <span style={{ fontSize: '11px', fontWeight: 'var(--fw-medium)', color: 'var(--data-up-fg)', whiteSpace: 'nowrap' }}>{m.lower ? '−' : '+'}{adv}%</span>}
          </span>
        );
        const bar = (v, isLeft) => (
          <span style={{ flex: 1, display: 'flex', justifyContent: isLeft ? 'flex-end' : 'flex-start' }}>
            <span style={{ height: '12px', borderRadius: '999px', boxSizing: 'border-box', width: on ? `${(Math.abs(v) / max) * 100}%` : '0%', minWidth: on ? '4px' : 0, transition: `width .8s cubic-bezier(.2,0,0,1) ${i * 60}ms`, ...(isLeft ? fillL : fillR) }} />
          </span>
        );
        return (
          <div key={m.key || m.label} style={{ ...grid, padding: '12px 0', borderBottom: i < metrics.length - 1 ? 'var(--border-hairline)' : 'none' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{val(l, win === 'l', 'flex-start')}{bar(l, true)}</span>
            <span style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>
              {m.label}
              {m.hint && <span style={{ display: 'block', fontSize: '11px', fontWeight: 'var(--fw-regular)', color: 'var(--text-faint)' }}>{m.hint}</span>}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{bar(r, false)}{val(r, win === 'r', 'flex-end')}</span>
          </div>
        );
      })}
    </div>
  );
}
