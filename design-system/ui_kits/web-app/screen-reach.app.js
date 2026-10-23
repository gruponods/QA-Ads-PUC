(() => {
const { GeoMap, Tabs, ProgressBar, PatternSwatch, Button, AMERICAS_ES } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';
const fmt = (v) => v.toLocaleString('es-AR');
const compact = (v) => new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
const NAMES = AMERICAS_ES || {};

function ReachScreen({ data }) {
  const R = data.reach;
  const [view, setView] = React.useState('students');
  const [region, setRegion] = React.useState('americas');
  const [sel, setSel] = React.useState(null);
  const active = R.countries.filter((c) => c.students > 0);
  const total = active.reduce((a, c) => a + c.students, 0);
  const schools = active.reduce((a, c) => a + c.schools, 0);
  const byId = Object.fromEntries(R.countries.map((c) => [c.id, c]));
  const mapData = view === 'students'
    ? Object.fromEntries(active.map((c) => [c.id, c.students]))
    : Object.fromEntries(R.countries.map((c) => [c.id, c.status]));
  const ranked = [...active].sort((a, b) => b.students - a.students);
  const top = ranked[0].students;
  const cur = sel && byId[sel];
  const cat = cur && R.categories.find((k) => k.key === cur.status);

  return (
    <div>
      <PageHeader kicker="Red NODS" title="Presencia en" highlight="América"
        subtitle={`${compact(total)} alumnos y ${fmt(schools)} instituciones en ${active.length} países.`}
        actions={<Button variant="secondary" size="sm" icon="download">Exportar datos</Button>} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <Tabs variant="segmented" value={view} onChange={setView} items={[{ id: 'students', label: 'Alumnos activos' }, { id: 'status', label: 'Estado' }]} />
        <Tabs variant="segmented" value={region} onChange={setRegion} items={[{ id: 'americas', label: 'Toda América' }, { id: 'latam', label: 'Latinoamérica' }, { id: 'south', label: 'Sudamérica' }]} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
        <Panel style={{ flex: '2 1 480px' }}>
          <GeoMap key={view + region} region={region} data={mapData}
            mode={view === 'students' ? 'scale' : 'category'} categories={R.categories}
            valueLabel="alumnos" legendTitle={view === 'students' ? 'Alumnos activos' : 'Estado'}
            selected={sel} onSelect={(id) => setSel(id === sel ? null : id)}
            style={{ maxWidth: { americas: '560px', latam: '500px', south: '440px' }[region], margin: '0 auto' }} />
        </Panel>
        <Panel style={{ flex: '1 1 280px' }} title={cur ? NAMES[cur.id] : 'Ranking por alumnos'}
          action={cur ? <Button variant="ghost" size="sm" icon="x" onClick={() => setSel(null)}>Cerrar</Button> : <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Top 8</span>}>
          {cur ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <PatternSwatch pattern={cat.pattern} label={`${cat.label} · desde ${cur.since}`} />
              <div>
                <div style={{ fontSize: '44px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)' }}>{cur.students ? compact(cur.students) : '—'}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>alumnos activos</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: hair, paddingTop: '16px' }}>
                <div><div style={{ fontSize: '22px', fontWeight: 700 }}>{fmt(cur.schools)}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>instituciones</div></div>
                <div><div style={{ fontSize: '22px', fontWeight: 700 }}>{cur.students ? `${((cur.students / total) * 100).toFixed(1)}%` : '—'}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>de la red</div></div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ranked.slice(0, 8).map((c, i) => (
                <button key={c.id} type="button" onClick={() => setSel(c.id)}
                  style={{ display: 'grid', gridTemplateColumns: '22px minmax(0,1fr) 64px', alignItems: 'center', gap: '10px', padding: '11px 0', border: 'none', borderTop: i ? hair : 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{NAMES[c.id]}</span>
                    <ProgressBar value={c.students} max={top} size="sm" />
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', textAlign: 'right' }}>{compact(c.students)}</span>
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { ReachScreen });
})();
