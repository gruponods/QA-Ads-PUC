import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { Kicker } from '../components/core/Kicker.jsx';

/**
 * Cover slide: kicker + oversized headline with one word in blue + subtitle,
 * with lots of air. The blueword pattern is the brand's signature headline.
 */
export function CoverSlide({
  kicker = 'Tecnología para la educación',
  title = 'Tecnología que hace que el aula realmente',
  highlight = 'funcione.',
  subtitle = 'La plataforma que integra contenidos, aula y analíticas en un solo lugar — para que cada docente enseñe con datos, no con supuestos.',
  page = '01', ...props
}) {
  return (
    <SlideFrame {...props}>
      <Kicker>{kicker}</Kicker>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px', maxWidth: '960px' }}>
        <h1 style={{ margin: 0, fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-display)', lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--tracking-display)', color: 'var(--text)' }}>
          {title} <span style={{ color: 'var(--accent)' }}>{highlight}</span>
        </h1>
        <p style={{ margin: 0, fontWeight: 'var(--fw-regular)', fontSize: 'var(--fs-subtitle)', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)', maxWidth: '58ch' }}>
          {subtitle}
        </p>
      </div>
      <SlideFooter page={page} label="nods.tech · 2026" />
    </SlideFrame>
  );
}
