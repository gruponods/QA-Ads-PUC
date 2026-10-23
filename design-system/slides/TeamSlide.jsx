import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';
import { PhotoFrame } from './PhotoFrame.jsx';

const MEMBERS = [
  { name: 'Ana Torres', role: 'CEO & cofundadora' },
  { name: 'Martín Ruiz', role: 'CTO & cofundador' },
  { name: 'Lucía Gómez', role: 'Directora pedagógica' },
  { name: 'Diego Sosa', role: 'Head de Producto' },
];

/** Team / about us: circular photo placeholders with name and role, in a row. */
export function TeamSlide({
  kicker = 'Equipo', title = 'Las personas detrás de', highlight = 'NODS',
  subtitle = 'Educadores e ingenieros construyendo la tecnología que el aula necesita.',
  members = MEMBERS, page = '12', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} subtitle={subtitle} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${members.length}, 1fr)`, gap: '28px', alignContent: 'center', marginTop: '20px' }}>
        {members.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            {m.src
              ? <PhotoFrame src={m.src} alt={m.name} style={{ width: '150px', height: '150px', borderRadius: '999px' }} />
              : <PhotoFrame icon="user" label="" style={{ width: '150px', height: '150px', borderRadius: '999px' }} />}
            <div>
              <h4 style={{ margin: '0 0 4px', fontWeight: 'var(--fw-medium)', fontSize: '19px', color: 'var(--text)' }}>{m.name}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{m.role}</p>
            </div>
          </div>
        ))}
      </div>
      <SlideFooter page={page} label="Equipo" />
    </SlideFrame>
  );
}
