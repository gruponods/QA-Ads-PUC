import React from 'react';

const TONE = {
  bad: { fg: 'var(--data-down-fg)', soft: 'var(--data-down-soft)', icon: 'alert-circle' },
  warn: { fg: 'var(--data-warn-fg)', soft: 'var(--data-warn-soft)', icon: 'alert-triangle' },
  good: { fg: 'var(--data-up-fg)', soft: 'var(--data-up-soft)', icon: 'circle-check' },
};

export function thresholdTone(value, { warn, bad, good, higherIsBetter = true } = {}) {
  const worse = (v, t) => (higherIsBetter ? v < t : v > t);
  const better = (v, t) => (higherIsBetter ? v >= t : v <= t);
  if (bad !== undefined && worse(value, bad)) return 'bad';
  if (warn !== undefined && worse(value, warn)) return 'warn';
  if (good !== undefined && better(value, good)) return 'good';
  return null;
}

/** Conditional-format value: muted red/amber (and optionally green) by thresholds, with an icon. */
export function ThresholdValue({ value, warn, bad, good, higherIsBetter = true, format, suffix = '', variant = 'text', icon = true, style = {}, ...rest }) {
  const tone = thresholdTone(value, { warn, bad, good, higherIsBetter });
  const t = tone && TONE[tone];
  const txt = `${format ? format(value) : value}${suffix}`;
  const pill = variant === 'pill' && t;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: t ? 'var(--fw-bold)' : 'var(--fw-medium)', color: t ? t.fg : 'var(--text)', whiteSpace: 'nowrap', ...(pill ? { background: t.soft, padding: '4px 9px', borderRadius: '999px' } : {}), ...style }} {...rest}>
      {t && icon && <i className={`ti ti-${t.icon}`} style={{ fontSize: '15px' }} />}
      {txt}
    </span>
  );
}
