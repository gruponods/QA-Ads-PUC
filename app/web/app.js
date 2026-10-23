/* Tablero QA Meta Ads — Ingeniería UC (campañas 2027) */
(() => {
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clp = (n) => '$' + Math.round(n || 0).toLocaleString('es-CL');

const PAGES = [
  { id: 'resumen', label: 'Resumen', icon: 'layout-dashboard' },
  { id: 'programas', label: 'Programas', icon: 'school' },
  { id: 'anuncios', label: 'Anuncios', icon: 'photo' },
  { id: 'mejoras', label: 'Mejoras automáticas', icon: 'wand' },
  { id: 'alertas', label: 'Alertas', icon: 'alert-triangle' },
];
const CONTROLS = [
  { key: 'Programas', icon: 'school', title: 'Programas en pauta', desc: 'Lo activo en Meta contra Estructura 2027 (Pauta Activa) y Creatividad 2027 (Implementado).' },
  { key: 'País', icon: 'world', title: 'País', desc: 'Los conjuntos de anuncios segmentan los países tildados en Estructura (Chile / Perú).' },
  { key: 'Copy', icon: 'align-left', title: 'Copy', desc: 'El texto de cada versión es el de Creatividad 2027.' },
  { key: 'Descuento', icon: 'discount', title: 'Descuento', desc: 'El copy menciona el descuento vigente y el plazo no está vencido.' },
  { key: 'URL', icon: 'link', title: 'URL y UTM', desc: 'Landing, ref y UTMs como en Creatividad 2027; la landing responde.' },
  { key: 'Pieza', icon: 'photo-scan', title: 'Pieza: programa y precio', desc: 'La IA lee la pieza: que sea del programa y que el precio sea el del sheet.' },
  { key: 'Ubicaciones', icon: 'layout-columns', title: 'Ubicaciones', desc: 'Stories/Reels y Feed muestran el mismo programa, con el mismo copy y la misma landing.' },
  { key: 'Mejoras automáticas', icon: 'wand', title: 'Mejoras automáticas', desc: 'Anuncios con mejoras de Meta activadas que hay que quitar.' },
  { key: 'Alertas', icon: 'alert-triangle', title: 'Alertas', desc: 'Sin gasto, sin pieza vertical, fechas pasadas, anuncios rechazados.' },
];
const CHECK_COLS = [
  ['programa', 'Programa'], ['pais', 'País'], ['copy', 'Copy'], ['descuento', 'Dcto.'],
  ['url', 'URL'], ['pieza', 'Pieza'], ['ubicaciones', 'Ubic.'], ['mejoras', 'Mejoras'],
];
const visionRead = () => (R.vision && R.vision.leidas) || 0;
const visionPending = () => (R.vision && R.vision.pendientes) || 0;
const pendingBanner = () => visionPending() ? `<div class="banner"><i class="ti ti-photo-scan"></i><div><b>${visionPending()} piezas pendientes de lectura</b> (precio y programa sobre la imagen o el video). Se leen en la actualización diaria automática; ${visionRead()} ya están leídas.</div></div>` : '';
const STATUS_LABEL = { ok: 'OK', warn: 'Revisar', error: 'Error', na: 'Sin datos' };

let R = null;
const st = { page: location.hash.slice(1) || 'resumen', control: '', sigla: '', q: '', mode: 'activos' };

// ------------------------------------------------------------ helpers de UI
function toast(msg, icon = 'check') {
  const t = $('#toast');
  t.innerHTML = `<i class="ti ti-${icon}" style="color:var(--accent);font-size:20px"></i><span>${esc(msg)}</span>`;
  t.hidden = false;
  clearTimeout(t._h);
  t._h = setTimeout(() => { t.hidden = true; }, 3200);
}
const idCell = (id) => id ? `<span class="id">${esc(id)}<button class="icon-btn" data-copy="${esc(id)}" title="Copiar ID"><i class="ti ti-copy"></i></button></span>` : '<span class="faint">—</span>';
const openBtn = (link) => link ? `<a class="btn btn-sm" href="${esc(link)}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="ti ti-external-link"></i>Abrir</a>` : '';
const dot = (sev, label) => `<span class="dot ${sev}">${esc(label ?? STATUS_LABEL[sev] ?? sev)}</span>`;
const checkIcon = (v) => {
  const s = v || 'na';
  const icon = { ok: 'circle-check', warn: 'alert-circle', error: 'circle-x', na: 'minus' }[s];
  return `<span class="check ${s}" title="${STATUS_LABEL[s]}"><i class="ti ti-${icon}"></i></span>`;
};
const adsById = () => Object.fromEntries(R.anuncios.map((a) => [a.id, a]));
const progBySigla = () => Object.fromEntries(R.programas.map((p) => [p.sigla, p]));
const activeAds = () => R.anuncios.filter((a) => a.estado === 'ACTIVE');
const issuesOf = (ctrl) => R.issues.filter((i) => i.control === ctrl);
const errAdIds = () => new Set(R.issues.filter((i) => i.severidad === 'error' && i.ad_id).map((i) => i.ad_id));
const pageHead = (kicker, title, subtitle, actions = '') =>
  `<div class="page-head"><div><div class="kicker">${kicker}</div><h1>${title}</h1>${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}</div>${actions}</div>`;

function go(page, opts = {}) {
  Object.assign(st, { control: '', sigla: '', q: '' }, opts, { page });
  location.hash = page;
  render();
  window.scrollTo(0, 0);
}

// ------------------------------------------------------------ diff de palabras (LCS)
function wordDiff(a, b) {
  const A = (a || '').split(/(\s+)/), B = (b || '').split(/(\s+)/);
  const n = A.length, m = B.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0, left = '', right = '';
  while (i < n && j < m) {
    if (A[i] === B[j]) { left += esc(A[i]); right += esc(B[j]); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { left += /\S/.test(A[i]) ? `<del>${esc(A[i])}</del>` : esc(A[i]); i++; }
    else { right += /\S/.test(B[j]) ? `<ins>${esc(B[j])}</ins>` : esc(B[j]); j++; }
  }
  for (; i < n; i++) left += /\S/.test(A[i]) ? `<del>${esc(A[i])}</del>` : esc(A[i]);
  for (; j < m; j++) right += /\S/.test(B[j]) ? `<ins>${esc(B[j])}</ins>` : esc(B[j]);
  return [left, right];
}

// ------------------------------------------------------------ tabla de observaciones
function issuesTable(list, { showControl = true } = {}) {
  if (!list.length) return `<div class="table-wrap"><div class="empty"><i class="ti ti-circle-check" style="font-size:28px;color:var(--data-up)"></i><br>Sin observaciones.</div></div>`;
  const ads = adsById();
  const rows = list.map((i) => {
    const ad = ads[i.ad_id];
    const img = ad?.variantes?.find((v) => v.local_img)?.local_img;
    return `<tr class="${i.ad_id ? 'clickable' : ''} tone-${i.severidad}" data-ad="${esc(i.ad_id)}">
      <td>${dot(i.severidad)}</td>
      ${showControl ? `<td>${esc(i.control)}</td>` : ''}
      <td>${img ? `<img class="thumb" src="/${esc(img)}" alt="" loading="lazy">` : ''}</td>
      <td>${idCell(i.ad_id || i.campaign_id)}${i.campaign_id ? '<div><span class="tag">Campaña</span></div>' : ''}</td>
      <td><div class="ad-name">${esc(i.ad_name || i.campaign_name || '—')}</div><div class="faint" style="font-size:12px">${esc(i.sigla)}</div></td>
      <td class="detail">${esc(i.detalle)}</td>
      <td class="num">${i.ad_id ? clp(i.gasto7d) : ''}</td>
      <td>${openBtn(i.link)}</td></tr>`;
  }).join('');
  return `<div class="table-wrap"><table><thead><tr><th>Estado</th>${showControl ? '<th>Control</th>' : ''}<th></th><th>ID</th><th>Anuncio / campaña</th><th>Detalle</th><th class="num">Gasto 7d</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
const sevOrder = { error: 0, warn: 1 };
const sortIssues = (l) => [...l].sort((a, b) => (sevOrder[a.severidad] - sevOrder[b.severidad]) || (b.gasto7d - a.gasto7d));

// ------------------------------------------------------------ páginas
const SEV_RANK = { error: 2, warn: 1, ok: 0 };
const ring = (pct, size = 140) => {
  const r = size / 2 - 12, c = 2 * Math.PI * r, band = pct >= 80 ? 'ok' : pct >= 50 ? 'warn' : 'error';
  return `<svg class="ring ${band}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${pct}%">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-track"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-val" stroke-dasharray="${c * pct / 100} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="50%" class="ring-num" dominant-baseline="central" text-anchor="middle">${pct}%</text></svg>`;
};
const MATRIX_COLS = CONTROLS.map((c) => c.key);
const MATRIX_SHORT = { Programas: 'Programa', 'País': 'País', Copy: 'Copy', Descuento: 'Dcto.', URL: 'URL', Pieza: 'Pieza', Ubicaciones: 'Ubic.', 'Mejoras automáticas': 'Mejoras', Alertas: 'Alertas' };

function pageResumen() {
  const act = activeAds();
  const debe = R.programas.filter((p) => p.debe_correr);
  const okProg = debe.filter((p) => p.estado === 'ok').length;
  const errIds = errAdIds();
  const adsErr = act.filter((a) => errIds.has(a.id));
  const pctOk = act.length ? Math.round(100 * (act.length - adsErr.length) / act.length) : 0;

  // Barras: anuncios afectados por control (con error / solo para revisar)
  const bars = CONTROLS.map((c) => {
    const l = issuesOf(c.key);
    const errAds = new Set(l.filter((i) => i.severidad === 'error').map((i) => i.ad_id || i.campaign_id || i.sigla));
    const warnAds = new Set(l.filter((i) => i.severidad === 'warn').map((i) => i.ad_id || i.campaign_id || i.sigla).filter((x) => !errAds.has(x)));
    return { c, e: errAds.size, w: warnAds.size };
  });
  const maxBar = Math.max(1, ...bars.map((b) => b.e + b.w));
  const barRows = bars.map(({ c, e, w }) => {
    const unit = c.key === 'Programas' ? 'campaña' : 'anuncio';
    const total = e + w;
    const tipTxt = `${c.title}: ${e} con error, ${w} para revisar. ${c.desc}`;
    return `<div class="bar-row" data-control="${esc(c.key)}" data-tip="${esc(tipTxt)}">
      <div class="bar-label"><i class="ti ti-${c.icon}"></i>${esc(c.title)}</div>
      <div class="bar-track">${e ? `<span class="bar-seg error" style="width:${100 * e / maxBar}%"></span>` : ''}${w ? `<span class="bar-seg warn" style="width:${100 * w / maxBar}%"></span>` : ''}
        <span class="bar-value">${total ? `${total} ${unit}${total > 1 ? 's' : ''}` : '<span class="check ok"><i class="ti ti-circle-check"></i></span>Todo OK'}</span></div></div>`;
  }).join('');

  // Programas con más errores
  const bySig = {};
  R.issues.forEach((i) => { if (i.severidad === 'error' && i.sigla) bySig[i.sigla] = (bySig[i.sigla] || 0) + 1; });
  const topProg = Object.entries(bySig).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxP = Math.max(1, ...topProg.map(([, n]) => n));
  const progName = Object.fromEntries(R.programas.map((p) => [p.sigla, p.programa]));
  const progRows = topProg.map(([sig, n]) => `<div class="bar-row" data-sigla-go="${esc(sig)}" data-tip="${esc(progName[sig] || sig)}: ${n} errores">
      <div class="bar-label"><b>${esc(sig)}</b></div>
      <div class="bar-track"><span class="bar-seg error" style="width:${100 * n / maxP}%"></span><span class="bar-value">${n}</span></div></div>`).join('');

  // Matriz programa × control: peor severidad por celda
  const cell = {};
  R.issues.forEach((i) => {
    if (!i.sigla) return;
    const k = i.sigla + '|' + i.control;
    if (!cell[k]) cell[k] = { sev: i.severidad, n: 0 };
    if (SEV_RANK[i.severidad] > SEV_RANK[cell[k].sev]) cell[k].sev = i.severidad;
    cell[k].n++;
  });
  const progs = R.programas.filter((p) => p.debe_correr || p.anuncios)
    .sort((a, b) => (bySig[b.sigla] || 0) - (bySig[a.sigla] || 0) || a.sigla.localeCompare(b.sigla));
  const matrix = progs.map((p) => `<tr data-sigla="${esc(p.sigla)}" class="clickable">
      <th class="m-row" data-tip="${esc(p.programa)}">${esc(p.sigla)}</th>
      ${MATRIX_COLS.map((k) => {
        const v = cell[p.sigla + '|' + k];
        const na = !p.anuncios && k !== 'Programas';
        const sev = v ? v.sev : na ? 'na' : 'ok';
        const icon = { ok: 'check', warn: 'alert-circle', error: 'x', na: 'minus' }[sev];
        const tipTxt = `${p.sigla} · ${MATRIX_SHORT[k]}: ${v ? `${v.n} observación${v.n > 1 ? 'es' : ''}` : na ? 'sin anuncios activos' : 'OK'}`;
        return `<td><span class="m-cell ${sev}" data-tip="${esc(tipTxt)}"><i class="ti ti-${icon}"></i></span></td>`;
      }).join('')}</tr>`).join('');

  const top = sortIssues(R.issues.filter((i) => i.severidad === 'error'));
  const shown = st.verTodo ? top : top.slice(0, 10);
  return `${pageHead('Control de calidad · Campañas 2027', `Anuncios de Ingeniería UC: <em>${top.length ? 'para corregir' : 'en orden'}</em>.`,
    `Cruce de los anuncios de Meta con Estructura 2027 y Creatividad 2027. Descuento vigente: ${esc(R.descuento_vigente)}%.`)}
    ${pendingBanner()}
    <div class="hero-row">
      <div class="card hero-card">${ring(pctOk)}<div><div class="kpi-label">Anuncios activos sin errores</div>
        <div class="hero-sub"><b>${act.length - adsErr.length}</b> de ${act.length} anuncios están en orden.</div>
        <div class="legend"><span class="dot ok">80% o más</span><span class="dot warn">50–79%</span><span class="dot error">Menos de 50%</span></div></div></div>
      <div class="stat-col">
        <div class="card stat"><div class="kpi-label">Programas en pauta</div><div class="kpi-value">${okProg}<small> / ${debe.length}</small></div>
          <div class="mini-track"><span style="width:${debe.length ? 100 * okProg / debe.length : 0}%"></span></div>
          ${(() => {
            const cp = R.programas.filter((p) => p.estado === 'creatividad_pendiente').length;
            const su = R.programas.filter((p) => p.estado === 'sin_landing').length;
            const txt = [cp && `${cp} con creatividad pendiente`, su && `${su} esperando URL de landing`].filter(Boolean).join(' · ');
            return txt ? `<div class="kpi-foot" style="margin-top:6px">Sin pauta: ${txt}</div>` : '';
          })()}</div>
        <div class="card stat"><div class="kpi-label">Anuncios con errores</div><div class="kpi-value">${adsErr.length}<small> / ${act.length}</small></div>
          <div class="kpi-foot">${R.anuncios.length - act.length} pausados no se auditan</div></div>
        <div class="card stat"><div class="kpi-label">Piezas leídas</div><div class="kpi-value">${visionRead()}</div>
          <div class="kpi-foot">${visionPending() ? `${visionPending()} pendientes` : 'Imágenes y videos al día'}</div></div>
      </div>
    </div>
    <div class="charts-row">
      <div class="card"><div class="section-head"><h2>Observaciones por control</h2>
        <div class="legend"><span class="dot error">Con error</span><span class="dot warn">Para revisar</span></div></div>
        <div class="bars">${barRows}</div></div>
      <div class="card"><div class="section-head"><h2>Programas con más errores</h2></div>
        <div class="bars">${progRows || '<div class="empty">Sin errores por programa.</div>'}</div></div>
    </div>
    <div class="section"><div class="section-head"><h2>Programa × control</h2>
      <div class="legend"><span class="m-cell ok sm"><i class="ti ti-check"></i></span>OK <span class="m-cell warn sm"><i class="ti ti-alert-circle"></i></span>Revisar <span class="m-cell error sm"><i class="ti ti-x"></i></span>Error <span class="m-cell na sm"><i class="ti ti-minus"></i></span>Sin anuncios activos</div></div>
      <div class="table-wrap"><table class="matrix"><thead><tr><th></th>${MATRIX_COLS.map((k) => `<th>${esc(MATRIX_SHORT[k])}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></div>
    <div class="section"><div class="section-head"><h2>Para corregir</h2><span class="muted" style="font-size:14px">${top.length} errores</span></div>
      ${issuesTable(shown)}
      ${top.length > 10 ? `<div style="margin-top:14px;text-align:center"><button class="btn" data-ver-todo="1">${st.verTodo ? 'Ver solo los 10 primeros' : `Ver los ${top.length} errores`}</button></div>` : ''}</div>`;
}

function pageControl() {
  const c = CONTROLS.find((x) => x.key === st.control);
  const l = sortIssues(issuesOf(st.control));
  return `${pageHead('Control', esc(c.title) + '.', esc(c.desc), `<button class="btn" data-go="resumen"><i class="ti ti-arrow-left"></i>Volver al resumen</button>`)}
    ${['Pieza', 'Ubicaciones'].includes(st.control) ? pendingBanner() : ''}
    ${issuesTable(l, { showControl: false })}`;
}

function pageProgramas() {
  const order = { sin_anuncios: 0, pausado: 1, sobra: 2, creatividad_pendiente: 3, sin_landing: 4, ok: 5 };
  const rows = [...R.programas].sort((a, b) => (order[a.estado] - order[b.estado]) || a.sigla.localeCompare(b.sigla));
  const errBySigla = {};
  R.issues.forEach((i) => { if (i.severidad === 'error' && i.sigla) errBySigla[i.sigla] = (errBySigla[i.sigla] || 0) + 1; });
  const label = { ok: ['ok', 'En pauta'], pausado: ['error', 'Pausado'], sin_anuncios: ['error', 'Sin anuncios'], sobra: ['error', 'No debería estar activo'], sin_landing: ['off', 'Esperando URL'], creatividad_pendiente: ['warn', 'Creatividad pendiente'] };
  const body = rows.map((p) => {
    const [sev, txt] = label[p.estado];
    const paisOk = p.paises.every((c) => p.paises_meta.includes(c)) && p.paises_meta.every((c) => p.paises.includes(c));
    return `<tr class="clickable tone-${sev === 'error' ? 'error' : ''}" data-sigla="${esc(p.sigla)}" ${p.estado === 'sin_landing' ? 'data-tip="Sin landing en Estructura 2027: todavía no compartieron la URL, no se puede activar."'
      : p.estado === 'creatividad_pendiente' ? 'data-tip="Pauta Activa y con landing, pero la creatividad todavía no está Implementada en Creatividad 2027."' : ''}>
      <td>${dot(sev, txt)}</td><td><b>${esc(p.sigla)}</b></td><td>${esc(p.programa)}</td>
      <td>${p.inicio ? esc(p.inicio.split('-').reverse().join('/')) : '—'}</td>
      <td>${esc(p.paises.join(' · ') || '—')}</td>
      <td>${p.anuncios ? `${dot(paisOk ? 'ok' : 'error', p.paises_meta.join(' · ') || '—')}` : '<span class="faint">—</span>'}</td>
      <td class="num">${p.anuncios}<span class="faint"> / ${p.anuncios_total}</span></td>
      <td class="num">${clp(p.gasto7d)}</td>
      <td class="num">${errBySigla[p.sigla] ? `<span class="check error">${errBySigla[p.sigla]}</span>` : '<span class="check ok"><i class="ti ti-circle-check"></i></span>'}</td></tr>`;
  }).join('');
  return `${pageHead('Planificación vs. Meta', 'Programas que deben estar <em>en pauta</em>.', 'Pauta Activa en Estructura 2027 + Implementado en Creatividad 2027. Hacé clic en un programa para ver sus anuncios.')}
    <div class="table-wrap"><table><thead><tr><th>Estado</th><th>Sigla</th><th>Programa</th><th>Inicio</th><th>Países plan</th><th>Países Meta</th><th class="num">Anuncios activos</th><th class="num">Gasto 7d</th><th class="num">Errores</th></tr></thead><tbody>${body}</tbody></table></div>`;
}

function pageAnuncios() {
  const errIds = errAdIds();
  const warnIds = new Set(R.issues.filter((i) => i.severidad === 'warn').map((i) => i.ad_id));
  const q = st.q.toLowerCase();
  let list = R.anuncios.filter((a) =>
    (st.mode === 'todos' || (st.mode === 'activos' ? a.estado === 'ACTIVE' : st.mode === 'errores' ? errIds.has(a.id) : a.estado !== 'ACTIVE'))
    && (!st.sigla || a.sigla === st.sigla)
    && (!q || a.name.toLowerCase().includes(q) || a.id.includes(q)));
  list.sort((a, b) => (errIds.has(b.id) - errIds.has(a.id)) || b.gasto7d - a.gasto7d);
  const siglas = [...new Set(R.anuncios.map((a) => a.sigla).filter(Boolean))].sort();
  const body = list.map((a) => {
    const img = a.variantes.find((v) => v.local_img)?.local_img;
    const tone = errIds.has(a.id) ? 'error' : warnIds.has(a.id) ? 'warn' : '';
    return `<tr class="clickable tone-${tone}" data-ad="${esc(a.id)}">
      <td>${img ? `<img class="thumb" src="/${esc(img)}" alt="" loading="lazy">` : ''}</td>
      <td>${idCell(a.id)}</td>
      <td><div class="ad-name">${esc(a.name)}</div><div class="faint" style="font-size:12px">${a.estado === 'ACTIVE' ? '' : esc(a.estado.replace(/_/g, ' ').toLowerCase()) + ' · '}${esc(a.conjunto)}</div></td>
      <td><span class="tag ${a.formato === 'video' ? 'cat' : 'soft'}">${esc(a.formato === '?' ? '—' : a.formato)}</span></td>
      ${CHECK_COLS.map(([k]) => `<td class="center">${a.estado === 'ACTIVE' ? checkIcon(a.checks[k] || 'na') : checkIcon('na')}</td>`).join('')}
      <td class="num">${clp(a.gasto7d)}</td><td>${openBtn(a.link)}</td></tr>`;
  }).join('');
  return `${pageHead('Anuncios · Campañas 2027', 'Cada anuncio, <em>control por control</em>.', 'Hacé clic en un anuncio para ver sus piezas, el copy contra el sheet y la URL.')}
    <div class="toolbar">
      <div class="search"><i class="ti ti-search"></i><input class="input" id="q" placeholder="Buscar por nombre o ID" value="${esc(st.q)}"></div>
      <select class="select" id="sigla"><option value="">Todos los programas</option>${siglas.map((s) => `<option ${s === st.sigla ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
      <div class="segmented" id="mode">${[['activos', 'Activos'], ['errores', 'Con errores'], ['pausados', 'Pausados'], ['todos', 'Todos']].map(([k, l]) => `<button data-mode="${k}" class="${st.mode === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <span class="muted" style="margin-left:auto;font-size:14px">${list.length} anuncios</span>
    </div>
    <div class="table-wrap"><table><thead><tr><th></th><th>ID anuncio</th><th>Anuncio</th><th>Formato</th>${CHECK_COLS.map(([, l]) => `<th class="center">${l}</th>`).join('')}<th class="num">Gasto 7d</th><th></th></tr></thead>
    <tbody>${body || `<tr><td colspan="14"><div class="empty">No hay anuncios con estos filtros.</div></td></tr>`}</tbody></table></div>`;
}

function pageMejoras() {
  const ads = activeAds().filter((a) => a.mejoras.length).sort((a, b) => b.gasto7d - a.gasto7d);
  const count = {};
  ads.forEach((a) => a.mejoras.forEach((m) => { count[m.label] = (count[m.label] || 0) + 1; }));
  const body = ads.map((a) => `<tr class="clickable tone-error" data-ad="${esc(a.id)}">
    <td>${idCell(a.id)}</td><td><div class="ad-name">${esc(a.name)}</div></td>
    <td><div class="chips">${a.mejoras.map((m) => `<span class="chip">${esc(m.label)}</span>`).join('')}</div></td>
    <td class="num">${clp(a.gasto7d)}</td><td>${openBtn(a.link)}</td></tr>`).join('');
  return `${pageHead('Mejoras automáticas de Meta', `${ads.length} anuncios para <em>corregir</em>.`, 'En Ads Manager: abrí el anuncio → sección Contenido → "Mejoras de Advantage+ creative" → desactivá las que figuran acá. Meta no permite editar las mejoras de un anuncio publicado desde la API sin crear un creativo nuevo.')}
    <div class="chips" style="margin-bottom:16px">${Object.entries(count).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="chip">${esc(k)} · ${v}</span>`).join('')}</div>
    <div class="table-wrap"><table><thead><tr><th>ID anuncio</th><th>Anuncio</th><th>Mejoras activadas</th><th class="num">Gasto 7d</th><th></th></tr></thead><tbody>${body || `<tr><td colspan="5"><div class="empty">Ningún anuncio activo tiene mejoras automáticas.</div></td></tr>`}</tbody></table></div>`;
}

function pageAlertas() {
  const l = sortIssues(R.issues.filter((i) => i.control === 'Alertas' || i.severidad === 'warn'));
  return `${pageHead('Alertas', 'Puntos para <em>revisar</em>.', 'No son errores contra el sheet, pero pueden dejar algo desactualizado o sin rendimiento.')}${issuesTable(l)}`;
}

// ------------------------------------------------------------ detalle de anuncio
function openAd(id) {
  const a = adsById()[id];
  if (!a) return;
  const p = progBySigla()[a.sigla];
  const c = p?.creatividad;
  const disc = R.descuento_vigente;
  const myIssues = sortIssues(R.issues.filter((i) => i.ad_id === id));
  const expUrl = c ? `${c.url_base}?ref=${c.ref}&utm_source=${c.utm_source}&utm_medium=${c.utm_medium}&utm_campaign=${c.utm_campaign}&utm_term=${a.formato === 'video' ? 'video' : 'img'}` : '';
  const variants = a.variantes.map((v) => {
    const [expHtml, gotHtml] = c ? wordDiff(c.copy, (v.copy || '').replace(/^.*?\d{1,2}\s*%[^.!\n]*[.!]?\s*/s, '')) : ['', esc(v.copy)];
    const vis = v.vision;
    return `<div class="variant">
      <div>${(v.frames_img || v.local_img) ? `<img src="/${esc(v.frames_img || v.local_img)}" alt="">` : '<div class="thumb" style="width:220px;height:220px"></div>'}
        <div class="faint" style="font-size:12px;margin-top:6px">${v.video_id ? (v.frames_img ? '6 fotogramas del video, del inicio al cierre' : 'Miniatura del video') : 'Imagen'}</div></div>
      <div><h3>${esc(v.ubicacion)}</h3>
        <div class="field"><div class="field-label">Copy en Meta ${c ? '· comparado con Creatividad 2027' : ''}</div>
          ${c ? `<div class="copy-box compare"><div><div class="field-label">Creatividad 2027</div>${expHtml}</div><div><div class="field-label">Meta (sin la frase de descuento)</div>${gotHtml}</div></div>
          <div class="faint" style="font-size:12px;margin-top:6px">Frase de descuento en Meta: «${esc(((v.copy || '').match(/[^.!\n]*\d{1,2}\s*%[^.!\n]*[.!]?/) || ['—'])[0].trim())}» · vigente ${esc(disc)}%</div>` : `<div class="copy-box">${esc(v.copy)}</div>`}
        </div>
        <div class="field"><div class="field-label">Título</div><div>${esc(v.titulo || '—')}</div></div>
        <div class="field"><div class="field-label">URL de destino</div><div class="url">${v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.url)}</a>` : '—'}</div>
          ${c ? `<div class="url faint" style="margin-top:4px">Esperada: ${esc(expUrl)}</div>` : ''}</div>
        ${vis ? `<div class="field"><div class="field-label">Lectura de la pieza (IA)</div>${vis.pendiente ? '<div class="muted">Pendiente: se lee en la próxima actualización diaria.</div>' : vis.error ? `<div class="muted">${esc(vis.error)}</div>` : `
          <div class="copy-box" style="white-space:normal">
            <div>${dot(vis.coincide_programa ? 'ok' : 'error', vis.coincide_programa ? 'Es del programa' : 'No coincide con el programa')} <span class="muted">«${esc(vis.programa_en_pieza || '—')}»</span></div>
            <div style="margin-top:6px"><b>Precios:</b> ${esc(vis.precios.join(' · ') || 'no se ven')}${c ? ` <span class="muted">(sheet: ${esc(c.precio_lista)} / ${esc(c.precio_dcto)})</span>` : ''}</div>
            <div><b>Descuentos:</b> ${esc(vis.descuentos.join(' · ') || '—')} · <b>Fechas:</b> ${esc(vis.fechas_o_plazos.join(' · ') || '—')}</div>
            ${vis.observaciones ? `<div class="muted" style="margin-top:6px">${esc(vis.observaciones)}</div>` : ''}</div>`}</div>` : ''}
      </div></div>`;
  }).join('');
  $('#dialog').innerHTML = `
    <div class="dialog-head"><div>
        <div class="kicker">${esc(a.sigla || 'Sin sigla')} · ${esc(p?.programa || '')}</div>
        <h2>${esc(a.name)}</h2>
        <div class="muted" style="font-size:14px;margin-top:6px">${idCell(a.id)} · ${esc(a.campana)} · ${esc(a.conjunto)} · Países: ${esc(a.paises.join(', ') || '—')} · Gasto 7d ${clp(a.gasto7d)}</div></div>
      <div style="display:flex;gap:8px;align-items:center">${openBtn(a.link)}<button class="icon-btn" id="close" title="Cerrar"><i class="ti ti-x"></i></button></div></div>
    <div class="check-strip">${CHECK_COLS.map(([k, l]) => `<span class="dot ${a.checks[k] || 'off'}">${l}</span>`).join('')}</div>
    ${myIssues.length ? `<div class="field"><div class="field-label">Observaciones</div><ul class="issue-list">${myIssues.map((i) => `<li>${dot(i.severidad, i.control)}<span class="detail">${esc(i.detalle)}</span></li>`).join('')}</ul></div>` : ''}
    ${a.mejoras.length ? `<div class="field"><div class="field-label">Mejoras automáticas activadas</div><div class="chips">${a.mejoras.map((m) => `<span class="chip">${esc(m.label)}</span>`).join('')}</div></div>` : ''}
    ${c?.observaciones ? `<div class="field"><div class="field-label">Observaciones PUC (sheet)</div><div class="muted">${esc(c.observaciones)}</div></div>` : ''}
    ${variants}`;
  $('#scrim').hidden = false;
}
const closeDialog = () => { $('#scrim').hidden = true; };

// ------------------------------------------------------------ render
function render() {
  const counts = {
    anuncios: R ? activeAds().length : '',
    mejoras: R ? activeAds().filter((a) => a.mejoras.length).length : '',
    alertas: R ? R.issues.filter((i) => i.control === 'Alertas' || i.severidad === 'warn').length : '',
  };
  $('#nav').innerHTML = PAGES.map((p) => `<button class="nav-item ${st.page === p.id ? 'active' : ''}" data-go="${p.id}"><i class="ti ti-${p.icon}"></i>${p.label}${counts[p.id] !== undefined && counts[p.id] !== '' ? `<span class="count">${counts[p.id]}</span>` : ''}</button>`).join('');
  const pg = PAGES.find((p) => p.id === st.page) || PAGES[0];
  $('#crumbs').innerHTML = `QA Meta Ads <i class="ti ti-chevron-right" style="color:var(--gray-300)"></i> <b>${esc(st.control ? CONTROLS.find((c) => c.key === st.control).title : pg.label)}</b>`;
  if (!R) {
    $('#content').innerHTML = `${pageHead('Control de calidad · Campañas 2027', 'Todavía no hay un <em>reporte</em>.',
      st.visor ? 'El reporte se publica cada mañana desde la tarea diaria de QA.' : 'Tocá Actualizar para leer el sheet y los anuncios de Meta. Tarda uno o dos minutos.')}`;
    return;
  }
  $('#updated').textContent = 'Actualizado ' + new Date(R.generado).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  $('#acct-meta').textContent = `act_${R.cuenta} · Campañas 2027`;
  const html = st.control ? pageControl() : { resumen: pageResumen, programas: pageProgramas, anuncios: pageAnuncios, mejoras: pageMejoras, alertas: pageAlertas }[pg.id]();
  $('#content').innerHTML = `<div class="page-in">${html}</div>`;
  const q = $('#q');
  if (q) {
    q.addEventListener('input', () => { st.q = q.value; const pos = q.selectionStart; render(); const n = $('#q'); n.focus(); n.setSelectionRange(pos, pos); });
    $('#sigla').addEventListener('change', (e) => { st.sigla = e.target.value; render(); });
  }
}

// ------------------------------------------------------------ eventos
document.addEventListener('click', (e) => {
  const cp = e.target.closest('[data-copy]');
  if (cp) { e.stopPropagation(); navigator.clipboard.writeText(cp.dataset.copy).then(() => toast(`ID ${cp.dataset.copy} copiado`)); return; }
  const g = e.target.closest('[data-go]');
  if (g) return go(g.dataset.go);
  const ctl = e.target.closest('[data-control]');
  if (ctl) { const k = ctl.dataset.control; return k === 'Mejoras automáticas' ? go('mejoras') : k === 'Alertas' ? go('alertas') : go('resumen', { control: k }); }
  const vt = e.target.closest('[data-ver-todo]');
  if (vt) { st.verTodo = !st.verTodo; return render(); }
  const sgo = e.target.closest('[data-sigla-go]');
  if (sgo) return go('anuncios', { sigla: sgo.dataset.siglaGo, mode: 'todos' });
  const m = e.target.closest('[data-mode]');
  if (m) { st.mode = m.dataset.mode; return render(); }
  const sg = e.target.closest('tr[data-sigla]');
  if (sg) return go('anuncios', { sigla: sg.dataset.sigla, mode: 'todos' });
  const ad = e.target.closest('tr[data-ad]');
  if (ad && ad.dataset.ad && !e.target.closest('a')) return openAd(ad.dataset.ad);
  if (e.target.id === 'scrim' || e.target.closest('#close')) closeDialog();
});
const tip = document.createElement('div');
tip.className = 'tip'; tip.hidden = true; document.body.appendChild(tip);
document.addEventListener('mousemove', (e) => {
  const t = e.target.closest('[data-tip]');
  if (!t) { tip.hidden = true; return; }
  tip.textContent = t.dataset.tip; tip.hidden = false;
  const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
  tip.style.left = x + 'px'; tip.style.top = (e.clientY + 16) + 'px';
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDialog(); });
window.addEventListener('hashchange', () => { const p = location.hash.slice(1); if (p && p !== st.page) { st.page = p; st.control = ''; render(); } });

async function load() {
  const r = await fetch('/api/report');
  R = r.ok ? await r.json() : null;
  render();
}

// Sigue el estado de la actualización; al terminar recarga el reporte.
async function watch(wasRunning = false) {
  const s = await (await fetch('/api/status')).json();
  const btn = $('#refresh');
  st.visor = s.modo === 'visor';
  $('#vision-wrap').style.display = s.vision_disponible && !st.visor ? '' : 'none';
  btn.style.display = st.visor ? 'none' : '';
  if (s.running) {
    btn.disabled = true;
    btn.innerHTML = `<i class="ti ti-loader-2 spin"></i><span>${esc(s.step)}…</span>`;
    setTimeout(() => watch(true), 1500);
    return;
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-refresh"></i><span>Actualizar</span>';
  if (!wasRunning) return;
  if (s.error) toast('No se pudo actualizar: ' + s.error, 'alert-triangle');
  else { toast('Reporte actualizado'); load(); }
}

$('#refresh').addEventListener('click', async () => {
  const vision = $('#vision-toggle').checked ? '' : '?vision=0';
  await fetch('/api/refresh' + vision, { method: 'POST' });
  setTimeout(() => watch(true), 500);
});

watch().then(load);
})();
