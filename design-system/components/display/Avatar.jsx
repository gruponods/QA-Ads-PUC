import React from 'react';

/** Circular avatar: photo, or initials on the soft-blue tint. */
export function Avatar({ name = '', src, size = 36, style = {}, ...rest }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span title={name} style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: '999px', overflow: 'hidden', background: 'var(--accent-soft)', color: 'var(--accent-strong)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)', fontSize: Math.round(size * 0.38), ...style }} {...rest}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}
