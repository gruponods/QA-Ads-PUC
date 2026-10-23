import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';

const PROBLEMS = [
  'Contenidos, aula y datos viven en herramientas separadas.',
  'Los docentes pierden horas en tareas administrativas.',
  'Sin datos, es difícil saber qué alumno necesita ayuda.',
];
const SOLUTIONS = [
  'Una sola plataforma que unifica todo el aula.',
  'Automatizaciones que le devuelven tiempo al docente.',
  'Analíticas en vivo por alumno, aula y contenido.',
];

/** Problem / solution: two side-by-side cards — muted problem, blue-accented NODS answer. */
export function ProblemSolutionSlide({
  kicker = 'El desafío', title = 'Del aula fragmentada', highlight = 'a la conectada',
  problemLabel = 'El problema', solutionLabel = 'La solución NODS',
  problems = PROBLEMS, solutions = SOLUTIONS, page = '03', ...props
}) {
  const col = { display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: 'var(--radius-card)', padding: '30px' };
  const chip = (bg) => ({ width: '42px', height: '42px', flex: '0 0 42px', borderRadius: 'var(--radius-card-sm)', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' });
  const row = { display: 'flex', gap: '12px', alignItems: 'baseline', fontSize: '16px', lineHeight: 'var(--lh-body)', color: 'var(--text)' };
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch', marginTop: '30px' }}>
        <div style={{ ...col, border: 'var(--border-hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={chip('var(--gray-100)')}><i className="ti ti-alert-triangle" style={{ fontSize: '22px', color: 'var(--gray-500)' }} /></span>
            <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{problemLabel}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {problems.map((p, i) => (
              <span key={i} style={{ ...row, color: 'var(--text-muted)' }}><i className="ti ti-x" style={{ fontSize: '18px', color: 'var(--gray-400)', position: 'relative', top: '2px' }} />{p}</span>
            ))}
          </div>
        </div>
        <div style={{ ...col, border: '1.5px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={chip('var(--accent-soft)')}><i className="ti ti-sparkles" style={{ fontSize: '22px', color: 'var(--accent)' }} /></span>
            <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'var(--accent-strong)' }}>{solutionLabel}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {solutions.map((s, i) => (
              <span key={i} style={row}><i className="ti ti-check" style={{ fontSize: '18px', color: 'var(--accent)', position: 'relative', top: '2px' }} />{s}</span>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter page={page} label="Desafío" />
    </SlideFrame>
  );
}
