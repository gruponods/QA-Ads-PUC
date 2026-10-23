import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';

const PHASES = [
  { q: 'T1 · 2026', title: 'Lanzamiento', state: 'done', items: ['Onboarding de pilotos', 'Biblioteca base de contenidos'] },
  { q: 'T2 · 2026', title: 'Aula conectada', state: 'current', items: ['App docente y alumno', 'Analíticas por aula'] },
  { q: 'T3 · 2026', title: 'Inteligencia', state: 'next', items: ['Asistente con IA', 'Recomendaciones de contenido'] },
  { q: 'T4 · 2026', title: 'Escala', state: 'next', items: ['Integraciones y API', 'Expansión regional'] },
];

/** Roadmap: horizontal timeline of phases on a connector track, with milestones. */
export function RoadmapSlide({
  kicker = 'Roadmap', title = 'Hacia dónde', highlight = 'vamos',
  phases = PHASES, page = '10', ...props
}) {
  const filled = (s) => s === 'done' || s === 'current';
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ position: 'relative', height: '22px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '12.5%', right: '12.5%', height: '2px', background: 'var(--border-hairline-color)', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${phases.length}, 1fr)` }}>
            {phases.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: filled(p.state) ? 'var(--accent)' : 'var(--surface)', border: filled(p.state) ? 'none' : '2px solid var(--gray-300)' }}>
                  {p.state === 'done' && <i className="ti ti-check" style={{ fontSize: '13px', color: '#fff' }} />}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${phases.length}, 1fr)`, columnGap: '28px', marginTop: '26px' }}>
          {phases.map((p, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em', textTransform: 'uppercase', color: p.state === 'current' ? 'var(--accent)' : 'var(--text-faint)' }}>{p.q}</span>
              <h4 style={{ margin: 0, fontWeight: 'var(--fw-medium)', fontSize: '19px', color: p.state === 'current' ? 'var(--accent)' : 'var(--text)' }}>{p.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {p.items.map((it, j) => (
                  <span key={j} style={{ display: 'flex', gap: '8px', alignItems: 'baseline', fontSize: '14px', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)' }}>
                    <i className="ti ti-point-filled" style={{ fontSize: '10px', color: 'var(--accent)', position: 'relative', top: '-1px' }} />{it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter page={page} label="Roadmap" />
    </SlideFrame>
  );
}
