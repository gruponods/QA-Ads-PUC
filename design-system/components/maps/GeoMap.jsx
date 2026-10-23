import React from 'react';
import { PatternSwatch } from '../data/PatternSwatch.jsx';

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
const W = 700;
let topoPromise = null;
function loadCountries() {
  if (!topoPromise) {
    topoPromise = fetch(TOPO_URL).then((r) => r.json()).then((t) => window.topojson.feature(t, t.objects.countries).features);
  }
  return topoPromise;
}

/** ISO 3166-1 numeric id → Spanish country name, for every country in the Americas. */
export const AMERICAS_ES = {
  '124': 'Canadá', '840': 'Estados Unidos', '484': 'México', '304': 'Groenlandia',
  '320': 'Guatemala', '084': 'Belice', '340': 'Honduras', '222': 'El Salvador', '558': 'Nicaragua', '188': 'Costa Rica', '591': 'Panamá',
  '192': 'Cuba', '332': 'Haití', '214': 'República Dominicana', '388': 'Jamaica', '044': 'Bahamas', '630': 'Puerto Rico', '780': 'Trinidad y Tobago',
  '170': 'Colombia', '862': 'Venezuela', '328': 'Guyana', '740': 'Surinam', '218': 'Ecuador', '604': 'Perú', '076': 'Brasil', '068': 'Bolivia',
  '600': 'Paraguay', '152': 'Chile', '032': 'Argentina', '858': 'Uruguay', '238': 'Islas Malvinas',
};
const SHORT = { '840': 'EE. UU.', '214': 'R. Dominicana', '780': 'Trinidad y T.', '238': 'Malvinas' };

const REGIONS = {
  americas: { rotate: [96, 0], box: [[-168, 76], [-30, -56]] },
  north: { rotate: [102, 0], box: [[-168, 76], [-52, 7]] },
  latam: { rotate: [76, 0], box: [[-118, 33], [-34, -56]] },
  central: { rotate: [80, 0], box: [[-118, 33], [-59, 7]] },
  south: { rotate: [60, 0], box: [[-82, 13], [-34, -56]] },
};
const RAMP = ['var(--map-1)', 'var(--map-2)', 'var(--map-3)', 'var(--map-4)', 'var(--map-5)'];

function boxGeom([[w, n], [e, s]]) {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const x = w + ((e - w) * i) / 12;
    const y = n + ((s - n) * i) / 12;
    pts.push([x, n], [x, s], [w, y], [e, y]);
  }
  return { type: 'MultiPoint', coordinates: pts };
}
function largestPolygon(f, d3) {
  const g = f.geometry;
  if (!g || g.type !== 'MultiPolygon') return f;
  let best = null; let area = -1;
  g.coordinates.forEach((c) => { const p = { type: 'Polygon', coordinates: c }; const a = d3.geoArea(p); if (a > area) { area = a; best = p; } });
  return best;
}
const compact = (v) => new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(v);

/**
 * Geographic map of the Americas built from real Natural Earth boundaries (d3-geo + TopoJSON).
 * mode="scale": sequential blue ramp by value. mode="category": blue patterns per category.
 * Requires window.d3 and window.topojson (pinned script tags on the page).
 */
