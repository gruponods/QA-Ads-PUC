import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';
import { StepItem } from '../components/data/StepItem.jsx';

const STEPS = [
  { icon: 'clipboard-check', title: 'Diagnóstico', body: 'Relevamos el punto de partida de cada institución y aula.' },
  { icon: 'adjustments', title: 'Configuración', body: 'Adaptamos contenidos, roles y accesos al plan de estudio.' },
  { icon: 'school', title: 'Capacitación', body: 'Acompañamos a docentes con formación práctica y guiada.' },
  { icon: 'trending-up', title: 'Adopción', body: 'Medimos el uso y ajustamos para sostener el impacto.' },
];

/** Timeline / process: numbered steps with a connector line and icons. */
export function TimelineSlide({
  kicker = 'Cómo trabajamos', title = 'Un proceso de implementación', highlight = 'en cuatro pasos',
  steps = STEPS, page = '08', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'flex', gap: '28px', alignItems: 'center', marginTop: '24px' }}>
        {steps.map((s, i) => (
          <StepItem
            key={i}
            number={String(i + 1).padStart(2, '0')}
            orientation="horizontal"
            last={i === steps.length - 1}
            title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><i className={`ti ti-${s.icon}`} style={{ fontSize: '20px', color: 'var(--accent)' }} />{s.title}</span>}
          >
            {s.body}
          </StepItem>
        ))}
      </div>
      <SlideFooter page={page} label="Proceso" />
    </SlideFrame>
  );
}
