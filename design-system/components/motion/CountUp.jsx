import React from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Number that counts up (ease-out) when it enters the viewport, and tweens when value changes. */
export function CountUp({ value = 0, from = 0, duration = 900, decimals = 0, format, style = {}, ...rest }) {
  const ref = React.useRef(null);
  const shownRef = React.useRef(reduced() ? value : from);
  const [shown, setShown] = React.useState(shownRef.current);
  const [inView, setInView] = React.useState(reduced());

  React.useEffect(() => {
    if (inView) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return undefined; }
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) && r.bottom > 0) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    const safety = setTimeout(() => setInView(true), 2500);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, []);

  React.useEffect(() => {
    if (!inView) return undefined;
    if (reduced()) { shownRef.current = value; setShown(value); return undefined; }
    const start = shownRef.current;
    const t0 = Date.now();
    let timer;
    const tick = () => {
      const t = Math.min(1, (Date.now() - t0) / duration);
      const v = start + (value - start) * (1 - Math.pow(1 - t, 3));
      shownRef.current = v; setShown(v);
      if (t < 1) timer = setTimeout(tick, 16);
    };
    timer = setTimeout(tick, 16);
    return () => clearTimeout(timer);
  }, [value, inView]);

  const txt = format ? format(shown) : shown.toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums', ...style }} {...rest}>{txt}</span>;
}
