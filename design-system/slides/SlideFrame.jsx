import React from 'react';

/**
 * The 1280×720 slide canvas. Always white by default; `theme="navy"|"black"`
 * gives the 1–2 dark section dividers. Lays children out as a flex column so a
 * <SlideFooter/> can pin itself to the bottom with marginTop:auto.
 */
export function SlideFrame({ children, theme = 'light', padded = true, mark = true, style = {}, ...rest }) {
  const bg = theme === 'navy' ? 'var(--nods-blue-deep)' : theme === 'black' ? 'var(--ink)' : 'var(--white)';
  const fg = theme === 'light' ? 'var(--text)' : 'var(--text-on-dark)';
  return (
    <div
      style={{
        position: 'relative', width: '1280px', height: '720px', boxSizing: 'border-box',
        background: bg, color: fg, fontFamily: 'var(--font-sans)', overflow: 'hidden',
        padding: padded ? 'var(--slide-pad-y) var(--slide-pad-x)' : 0,
        display: 'flex', flexDirection: 'column', ...style,
      }}
      {...rest}
    >
      {mark && (
        <img
          src={theme === 'light' ? '../assets/logo-nods-blue.png' : '../assets/logo-nods-white.png'}
          alt="NODS — Technology for Education"
          style={{ position: 'absolute', top: '56px', right: 'var(--slide-pad-x)', height: '32px', width: 'auto', display: 'block', filter: theme === 'light' ? 'brightness(0)' : 'none', zIndex: 2 }}
        />
      )}
      {children}
    </div>
  );
}
