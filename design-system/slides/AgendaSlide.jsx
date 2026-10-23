import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';

const ITEMS = [
  { n: '01', title: 'El contexto', desc: 'Dónde están hoy la educación y la tecnología.' },
  { n: '02', title: 'La plataforma', desc: 'Contenido, aula y analíticas en un solo lugar.' },
  { n: '03', title: 'El impacto', desc: 'Resultados que se miden en cada aula.' },
  { n: '04', title: 'Cómo trabajamos', desc: 'El proceso de implementación en cuatro pasos.' },
  { n: '05', title: 'Comparativa', desc: 'Por qué las instituciones eligen NODS.' },
  { n: '06', title: 'Próximos pasos', desc: 'Cómo empezamos a trabajar juntos.' },
];

/** Agenda / índice: numbered contents list in two columns, big blue numerals. */
export function AgendaSlide({
  kicker = 'Agenda', title = 'Lo que vamos a', highlight = 'recorrer',
  items = ITEMS, page = '02', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${Math.ceil(items.length / 2)}, auto)`, gridAutoFlow: 'column', columnGap: '64px', alignContent: 'center', marginTop: '28px' }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: '22px', alignItems: 'baseline', padding: '22px 0', borderTop: 'var(--border-hairline)' }}>
            <span style={{ fontWeight: 'var(--fw-bold)', fontSize: '34px', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)', minWidth: '52px' }}>{it.n}</span>
            <div>
              <h4 style={{ margin: '0 0 5px', fontWeight: 'var(--fw-medium)', fontSize: '20px', color: 'var(--text)' }}>{it.title}</h4>
              {it.desc && <p style={{ margin: 0, fontSize: '15px', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)' }}>{it.desc}</p>}
            </div>
          </div>
        ))}
      </div>
      <SlideFooter page={page} label="Agenda" />
    </SlideFrame>
  );
}
