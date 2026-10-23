import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { Kicker } from '../components/core/Kicker.jsx';
import { Button } from '../components/core/Button.jsx';

/** Closing / CTA: strong headline + contact, same language as the cover. */
export function ClosingSlide({
  kicker = 'Hablemos', title = 'Llevemos la tecnología', highlight = 'a tu aula.',
  subtitle = 'Coordinemos una demo de 30 minutos y diseñemos juntos el plan para tu institución.',
  email = 'hola@nods.tech', site = 'nods.tech', phone = '+54 11 5000 0000', ...props
}) {
  const contact = [{ icon: 'mail', text: email }, { icon: 'world', text: site }, { icon: 'phone', text: phone }];
  return (
    <SlideFrame mark={false} {...props}>
      <img src="../assets/logo-nods-blue.png" alt="NODS — Technology for Education" style={{ height: '40px', width: 'auto', alignSelf: 'flex-start', display: 'block' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px', maxWidth: '900px' }}>
        <Kicker>{kicker}</Kicker>
        <h1 style={{ margin: 0, fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-display)', lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--tracking-display)' }}>
          {title} <span style={{ color: 'var(--accent)' }}>{highlight}</span>
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--fs-subtitle)', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)', maxWidth: '52ch' }}>{subtitle}</p>
        <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
          <Button variant="primary" size="lg" iconRight="arrow-right">Agendar una demo</Button>
          <Button variant="secondary" size="lg" icon="download">One-pager</Button>
        </div>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '22px', borderTop: 'var(--border-hairline)', display: 'flex', gap: '40px' }}>
        {contact.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '15px', fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>
            <i className={`ti ti-${c.icon}`} style={{ fontSize: '19px', color: 'var(--accent)' }} />{c.text}
          </span>
        ))}
      </div>
    </SlideFrame>
  );
}
