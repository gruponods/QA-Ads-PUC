import React from 'react';

/** Linear progress: gray pill track, blue fill. Optional label + percentage above. */
export function ProgressBar({ value = 0, max = 100, label, showValue = false, size = 'md', color = 'var(--accent)', animate = true, style = {}, ...rest }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [grown, setGrown] = React.useState(!animate || reduce);
  React.useEffect(() => { if (grown) return undefined; const r = setTimeout(() => setGrown(true), 30); return () => clearTimeout(r); }, []);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === 'sm' ? 6 : 8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)', minWidth: 0, ...style }} {...rest}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '13px' }}>
          {label && <span style={{ color: 'var(--text-muted)' }}>{label}</span>}
          {showValue && <span style={{ fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} style={{ height: h, borderRadius: '999px', background: 'var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ width: grown ? `${pct}%` : '0%', height: '100%', borderRadius: '999px', background: color, transition: 'width .8s cubic-bezier(.2,0,0,1)' }} />
      </div>
    </div>
  );
}
