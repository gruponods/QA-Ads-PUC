import React from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pf = (v, d = 1) => `${v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;

/**
 * Marketing funnel: one centered bar per stage, colored along the funnel ramp, with a drop chip
 * between stages (the biggest drop is highlighted). Hovering a stage or a chip shows a tooltip with
 * value, % of total, conversion from the previous stage and the drop (% and count lost).
 */
export function FunnelChart({ stages = [], colors, scale = 'auto', format, labelWidth = 190, valueWidth = 120, barHeight = 46, showDrops = true, animate = true, style = {}, ...rest }) {
  const wrap = React.useRef(null);
  const [hov, setHov] = React.useState(null);
  const [grown, setGrown] = React.useState(!animate || reduced());
  React.useEffect(() => { if (grown) return undefined; const t = setTimeout(() => setGrown(true), 30); return () => clearTimeout(t); }, []);
  const n = stages.length;
  const v0 = Math.max(1, stages[0] ? stages[0].value : 1);
  const vN = n ? stages[n - 1].value : v0;
  const mode = scale === 'auto' ? (vN / v0 >= 0.2 ? 'linear' : 'sqrt') : scale;
  const width = (v) => Math.max(4, (mode === 'sqrt' ? Math.sqrt(v / v0) : v / v0) * 100);
  const fmt = format || ((v) => v.toLocaleString('es-AR'));
  const pal = colors || ['var(--funnel-1)', 'var(--funnel-2)', 'var(--funnel-3)', 'var(--funnel-4)', 'var(--funnel-5)', 'var(--funnel-6)'];
  const colorOf = (i) => (colors ? pal[i % pal.length] : pal[n <= 1 ? 2 : Math.round((i * (pal.length - 1)) / (n - 1))]);
  const drops = stages.map((s, i) => (i === 0 ? null : 100 - (s.value / Math.max(1, stages[i - 1].value)) * 100));
  const worst = drops.reduce((w, d, i) => (d !== null && (w === -1 || d > drops[w]) ? i : w), -1);
  const move = (e, i) => { const r = wrap.current.getBoundingClientRect(); setHov({ i, x: e.clientX - r.left, y: e.clientY - r.top, w: r.width }); };
  const grid = { display: 'grid', gridTemplateColumns: `${labelWidth}px minmax(0,1fr) ${valueWidth}px`, alignItems: 'center', columnGap: '16px' };

  const tip = hov && stages[hov.i] && (() => {
    const i = hov.i; const s = stages[i]; const prev = stages[i - 1];
    const right = hov.x > hov.w - 260;
    const row = (k, v, c) => <span style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', fontSize: '13px' }}><span style={{ color: 'var(--text-muted)' }}>{k}</span><b style={{ fontWeight: 700, color: c || 'var(--text)' }}>{v}</b></span>;
    return (
      <div style={{ position: 'absolute', left: right ? hov.x - 14 : hov.x + 14, top: hov.y + 14, transform: right ? 'translateX(-100%)' : 'none', zIndex: 5, pointerEvents: 'none', minWidth: '230px', background: 'var(--surface)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-card-sm)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700 }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', background: colorOf(i) }} />{s.label}</span>
        {row('Volumen', fmt(s.value))}
        {row('% del total', pf((s.value / v0) * 100, 2))}
        {prev && row(`Conversión desde ${prev.label}`, pf((s.value / Math.max(1, prev.value)) * 100), 'var(--data-up-fg)')}
        {prev && row('Caída', `${pf(drops[i])} · −${fmt(prev.value - s.value)}`, 'var(--data-down-fg)')}
        {s.note && <span style={{ fontSize: '12px', color: 'var(--text-faint)', borderTop: 'var(--border-hairline)', paddingTop: '7px' }}>{s.note}</span>}
      </div>
    );
  })();

  return (
    <div ref={wrap} style={{ position: 'relative', fontFamily: 'var(--font-sans)', ...style }} onMouseLeave={() => setHov(null)} {...rest}>
      {stages.map((s, i) => {
        const on = !hov || hov.i === i;
        const w = width(s.value);
        const share = (s.value / v0) * 100;
        return (
          <React.Fragment key={s.label}>
            {i > 0 && showDrops && (
              <div style={{ ...grid, height: '30px' }}>
                <span />
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <span onMouseMove={(e) => move(e, i)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: '999px', cursor: 'default', transition: 'opacity .15s ease', opacity: !hov || hov.i === i ? 1 : 0.5, ...(i === worst ? { background: 'var(--data-down)', color: '#fff' } : { background: 'var(--data-down-soft)', color: 'var(--data-down-fg)' }) }}>
                    <i className="ti ti-arrow-down-right" style={{ fontSize: '14px' }} />{`−${pf(drops[i])}${i === worst ? ' · mayor caída' : ''}`}
                  </span>
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-faint)', textAlign: 'right', whiteSpace: 'nowrap' }}>{pf(100 - drops[i])} avanza</span>
              </div>
            )}
            <div style={grid} onMouseMove={(e) => move(e, i)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {s.icon && <span style={{ width: '34px', height: '34px', flex: '0 0 34px', borderRadius: '10px', background: 'var(--surface-muted)', border: 'var(--border-hairline)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${s.icon}`} style={{ fontSize: '18px', color: colorOf(i) }} /></span>}
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{pf(share, share < 1 ? 2 : 1)} del total</span>
                </span>
              </span>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ height: barHeight, width: grown ? `${w}%` : '0%', borderRadius: '10px', background: colorOf(i), opacity: on ? 1 : 0.4, transition: `width .8s cubic-bezier(.2,0,0,1) ${i * 70}ms, opacity .15s ease`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {w > 16 && grown ? pf(share, share < 1 ? 2 : 1) : ''}
                </span>
              </span>
              <span style={{ textAlign: 'right', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{fmt(s.value)}</span>
            </div>
          </React.Fragment>
        );
      })}
      {tip}
    </div>
  );
}
