import React from 'react';

const DEFAULT_WORDS = ['creativity', 'benchmarks', 'advertising', 'sales', 'admissions', 'retention', 'web', 'email marketing', 'contact center', 'branding', 'marketing', 'education'];
const SIZES = { sm: { h: 24, fs: 10.5, pad: 12, gap: 9 }, md: { h: 30, fs: 12.5, pad: 14, gap: 11 } };

/**
 * "Technology for ___" brand tagline: words roll up inside a pill, accelerating,
 * and the last word lights up (blue border + tint + a shine sweep). Flat — no glow shadows.
 */
export function TaglineRoll({ words = DEFAULT_WORDS, label = 'Technology for', size = 'sm', loop = true, startDelay = 800, hold = 3600, style = {}, ...rest }) {
  const S = SIZES[size] || SIZES.sm;
  const last = words.length - 1;
  const [i, setI] = React.useState(0);
  const [dur, setDur] = React.useState(0.5);
  const [lit, setLit] = React.useState(false);
  const [snap, setSnap] = React.useState(false);

  React.useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setSnap(true); setI(last); setLit(true); return undefined; }
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    let n = 0;
    const step = () => {
      const prog = n / last;
      setSnap(false);
      setDur(0.5 - 0.37 * prog);
      setI(n);
      if (n < last) { n += 1; later(step, 620 - 460 * prog); return; }
      later(() => setLit(true), 540);
      if (loop) {
        later(() => {
          setLit(false); setSnap(true); setI(0); n = 0;
          later(step, 1000);
        }, hold);
      }
    };
    later(step, startDelay);
    return () => timers.forEach(clearTimeout);
  }, [words.join('|'), loop, startDelay, hold]);

  return (
    <span aria-label={`${label} ${words[last]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: S.gap, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <span aria-hidden="true" style={{ fontSize: S.fs, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
      <span aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', height: S.h, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', padding: `0 ${S.pad}px`, borderRadius: '999px', border: '1px solid', borderColor: lit ? 'var(--accent)' : 'var(--gray-300)', background: lit ? 'var(--accent-soft)' : 'transparent', transition: 'border-color .4s ease, background .4s ease' }}>
        <span style={{ overflow: 'hidden', height: S.h }}>
          <span style={{ display: 'flex', flexDirection: 'column', transform: `translateY(${-i * S.h}px)`, transition: snap ? 'none' : `transform ${dur.toFixed(3)}s cubic-bezier(.5,.04,.18,1)` }}>
            {words.map((w) => (
              <span key={w} style={{ height: S.h, display: 'flex', alignItems: 'center', fontSize: S.fs, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: lit ? 'var(--accent-strong)' : 'var(--accent)', transition: 'color .4s ease' }}>{w}</span>
            ))}
          </span>
        </span>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '999px', pointerEvents: 'none', background: 'linear-gradient(105deg, transparent 38%, rgba(25,70,227,.38) 50%, transparent 62%)', transform: `translateX(${lit ? '130%' : '-130%'})`, opacity: lit ? 1 : 0, transition: lit ? 'transform 1.15s ease-out' : 'none' }} />
      </span>
    </span>
  );
}
