import React from 'react';

const TONES = { ok: 'var(--data-up)', warn: 'var(--data-warn)', risk: 'var(--data-down)', neutral: 'var(--gray-400)', accent: 'var(--accent)' };

/** Status indicator: 8px dot in a muted state color + ink label. Never a filled badge. */
export function StatusDot({ tone = 'ok', children, style = {}, ...rest }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap', ...style }} {...rest}>
      <span style={{ width: '8px', height: '8px', flex: '0 0 8px', borderRadius: '999px', background: TONES[tone] || TONES.ok }} />
      {children}
    </span>
  );
}
