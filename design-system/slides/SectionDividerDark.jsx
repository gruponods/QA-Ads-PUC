import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { Kicker } from '../components/core/Kicker.jsx';
import { Divider } from '../components/core/Divider.jsx';

/**
 * Dark section divider (the 1–2 "chapter breaks" that give the deck a breather).
 * Black by default — blue reads cleanly on it; navy is available via theme="navy".
 */
export function SectionDividerDark({
  index = '03', kicker = 'Capítulo 03',
  title = 'Resultados que se', highlight = 'miden en el aula',
  subtitle = 'Menos supuestos y más evidencia sobre cómo aprende cada estudiante.',
  theme = 'black', page = '—', ...props
}) {
  return (
    <SlideFrame theme={theme} {...props}>
      <span style={{ position: 'absolute', right: '64px', top: '50%', transform: 'translateY(-50%)', fontSize: '340px', fontWeight: 'var(--fw-bold)', color: 'rgba(255,255,255,0.05)', lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{index}</span>
      <Kicker color="#fff">{kicker}</Kicker>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '26px', maxWidth: '860px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ margin: 0, fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-display-sm)', lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--tracking-display)', color: '#fff' }}>
          {title} <span style={{ color: 'var(--accent)' }}>{highlight}</span>
        </h2>
        <Divider variant="accent" length="56px" />
        {subtitle && <p style={{ margin: 0, fontSize: 'var(--fs-subtitle)', lineHeight: 'var(--lh-body)', color: 'var(--text-on-dark-muted)', maxWidth: '46ch' }}>{subtitle}</p>}
      </div>
      <SlideFooter theme="dark" page={page} label="Capítulo" />
    </SlideFrame>
  );
}
