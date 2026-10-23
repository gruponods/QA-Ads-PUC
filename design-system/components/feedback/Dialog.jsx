import React from 'react';

/** Modal dialog: flat scrim, white 16px-radius panel with hairline border, no shadow. Esc closes. */
export function Dialog({ open = true, onClose, title, description, children, footer, width = 520, inline = false, style = {}, ...rest }) {
  React.useEffect(() => {
    if (!open || inline || !onClose) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, inline, onClose]);
  if (!open) return null;
  const panel = (
    <div role="dialog" aria-modal={!inline} style={{ width, maxWidth: '100%', boxSizing: 'border-box', background: 'var(--surface)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-card)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'var(--fw-bold)', lineHeight: 1.25, color: 'var(--text)' }}>{title}</h3>}
          {description && <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--text-muted)' }}>{description}</p>}
        </div>
        {onClose && (
          <button type="button" aria-label="Cerrar" onClick={onClose} style={{ width: 32, height: 32, flex: '0 0 32px', borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <i className="ti ti-x" style={{ fontSize: '20px' }} />
          </button>
        )}
      </div>
      {children}
      {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>{footer}</div>}
    </div>
  );
  if (inline) return panel;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '100%' }}>{panel}</div>
    </div>
  );
}