export function GeoMap({
  region = 'americas', data = {}, mode = 'scale', categories = [], steps, labels = true, labelSize = 12,
  valueFormat, valueLabel = '', legendTitle, legend = true, selected, onSelect, names, style = {}, ...rest
}) {
  const [features, setFeatures] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [hover, setHover] = React.useState(null);
  const wrap = React.useRef(null);
  const [boxW, setBoxW] = React.useState(W);
  React.useEffect(() => {
    if (!wrap.current || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setBoxW(Math.max(1, e.contentRect.width)));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [features]);
  React.useLayoutEffect(() => {
    const w = wrap.current && wrap.current.clientWidth;
    if (w) setBoxW(w);
  }, [features]);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const ready = typeof window !== 'undefined' && !!window.d3 && !!window.topojson;
  const NAMES = React.useMemo(() => ({ ...AMERICAS_ES, ...(names || {}) }), [names]);

  React.useEffect(() => {
    if (!ready) return undefined;
    let live = true;
    loadCountries().then((f) => live && setFeatures(f)).catch((e) => live && setError(String(e)));
    return () => { live = false; };
  }, [ready]);

  const geo = React.useMemo(() => {
    if (!features) return null;
    const d3 = window.d3;
    const R = REGIONS[region] || REGIONS.americas;
    const box = boxGeom(R.box);
    const proj = d3.geoNaturalEarth1().rotate(R.rotate).fitWidth(W, box);
    const path = d3.geoPath(proj);
    const H = Math.ceil(path.bounds(box)[1][1]);
    const items = features.filter((f) => f.id !== '010').map((f) => {
      const d = path(f);
      if (!d) return null;
      const name = NAMES[f.id];
      let label = null;
      if (name) {
        const poly = largestPolygon(f, d3);
        const b = path.bounds(poly);
        const c = path.centroid(poly);
        const coords = poly.type === 'Feature' ? poly.geometry.coordinates : poly.coordinates;
        const ring = (coords && coords[0] ? coords[0] : []).map((p) => proj(p)).filter(Boolean);
        label = { x: c[0], y: c[1], w: b[1][0] - b[0][0], h: b[1][1] - b[0][1], bx: b[0][0], by: b[0][1], ring };
      }
      return { id: f.id, d, name, label };
    }).filter(Boolean);
    return { items, H };
  }, [features, region, NAMES]);
  const k = W / boxW;
  const fs = labelSize * k;
  const labelPos = React.useMemo(() => {
    if (!geo || !labels) return [];
    const out = [];
    geo.items.forEach((it) => {
      const L = it.label;
      if (!L || !L.ring.length) return;
      const text = SHORT[it.id] || it.name;
      const est = text.length * fs * 0.6 + 6 * k;
      if (L.w < est * 1.05 || L.h < fs * 1.4) return;
      const hw = est / 2; const hh = fs * 0.45;
      const fits = (x, y) => x - hw > 2 && x + hw < W - 2 && y - fs > 0 && y + fs < geo.H
        && [[0, 0], [-hw, 0], [hw, 0], [-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]].every(([dx, dy]) => window.d3.polygonContains(L.ring, [x + dx, y + dy]));
      let pos = fits(L.x, L.y) ? [L.x, L.y] : null;
      if (!pos) {
        let best = Infinity;
        for (let i = 1; i < 10; i++) for (let j = 1; j < 10; j++) {
          const x = L.bx + (i / 10) * L.w; const y = L.by + (j / 10) * L.h;
          const dist = (x - L.x) ** 2 + (y - L.y) ** 2;
          if (dist < best && fits(x, y)) { best = dist; pos = [x, y]; }
        }
      }
      if (pos) out.push({ id: it.id, text, x: pos[0], y: pos[1] });
    });
    return out;
  }, [geo, labels, fs, k]);

  const nums = Object.values(data).filter((v) => typeof v === 'number');
  const max = Math.max(1, ...nums);
  const thresholds = steps || [0.2, 0.4, 0.6, 0.8].map((t) => max * t);
  const bucket = (v) => { const i = thresholds.findIndex((t) => v <= t); return i === -1 ? 4 : i; };
  const fmt = (v) => (valueFormat ? valueFormat(v) : typeof v === 'number' ? v.toLocaleString('es-AR') : v);

  const fillOf = (id) => {
    if (!NAMES[id]) return { fill: 'var(--gray-100)', ctx: true };
    const v = data[id];
    if (v === undefined || v === null) return { fill: 'var(--gray-200)', empty: true };
    if (mode === 'category') {
      const cat = categories.find((c) => c.key === v);
      const p = (cat && cat.pattern) || 'solid';
      const fill = p === 'solid' ? 'var(--accent)' : p === 'tint' ? 'var(--accent-soft)' : `url(#${uid}-${p})`;
      return { fill, dark: p === 'solid', cat };
    }
    const i = bucket(v);
    return { fill: RAMP[i], dark: i >= 3 };
  };

  const move = (e, it) => {
    const r = wrap.current.getBoundingClientRect();
    setHover({ id: it.id, x: e.clientX - r.left, y: e.clientY - r.top, w: r.width });
  };

  const shell = { position: 'relative', fontFamily: 'var(--font-sans)', ...style };
  if (!ready) return <div style={{ ...shell, padding: '24px', border: 'var(--border-hairline)', borderRadius: 'var(--radius-card)', fontSize: '14px', color: 'var(--text-muted)' }} {...rest}>GeoMap necesita d3 y topojson-client cargados en la página.</div>;
  if (error) return <div style={{ ...shell, padding: '24px', fontSize: '14px', color: 'var(--data-down)' }} {...rest}>No se pudo cargar el mapa.</div>;
  if (!geo) return <div style={{ ...shell, aspectRatio: '7 / 8', borderRadius: 'var(--radius-card)', background: 'var(--gray-050)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'var(--text-faint)' }} {...rest}>Cargando mapa…</div>;

  const labelEls = labelPos.map((l) => {
    const dark = fillOf(l.id).dark;
    return (
      <text key={`l-${l.id}`} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 500, fill: 'var(--text)', stroke: 'var(--surface)', strokeWidth: 3 * k, paintOrder: 'stroke', strokeLinejoin: 'round', pointerEvents: 'none' }}>{l.text}</text>
    );
  });
  const hovered = hover && geo.items.find((it) => it.id === hover.id);
  const outline = [selected, hover && hover.id].filter(Boolean);
  const pat = (id, size, rotate, body) => (
    <pattern id={`${uid}-${id}`} patternUnits="userSpaceOnUse" width={size} height={size} patternTransform={rotate ? `rotate(${rotate})` : undefined}>
      <rect width={size} height={size} style={{ fill: 'var(--accent-soft)' }} />
      {body}
    </pattern>
  );

  return (
    <div ref={wrap} style={shell} {...rest}>
      <svg viewBox={`0 0 ${W} ${geo.H}`} role="img" aria-label="Mapa de América" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }} onMouseLeave={() => setHover(null)}>
        <defs>
          {pat('diagonal', 7, 45, <rect width="2.2" height="7" style={{ fill: 'var(--accent)' }} />)}
          {pat('dots', 6, 0, <circle cx="3" cy="3" r="1.6" style={{ fill: 'var(--accent)' }} />)}
          {pat('cross', 7, 45, <><rect width="1.6" height="7" style={{ fill: 'var(--accent)' }} /><rect width="7" height="1.6" style={{ fill: 'var(--accent)' }} /></>)}
          {pat('horizontal', 6, 0, <rect width="6" height="2" style={{ fill: 'var(--accent)' }} />)}
        </defs>
        <g>
          {geo.items.map((it) => {
            const f = fillOf(it.id);
            const interactive = !f.ctx;
            return (
              <path key={it.id} d={it.d}
                onMouseMove={interactive ? (e) => move(e, it) : () => setHover(null)}
                onClick={interactive && onSelect ? () => onSelect(it.id) : undefined}
                vectorEffect="non-scaling-stroke" style={{ fill: f.fill, stroke: 'var(--surface)', strokeWidth: 1, strokeLinejoin: 'round', cursor: interactive && onSelect ? 'pointer' : 'default', transition: 'fill .15s ease' }} />
            );
          })}
        </g>
        {geo.items.filter((it) => outline.includes(it.id)).map((it) => (
          <path key={`o-${it.id}`} d={it.d} vectorEffect="non-scaling-stroke" style={{ fill: 'none', stroke: 'var(--ink)', strokeWidth: it.id === selected ? 2 : 1.4, strokeLinejoin: 'round', pointerEvents: 'none' }} />
        ))}
        {labelEls}
      </svg>
      {hovered && (() => {
        const f = fillOf(hovered.id);
        const v = data[hovered.id];
        const left = hover.x > hover.w - 200 ? hover.x - 14 : hover.x + 14;
        return (
          <div style={{ position: 'absolute', left, top: hover.y + 14, transform: hover.x > hover.w - 200 ? 'translateX(-100%)' : 'none', zIndex: 5, pointerEvents: 'none', background: 'var(--surface)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-card-sm)', padding: '10px 12px', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{hovered.name}</span>
            {f.empty ? <span style={{ fontSize: '13px', color: 'var(--text-faint)' }}>Sin datos</span>
              : mode === 'category' ? <PatternSwatch pattern={(f.cat && f.cat.pattern) || 'solid'} label={(f.cat && f.cat.label) || v} />
                : <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}><b style={{ fontWeight: 500, color: 'var(--accent)' }}>{fmt(v)}</b> {valueLabel}</span>}
          </div>
        );
      })()}
      {legend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {legendTitle && <span style={{ fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>{legendTitle}</span>}
          {mode === 'category'
            ? categories.map((c) => <PatternSwatch key={c.key} pattern={c.pattern || 'solid'} label={c.label} style={{ whiteSpace: 'nowrap' }} />)
            : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <span>{compact(0)}</span>
                <span style={{ display: 'inline-flex' }}>{RAMP.map((c, i) => <span key={i} style={{ width: '28px', height: '10px', background: c, borderRadius: i === 0 ? '999px 0 0 999px' : i === 4 ? '0 999px 999px 0' : 0 }} />)}</span>
                <span>{compact(steps ? thresholds[thresholds.length - 1] : max)}+</span>
              </span>
            )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}><span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--gray-200)' }} />Sin datos</span>
        </div>
      )}
    </div>
  );
}
