import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { Kicker } from '../components/core/Kicker.jsx';
import { PhotoFrame } from './PhotoFrame.jsx';

const FEATURES = [
  { icon: 'layout-dashboard', title: 'Panel del docente', desc: 'Todo el aula en una sola vista.' },
  { icon: 'chart-dots', title: 'Analíticas en vivo', desc: 'Avance por alumno y contenido.' },
  { icon: 'bell', title: 'Alertas tempranas', desc: 'Detectá quién necesita apoyo.' },
];

/** Product screenshot: feature callouts beside an app mock in a browser window. */
export function ProductShotSlide({
  kicker = 'Producto', title = 'El aula, en', highlight = 'una pantalla',
  features = FEATURES, url = 'app.nods.tech', screenLabel = 'Panel NODS', screenIcon = 'layout-dashboard',
  screenSrc, page = '06', ...props
}) {
  return (
    <SlideFrame {...props}>
      <div style={{ flex: 1, display: 'flex', gap: '56px', alignItems: 'center' }}>
        <div style={{ flex: '0 0 37%', display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <Kicker>{kicker}</Kicker>
          <h3 style={{ margin: 0, fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-title)', lineHeight: 'var(--lh-title)', letterSpacing: 'var(--tracking-title)' }}>
            {title} <span style={{ color: 'var(--accent)' }}>{highlight}</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '4px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ width: '40px', height: '40px', flex: '0 0 40px', borderRadius: 'var(--radius-card-sm)', background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${f.icon}`} style={{ fontSize: '21px', color: 'var(--accent)' }} /></span>
                <div>
                  <h4 style={{ margin: '2px 0 3px', fontWeight: 'var(--fw-medium)', fontSize: '16px', color: 'var(--text)' }}>{f.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, border: 'var(--border-hairline)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'var(--surface)' }}>
          <div style={{ height: '44px', borderBottom: 'var(--border-hairline)', background: 'var(--gray-050)', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 18px' }}>
            <span style={{ display: 'flex', gap: '7px' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '999px', background: 'var(--gray-300)' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '999px', background: 'var(--gray-300)' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '999px', background: 'var(--gray-300)' }} />
            </span>
            <span style={{ flex: 1, height: '22px', borderRadius: '999px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '12px', color: 'var(--text-faint)' }}>{url}</span>
          </div>
          <PhotoFrame icon={screenIcon} label={screenLabel} src={screenSrc} style={{ height: '388px', borderRadius: 0 }} />
        </div>
      </div>
      <SlideFooter page={page} label="Producto" />
    </SlideFrame>
  );
}
