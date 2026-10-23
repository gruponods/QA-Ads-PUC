import React from 'react';

/**
 * Placeholder for supporting imagery: a rounded, gray container with a centered
 * icon + label. Swap for a real <img> or drop-in <image-slot> in production.
 */
export function PhotoFrame({ label = 'Imagen', icon = 'photo', radius = 'var(--radius-photo)', src, alt = '', children, style = {}, ...rest }) {
  return (
    <div style={{ background: 'var(--gray-100)', borderRadius: radius, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--gray-400)', overflow: 'hidden', ...style }} {...rest}>
      {src
        ? <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : (children || <><i className={`ti ti-${icon}`} style={{ fontSize: '40px' }} /><span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span></>)}
    </div>
  );
}
