import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { Kicker } from '../components/core/Kicker.jsx';
import { Divider } from '../components/core/Divider.jsx';

/** Light section divider: kicker + big headline with one blue word, giant faint index, lots of air. */
export function SectionSlide({
  index = '02', kicker = 'Sección 02',
  title = 'Todo el aula, en una sola', highlight = 'plataforma',
  subtitle = 'Contenidos, gestión y analíticas dejan de vivir en silos separados.',
  page = '—', ...props
}) {
  return (
    <SlideFrame {...props}>
      <span style={{ position: 'absolute', right: '64px', top: '50%', transform: 'translateY(-50%)', fontSize: '340px', fontWeight: 'var(--fw-bold)', color: 'var(--gray-100)', lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{index}</span>
      <Kicker>{kicker}</Kicker>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '26px', maxWidth: '820px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ margin: 0, fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-display-sm)', lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--tracking-display)' }}>
          {title} <span style={{ color: 'var(--accent)' }}>{highlight}</span>
        </h2>
        <Divider variant="accent" length="56px" />
        {subtitle && <p style={{ margin: 0, fontSize: 'var(--fs-subtitle)', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)', maxWidth: '46ch' }}>{subtitle}</p>}
      </div>
      <SlideFooter page={page} label="Sección" />
    </SlideFrame>
  );
}
