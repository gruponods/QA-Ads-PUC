import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';

const ROWS = [
  { feat: 'Contenido, aula y analíticas en un solo lugar', nods: true, other: false },
  { feat: 'Analíticas por alumno en tiempo real', nods: true, other: 'Limitado' },
  { feat: 'Asistente con IA integrado', nods: true, other: false },
  { feat: 'Implementación y capacitación guiadas', nods: true, other: 'Con costo' },
  { feat: 'Soporte dedicado para instituciones', nods: true, other: true },
];

/** Comparison table: aligned rows, Medium headers, the NODS column highlighted in blue. */
export function ComparisonSlide({
  kicker = 'Comparativa', title = 'Por qué las instituciones', highlight = 'eligen NODS',
  rows = ROWS, page = '07', ...props
}) {
  const cell = { padding: '17px 22px', display: 'flex', alignItems: 'center', fontFamily: 'var(--font-sans)' };
  const otherMark = (o) => {
    if (o === true) return <i className="ti ti-check" style={{ fontSize: '22px', color: 'var(--gray-300)' }} />;
    if (o === false) return <i className="ti ti-minus" style={{ fontSize: '22px', color: 'var(--gray-300)' }} />;
    return <span style={{ fontSize: '14px', color: 'var(--text-faint)' }}>{o}</span>;
  };
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 1fr' }}>
          <div style={{ ...cell, fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 'var(--fw-medium)' }}>Capacidad</div>
          <div style={{ ...cell, justifyContent: 'center', background: 'var(--accent-soft)', borderRadius: '14px 14px 0 0', fontWeight: 'var(--fw-bold)', fontSize: '18px', color: 'var(--accent-strong)' }}>NODS</div>
          <div style={{ ...cell, justifyContent: 'center', fontWeight: 'var(--fw-medium)', fontSize: '16px', color: 'var(--text-muted)' }}>Alternativas</div>
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            return (
              <React.Fragment key={i}>
                <div style={{ ...cell, borderTop: 'var(--border-hairline)', fontSize: '16px', color: 'var(--text)' }}>{r.feat}</div>
                <div style={{ ...cell, justifyContent: 'center', background: 'var(--accent-soft)', borderRadius: last ? '0 0 14px 14px' : 0 }}>
                  <i className="ti ti-check" style={{ fontSize: '24px', color: 'var(--accent)' }} />
                </div>
                <div style={{ ...cell, justifyContent: 'center', borderTop: 'var(--border-hairline)' }}>{otherMark(r.other)}</div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <SlideFooter page={page} label="Comparativa" />
    </SlideFrame>
  );
}
