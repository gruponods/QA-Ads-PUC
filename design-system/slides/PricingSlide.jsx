import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { SlideHeading } from './SlideHeading.jsx';
import { Button } from '../components/core/Button.jsx';

const TIERS = [
  { name: 'Esencial', price: '$2', unit: '/alumno · mes', desc: 'Para empezar a digitalizar el aula.', features: ['Biblioteca de contenidos', 'Aula digital', 'Soporte por email'], cta: 'Empezar', featured: false },
  { name: 'Institución', price: '$4', unit: '/alumno · mes', desc: 'La opción de la mayoría de las escuelas.', features: ['Todo lo de Esencial', 'Analíticas en vivo', 'Capacitación docente', 'Soporte prioritario'], cta: 'Agendar demo', featured: true },
  { name: 'Red', price: 'A medida', unit: '', desc: 'Para redes y ministerios.', features: ['Todo lo de Institución', 'Asistente con IA + API', 'Integraciones a medida', 'Gestor dedicado'], cta: 'Hablar con ventas', featured: false },
];

/** Pricing: three tiers as flat cards, the recommended plan outlined in blue. */
export function PricingSlide({
  kicker = 'Planes', title = 'Un plan para cada', highlight = 'institución',
  tiers = TIERS, page = '11', ...props
}) {
  return (
    <SlideFrame {...props}>
      <SlideHeading kicker={kicker} title={title} highlight={highlight} />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${tiers.length}, 1fr)`, gap: '20px', alignItems: 'stretch', marginTop: '30px', paddingBottom: '4px' }}>
        {tiers.map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '18px', background: 'var(--surface)', border: t.featured ? '1.5px solid var(--accent)' : 'var(--border-hairline)', borderRadius: 'var(--radius-card)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'var(--fw-medium)', fontSize: '18px', color: 'var(--text)' }}>{t.name}</span>
              {t.featured && <span style={{ fontSize: '11px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', background: 'var(--accent)', padding: '5px 10px', borderRadius: 'var(--radius-pill)' }}>Recomendado</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontWeight: 'var(--fw-bold)', fontSize: '44px', lineHeight: 1, letterSpacing: '-0.02em', color: t.featured ? 'var(--accent)' : 'var(--text)' }}>{t.price}</span>
              {t.unit && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t.unit}</span>}
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 'var(--lh-body)', color: 'var(--text-muted)' }}>{t.desc}</p>
            <div style={{ borderTop: 'var(--border-hairline)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {t.features.map((f, j) => (
                <span key={j} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', fontSize: '14px', lineHeight: 1.4, color: 'var(--text)' }}>
                  <i className="ti ti-check" style={{ fontSize: '16px', color: 'var(--accent)', position: 'relative', top: '2px' }} />{f}
                </span>
              ))}
            </div>
            <Button variant={t.featured ? 'primary' : 'secondary'} size="sm" style={{ marginTop: 'auto', width: '100%' }}>{t.cta}</Button>
          </div>
        ))}
      </div>
      <SlideFooter page={page} label="Planes" />
    </SlideFrame>
  );
}
