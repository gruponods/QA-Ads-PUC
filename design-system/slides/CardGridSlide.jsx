import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';
import { Card } from '../components/core/Card.jsx';

const DEFAULT_ITEMS = [
  { icon: 'books', title: 'Contenido curado', body: 'Biblioteca alineada al currículo, lista para el aula.' },
  { icon: 'device-laptop', title: 'Aula digital', body: 'Clases, tareas y seguimiento en un mismo espacio.' },
  { icon: 'chart-dots', title: 'Analíticas en vivo', body: 'Avance por alumno, aula y contenido, en tiempo real.' },
  { icon: 'users-group', title: 'Gestión docente', body: 'Roles, permisos y comunicación centralizados.' },
  { icon: 'sparkles', title: 'Asistente con IA', body: 'Sugerencias de actividades y correcciones asistidas.' },
  { icon: 'shield-check', title: 'Datos protegidos', body: 'Privacidad y cumplimiento para instituciones.' },
];

/** Card grid (2 / 3 / 4 / 6 cells): each rounded card has an icon, title and microcopy. */
export function CardGridSlide({
  kicker = 'Plataforma', title = 'Todo lo que un aula necesita,', highlight = 'integrado',
  items = DEFAULT_ITEMS, columns = 3, page = '05', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '18px', marginTop: '32px', alignContent: 'center' }}>
        {items.map((it, i) => (
          <Card key={i} icon={it.icon} title={it.title} padding="24px">{it.body}</Card>
        ))}
      </div>
      <SlideFooter page={page} label="Plataforma" />
    </SlideFrame>
  );
}
