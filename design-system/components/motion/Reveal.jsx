import React from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Entrance animation: fade + short rise when the element scrolls into view.
 * Stagger siblings with `index` (70ms apart). Respects prefers-reduced-motion.
 */
export function Reveal({ children, index = 0, delay = 0, y = 12, duration = 420, once = true, as = 'div', style = {}, ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(() => {
    if (shown && once) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return undefined; }
    const vis = () => { const r = el.getBoundingClientRect(); return r.top < (window.innerHeight || 800) && r.bottom > 0; };
    let raf = 0;
    if (vis()) raf = setTimeout(() => setShown(true), 30);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); if (once) io.disconnect(); } else if (!once) setShown(false);
    }, { threshold: 0.12 });
    io.observe(el);
    const safety = once ? setTimeout(() => setShown(true), 2500) : 0;
    return () => { io.disconnect(); clearTimeout(raf); clearTimeout(safety); };
  }, []);
  const d = delay + index * 70;
  const ease = 'cubic-bezier(.2,0,0,1)';
  const Comp = as;
  return (
    <Comp ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : `translateY(${y}px)`, transition: `opacity ${duration}ms ${ease} ${d}ms, transform ${duration}ms ${ease} ${d}ms`, ...style }} {...rest}>
      {children}
    </Comp>
  );
}
