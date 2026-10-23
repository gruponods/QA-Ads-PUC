import React from 'react';

/** Footer bar for slides: NODS wordmark left, meta + page number right. */
export function SlideFooter({ label = 'nods.tech', page, theme = 'light', showLogo = false, logoSrc, style = {}, ...rest }) {
  const src = logoSrc || (theme === 'light' ? '../assets/logo-nods-blue.png' : '../assets/logo-nods-white.png');
  const line = theme === 'light' ? 'var(--border-hairline-color)' : 'rgba(255,255,255,0.16)';
  const muted = theme === 'light' ? 'var(--text-faint)' : 'var(--text-on-dark-muted)';
  const txt = { fontSize: '13px', color: muted, fontWeight: 'var(--fw-medium)', letterSpacing: '0.02em' };
  return (
    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {showLogo && <img src={src} alt="NODS — Technology for Education" style={{ height: '30px', width: 'auto', display: 'block' }} />}
        {label && <span style={txt}>{label}</span>}
      </div>
      {page && <span style={txt}>{page}</span>}
    </div>
  );
}
