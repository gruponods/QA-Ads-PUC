import React from 'react';
import { Kicker } from '../components/core/Kicker.jsx';

/** Shared slide header: kicker + title (with optional blue highlight) + subtitle. */
export function SlideHeading({ kicker, title, highlight, subtitle, theme = 'light', align = 'left', maxWidth = '44ch', style = {}, ...rest }) {
  const titleColor = theme === 'light' ? 'var(--text)' : '#fff';
  const subColor = theme === 'light' ? 'var(--text-muted)' : 'var(--text-on-dark-muted)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start', ...style }} {...rest}>
      {kicker && <Kicker color={theme === 'light' ? undefined : '#fff'}>{kicker}</Kicker>}
      {title && (
        <h3 style={{ margin: 0, fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-title)', lineHeight: 'var(--lh-title)', letterSpacing: 'var(--tracking-title)', color: titleColor, maxWidth }}>
          {title}{highlight && <> <span style={{ color: 'var(--accent)' }}>{highlight}</span></>}
        </h3>
      )}
      {subtitle && <p style={{ margin: 0, fontSize: '17px', lineHeight: 'var(--lh-body)', color: subColor, maxWidth: '54ch' }}>{subtitle}</p>}
    </div>
  );
}
