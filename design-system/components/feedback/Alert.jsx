import React from 'react';

const TONES = {
  info: { icon: 'info-circle', color: 'var(--accent)' },
  success: { icon: 'circle-check', color: 'var(--data-up)' },
  warning: { icon: 'alert-triangle', color: 'var(--data-warn)' },
  error: { icon: 'alert-circle', color: 'var(--data-down)' },
};

/** Inline message / toast body: white card, hairline border, tone carried by the icon only. */
export function Alert({ tone = 'info', title, children, icon, action, onClose, style = {}, ...rest }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: 'var(--surface)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-card-sm)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <i className={`ti ti-${icon || t.icon}`} style={{ fontSize: '20px', color: t.color, marginTop: '1px' }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {title && <span style={{ fontSize: '15px', fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>{title}</span>}
        {children && <span style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-muted)' }}>{children}</span>}
        {action && <div style={{ marginTop: '8px' }}>{action}</div>}
      </div>
      {onClose && (
        <button type="button" aria-label="Cerrar" onClick={onClose} style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'var(--text-faint)', display: 'inline-flex' }}>
          <i className="ti ti-x" style={{ fontSize: '18px' }} />
        </button>
      )}
    </div>
  );
}
