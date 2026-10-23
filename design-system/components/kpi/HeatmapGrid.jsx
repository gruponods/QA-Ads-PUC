import React from 'react';

const RAMP = (p) => [1, 2, 3, 4, 5].map((s) => ({ bg: `var(--${p}-${s})`, fg: `var(--${p}-fg-${s})` }));
const DIV = Object.fromEntries([-2, -1, 0, 1, 2].map((b, i) => [String(b), { bg: `var(--div-${i + 1})`, fg: `var(--div-fg-${i + 1})` }]));

/**
 * Heat-map grid (rows × columns). sequential = 5-step "aurora" (cyan → blue → violet) or "blue" ramp;
 * diverging = coral below `center`, gray around it, blue above. Hover highlights row + column.
 * values: { [rowKey]: { [colKey]: number|null } }
 */
export function HeatmapGrid({ rows = [], cols = [], values = {}, scale = 'sequential', palette = 'aurora', center = 100, spread, min, max, showValues = true, format, cellHeight = 34, rowLabelWidth = 160, totals = false, legendLow = 'Bajo', legendHigh = 'Alto', legend = true, unit = '', style = {}, ...rest }) {
  const [hov, setHov] = React.useState(null);
  const SEQ = RAMP(palette === 'blue' ? 'map' : 'aurora');
  const all = rows.flatMap((r) => cols.map((c) => values[r.key]?.[c.key])).filter((v) => typeof v === 'number');
  const lo = min ?? Math.min(...all);
  const hi = max ?? Math.max(...all);
  const sp = spread ?? Math.max(Math.abs(hi - center), Math.abs(center - lo), 1);
  const fmt = format || ((v) => `${v.toLocaleString('es-AR', { maximumFractionDigits: 1 })}${unit}`);
  const tone = (v) => {
    if (typeof v !== 'number') return { bg: 'transparent', fg: 'var(--text-faint)', empty: true };
    if (scale === 'diverging') {
      const t = (v - center) / sp;
      const b = t <= -0.55 ? -2 : t <= -0.12 ? -1 : t < 0.12 ? 0 : t < 0.55 ? 1 : 2;
      return DIV[String(b)];
    }
    const r = hi === lo ? 1 : (v - lo) / (hi - lo);
    return SEQ[Math.min(4, Math.floor(r * 5))];
  };
  const sum = (arr) => arr.filter((v) => typeof v === 'number').reduce((a, v) => a + v, 0);
  const tpl = `${rowLabelWidth}px repeat(${cols.length}, minmax(34px, 1fr))${totals ? ' 64px' : ''}`;
  const lab = (on) => ({ fontSize: '12px', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', color: on ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap', transition: 'color .15s ease' });
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: '6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: tpl, gap: '3px', minWidth: rowLabelWidth + cols.length * 37 + (totals ? 67 : 0) }} onMouseLeave={() => setHov(null)}>
          <span />
          {cols.map((c) => <span key={c.key} style={{ ...lab(hov && hov.c === c.key), textAlign: 'center', paddingBottom: '4px' }}>{c.label}</span>)}
          {totals && <span style={{ ...lab(false), textAlign: 'right', paddingBottom: '4px' }}>Total</span>}
          {rows.map((r) => (
            <React.Fragment key={r.key}>
              <span title={r.label} style={{ ...lab(hov && hov.r === r.key), color: hov && hov.r === r.key ? 'var(--accent)' : 'var(--text)', fontSize: '13px', display: 'block', lineHeight: `${cellHeight}px`, paddingRight: '10px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
              {cols.map((c) => {
                const v = values[r.key]?.[c.key];
                const t = tone(v);
                const on = hov && (hov.r === r.key || hov.c === c.key);
                const me = hov && hov.r === r.key && hov.c === c.key;
                return (
                  <span key={c.key} title={`${r.label} · ${c.label}: ${typeof v === 'number' ? fmt(v) : 'sin datos'}`}
                    onMouseEnter={() => setHov({ r: r.key, c: c.key })}
                    style={{ height: cellHeight, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', background: t.bg, color: t.fg, border: t.empty ? '1px dashed var(--gray-200)' : 'none', boxSizing: 'border-box', outline: me ? '2px solid var(--text)' : 'none', outlineOffset: '-2px', opacity: hov && !on ? 0.55 : 1, transition: 'opacity .15s ease' }}>
                    {showValues ? (typeof v === 'number' ? fmt(v) : '–') : null}
                  </span>
                );
              })}
              {totals && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '13px', fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums' }}>{fmt(sum(cols.map((c) => values[r.key]?.[c.key])))}</span>}
            </React.Fragment>
          ))}
          {totals && (
            <>
              <span style={{ fontSize: '13px', fontWeight: 'var(--fw-bold)', display: 'flex', alignItems: 'center', borderTop: 'var(--border-hairline)', paddingTop: '6px' }}>Total</span>
              {cols.map((c) => <span key={c.key} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums', borderTop: 'var(--border-hairline)', paddingTop: '6px' }}>{fmt(sum(rows.map((r) => values[r.key]?.[c.key])))}</span>)}
              <span style={{ borderTop: 'var(--border-hairline)' }} />
            </>
          )}
        </div>
      </div>
      {legend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ whiteSpace: 'nowrap' }}>{scale === 'diverging' ? `Bajo ${fmt(center)}` : legendLow}</span>
          <span style={{ display: 'inline-flex', gap: '3px' }}>
            {(scale === 'diverging' ? ['-2', '-1', '0', '1', '2'].map((k) => DIV[k]) : SEQ).map((t, i) => <span key={i} style={{ width: '26px', height: '12px', borderRadius: '4px', background: t.bg }} />)}
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>{scale === 'diverging' ? `Sobre ${fmt(center)}` : legendHigh}</span>
        </div>
      )}
    </div>
  );
}
