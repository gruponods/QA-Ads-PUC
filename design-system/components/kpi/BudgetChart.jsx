import React from 'react';
import { ProgressRing } from './ProgressRing.jsx';
import { chartPattern } from '../data/PatternSwatch.jsx';

/**
 * Real vs budget per period. Budget = gray outlined bar behind; real = blue bar in front
 * (muted amber when below budget). Future periods = hatched budget only. Below each bar,
 * a ProgressRing shows execution, toned by bands (≤b0 ok · ≤b1 warn · >b1 risk).
 */
export function BudgetChart({ data = [], current, height = 260, bands = [100, 125], colWidth = 38, labelEvery = 2, legend = true, valueFormat, style = {}, ...rest }) {
  const peak = Math.max(1, ...data.map((d) => Math.max(d.real || 0, d.budget || 0)));
  const fmt = valueFormat || ((v) => v.toLocaleString('es-AR'));
  const ringTone = (e) => (e <= bands[0] ? 'ok' : e <= bands[1] ? 'warn' : 'risk');
  const sw = (s) => <span style={{ width: '14px', height: '14px', flex: '0 0 14px', boxSizing: 'border-box', borderRadius: '4px', ...s }} />;
  const ring = (c) => <span style={{ width: '14px', height: '14px', flex: '0 0 14px', boxSizing: 'border-box', borderRadius: '999px', border: `2px solid ${c}` }} />;
  const item = (node, text) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}>{node}{text}</span>;
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {legend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 18px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
          {item(sw({ background: 'var(--gray-100)', border: '1px solid var(--gray-300)' }), 'Budget')}
          {item(sw({ background: 'var(--accent)' }), 'Real')}
          {item(sw({ background: 'var(--data-warn)' }), 'Real bajo budget')}
          {item(sw({ ...chartPattern('diagonal', 'var(--gray-300)'), borderWidth: '1px' }), 'Próximas semanas')}
          <span style={{ width: '1px', height: '16px', background: 'var(--gray-200)' }} />
          {item(ring('var(--data-up)'), `Ejecución ≤${bands[0]}%`)}
          {item(ring('var(--data-warn)'), `${bands[0]}–${bands[1]}%`)}
          {item(ring('var(--data-down)'), `>${bands[1]}%`)}
        </div>
      )}
      <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <div style={{ minWidth: data.length * colWidth }}>
          <div style={{ position: 'relative', height, display: 'flex', alignItems: 'flex-end', borderBottom: 'var(--border-hairline)' }}>
            {[0.25, 0.5, 0.75, 1].map((t) => <div key={t} style={{ position: 'absolute', left: 0, right: 0, bottom: `${t * 100}%`, borderTop: '1px solid var(--gray-100)' }} />)}
            {data.map((d) => {
              const future = d.real === null || d.real === undefined;
              const under = !future && d.real < d.budget;
              const tip = future ? `${d.label} · Budget ${fmt(d.budget)}` : `${d.label} · Real ${fmt(d.real)} · Budget ${fmt(d.budget)} · Ejec. ${d.exec}%`;
              return (
                <div key={d.label} title={tip} style={{ flex: 1, height: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: `${(d.budget / peak) * 100}%`, boxSizing: 'border-box', borderRadius: '6px 6px 0 0', ...(future ? chartPattern('diagonal', 'var(--gray-300)') : { background: 'var(--gray-100)', border: '1px solid var(--gray-300)' }), borderWidth: '1px', borderBottom: 'none' }} />
                  {!future && <div style={{ position: 'relative', width: '50%', height: `${(d.real / peak) * 100}%`, minHeight: '3px', borderRadius: '6px 6px 0 0', background: under ? 'var(--data-warn)' : 'var(--accent)' }} />}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            {data.map((d) => {
              const future = d.real === null || d.real === undefined;
              return (
                <div key={d.label} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <ProgressRing value={future ? null : d.exec} size={Math.min(34, colWidth - 4)} stroke={2.5} tone={future ? 'neutral' : ringTone(d.exec)} title={future ? `${d.label} · sin datos` : `${d.label} · Ejecución ${d.exec}%`} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', marginTop: '8px' }}>
            {data.map((d, i) => {
              const cur = d.label === current;
              return <span key={d.label} style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: cur ? 700 : 400, color: cur ? 'var(--accent)' : 'var(--text-muted)', visibility: i % labelEvery === 0 || cur ? 'visible' : 'hidden' }}>{d.label}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
