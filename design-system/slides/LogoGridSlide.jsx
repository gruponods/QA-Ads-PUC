import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';
import { LogoWall } from '../components/data/LogoWall.jsx';

const LOGOS = ['Ministerio', 'EduRed', 'Colegio Sur', 'Aula21', 'Politécnico', 'Instituto Norte', 'Fundación Saber', 'Campus Río', 'Liceo Central', 'RedEdu'];

/** Client logo grid in grayscale — the "trusted by" wall, plus a supporting stat line. */
export function LogoGridSlide({
  kicker = 'Confían en NODS', title = 'Instituciones que ya enseñan', highlight = 'con NODS',
  subtitle = 'De escuelas públicas a redes privadas, en más de 40 países.',
  logos = LOGOS, page = '09', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} subtitle={subtitle} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '28px' }}>
        <LogoWall columns={5} logos={logos} />
      </div>
      <SlideFooter page={page} label="Clientes" />
    </SlideFrame>
  );
}
