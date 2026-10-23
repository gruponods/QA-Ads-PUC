import React from 'react';
import { SlideFrame } from './SlideFrame.jsx';
import { SlideFooter } from './SlideFooter.jsx';
import { PhotoFrame } from './PhotoFrame.jsx';
import { Kicker } from '../components/core/Kicker.jsx';
import { BigNumber } from '../components/data/BigNumber.jsx';
import { StatDelta } from '../components/data/StatDelta.jsx';

/** Big number + supporting photo (partial bleed). Giant blue metric, little text. */
export function MetricPhotoSlide({
  kicker = 'Impacto', prefix = '+', value = '128', suffix = '%',
  label = 'de crecimiento interanual en alumnos activos sobre la plataforma.',
  photoLabel = 'Estudiantes en aula', photoIcon = 'school', page = '06', ...props
}) {
  return (
    <SlideFrame padded={false} mark={false} {...props}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: '0 0 54%', padding: 'var(--slide-pad-y) 56px var(--slide-pad-y) var(--slide-pad-x)', display: 'flex', flexDirection: 'column' }}>
          <Kicker>{kicker}</Kicker>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
            <BigNumber prefix={prefix} value={value} suffix={suffix} label={label} delta={<StatDelta value="18 pts" direction="up" />} />
            <div style={{ display: 'flex', gap: '48px', borderTop: 'var(--border-hairline)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'var(--fw-bold)', fontSize: '28px', color: 'var(--text)' }}>3.2M</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>alumnos activos</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'var(--fw-bold)', fontSize: '28px', color: 'var(--text)' }}>+40</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>países</span>
              </div>
            </div>
          </div>
          <SlideFooter page={page} label="Impacto" showLogo />
        </div>
        <div style={{ flex: 1, padding: '28px 28px 28px 0' }}>
          <PhotoFrame label={photoLabel} icon={photoIcon} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </SlideFrame>
  );
}
