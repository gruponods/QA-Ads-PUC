import React from 'react';

const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json';
let dotsCache = null;
function loadDots(step) {
  if (!dotsCache) {
    dotsCache = fetch(LAND_URL).then((r) => r.json()).then((t) => {
      const land = window.topojson.feature(t, t.objects.land);
      const pts = [];
      for (let lat = -58; lat <= 82; lat += step) {
        const k = Math.max(0.15, Math.cos((lat * Math.PI) / 180));
        const s = step / k;
        for (let lon = -180; lon < 180; lon += s) if (window.d3.geoContains(land, [lon, lat])) pts.push([lon, lat]);
      }
      return pts;
    });
  }
  return dotsCache;
}

const DEFAULT_MARKERS = [[-58.38, -34.6], [-99.13, 19.43], [-74.07, 4.71], [-70.65, -33.45], [-77.04, -12.05], [-46.63, -23.55], [-56.16, -34.9]];
const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Dotted globe from real land geometry (Natural Earth 110m), orthographic, centered on the Americas.
 * Calm motion: slow sway (not a spin), depth-faded dots, soft pulsing markers. Canvas, theme-aware.
 * Requires window.d3 + window.topojson (same pinned tags as GeoMap).
 */
export function DotGlobe({ size = 420, markers = DEFAULT_MARKERS, center = [-66, -8], sway = 26, speed = 1, dotStep = 2.4, dotSize = 1.25, outline = true, style = {}, ...rest }) {
  const wrap = React.useRef(null);
  const cvs = React.useRef(null);
  const [dots, setDots] = React.useState(null);
  const ready = typeof window !== 'undefined' && !!window.d3 && !!window.topojson;

  React.useEffect(() => { if (!ready) return undefined; let live = true; loadDots(dotStep).then((p) => live && setDots(p)); return () => { live = false; }; }, [ready]);

  React.useEffect(() => {
    if (!dots || !cvs.current) return undefined;
    const d3 = window.d3; const c = cvs.current; const ctx = c.getContext('2d');
    const css = getComputedStyle(wrap.current);
    const col = (v, f) => (css.getPropertyValue(v) || '').trim() || f;
    const ink = col('--text-faint', '#9CA3AF'); const accent = col('--accent', '#1946E3'); const line = col('--gray-200', '#E5E7EB');
    let w = 0; let dpr = 1; let raf = 0; let visible = true; const t0 = performance.now();
    const proj = d3.geoOrthographic().clipAngle(90);
    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(80, Math.min(size, wrap.current.clientWidth || size));
      c.width = w * dpr; c.height = w * dpr; c.style.width = `${w}px`; c.style.height = `${w}px`;
      proj.translate([w / 2, w / 2]).scale(w / 2 - 2);
    };
    const draw = (now) => {
      const t = (now - t0) / 1000;
      const lam = center[0] + (reduced() ? 0 : Math.sin(t * 0.18 * speed) * sway);
      const phi = center[1] + (reduced() ? 0 : Math.sin(t * 0.11 * speed) * 4);
      proj.rotate([-lam, -phi]);
      const vc = [lam, phi];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, w);
      if (outline) { ctx.beginPath(); ctx.arc(w / 2, w / 2, w / 2 - 2, 0, Math.PI * 2); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = ink;
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        const dist = d3.geoDistance(p, vc);
        if (dist > 1.53) continue;
        const k = Math.cos(dist);
        const xy = proj(p);
        ctx.globalAlpha = 0.18 + 0.62 * k;
        ctx.beginPath(); ctx.arc(xy[0], xy[1], dotSize * (0.55 + 0.45 * k) * (w / 420 + 0.35), 0, Math.PI * 2); ctx.fill();
      }
      markers.forEach((m, i) => {
        const dist = d3.geoDistance(m, vc);
        if (dist > 1.45) return;
        const k = Math.cos(dist); const xy = proj(m);
        const ph = ((t * 0.5 + i * 0.37) % 1);
        if (!reduced()) { ctx.globalAlpha = (1 - ph) * 0.35 * k; ctx.strokeStyle = accent; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(xy[0], xy[1], 3 + ph * 11, 0, Math.PI * 2); ctx.stroke(); }
        ctx.globalAlpha = 0.5 + 0.5 * k; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(xy[0], xy[1], 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = ink;
      });
      ctx.globalAlpha = 1;
      if (!reduced() && visible) raf = requestAnimationFrame(draw);
    };
    fit(); draw(performance.now());
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { fit(); if (reduced()) draw(performance.now()); }) : null;
    ro && ro.observe(wrap.current);
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was && !reduced()) raf = requestAnimationFrame(draw); }) : null;
    io && io.observe(wrap.current);
    return () => { cancelAnimationFrame(raf); ro && ro.disconnect(); io && io.disconnect(); };
  }, [dots, size, sway, speed, dotSize, outline]);

  return (
    <div ref={wrap} style={{ width: '100%', maxWidth: size, aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }} {...rest}>
      {dots ? <canvas ref={cvs} role="img" aria-label="Globo con presencia de NODS en América" style={{ display: 'block' }} />
        : <span style={{ width: '70%', aspectRatio: '1 / 1', borderRadius: '999px', border: 'var(--border-hairline)' }} />}
    </div>
  );
}
