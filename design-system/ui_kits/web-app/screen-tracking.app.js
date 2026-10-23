(() => {
const { DataTable, CategoryChip, ThresholdValue, DataBar, HeatCell, StatusDot, Tabs, Input, Button, Alert, Avatar } = window.NodsDesignSystem_bde349;
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

const statusOf = (r) => {
  if (r.avg < 6 || r.att < 75 || r.pending > 8) return 'risk';
  if (r.avg < 7 || r.att < 85 || r.pending > 3) return 'warn';
  return 'ok';
};
const STATUS = { risk: { tone: 'risk', label: 'En riesgo' }, warn: { tone: 'warn', label: 'Atención' }, ok: { tone: 'ok', label: 'Al día' } };

function Legend() {
  const item = (node, label) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>{node}{label}</span>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 22px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '14px' }}>
      <span style={{ fontWeight: 500, color: 'var(--text)' }}>Formato condicional</span>
      {item(<i className="ti ti-alert-circle" style={{ fontSize: '17px', color: 'var(--data-down-fg)' }} />, 'Promedio < 6 · asistencia < 75% · > 8 pendientes')}
      {item(<i className="ti ti-alert-triangle" style={{ fontSize: '17px', color: 'var(--data-warn-fg)' }} />, 'Promedio < 7 · asistencia < 85% · > 3 pendientes')}
      {item(<span style={{ display: 'inline-flex', gap: '2px' }}>{[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ width: '12px', height: '10px', borderRadius: '3px', background: `var(--map-${s})` }} />)}</span>, 'Actividad baja → alta')}
    </div>
  );
}

function TrackingScreen({ data }) {
  const [variant, setVariant] = React.useState(() => localStorage.getItem('nods-app-table-variant') || 'striped');
  const [areas, setAreas] = React.useState([]);
  const [q, setQ] = React.useState('');
  const [onlyFlagged, setOnlyFlagged] = React.useState(false);
  React.useEffect(() => { localStorage.setItem('nods-app-table-variant', variant); }, [variant]);
  const AREA = Object.fromEntries(data.areas.map((a) => [a.key, a]));
  const all = data.tracking.map((r) => ({ ...r, status: statusOf(r) }));
  const rows = all.filter((r) => (!areas.length || areas.includes(r.area)) && (!onlyFlagged || r.status !== 'ok') && (r.course + r.teacher).toLowerCase().includes(q.toLowerCase()));
  const risk = all.filter((r) => r.status === 'risk');
  const toggleArea = (k) => setAreas((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));

  const cols = [
    { key: 'course', label: 'Curso', sortable: true, render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '190px' }}>
        <Avatar name={r.teacher} size={32} />
        <div><div style={{ fontWeight: 500, fontSize: '15px', whiteSpace: 'nowrap' }}>{r.course}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.teacher}</div></div>
      </div>) },
    { key: 'area', label: 'Área', sortable: true, sortValue: (r) => AREA[r.area].label, render: (r) => <CategoryChip tone={AREA[r.area].tone} icon={AREA[r.area].icon}>{AREA[r.area].label}</CategoryChip> },
    { key: 'students', label: 'Alumnos', align: 'right', sortable: true },
    { key: 'avg', label: 'Promedio', align: 'right', sortable: true, render: (r) => <ThresholdValue value={r.avg} warn={7} bad={6} format={(v) => v.toFixed(1)} /> },
    { key: 'att', label: 'Asistencia', sortable: true, render: (r) => <DataBar value={r.att} unit="%" warn={85} bad={75} width={90} /> },
    { key: 'week', label: 'Actividad semanal', render: (r) => <span style={{ display: 'inline-flex', gap: '4px' }}>{r.week.map((v, i) => <HeatCell key={i} value={v} label={DAYS[i]} />)}</span> },
    { key: 'pending', label: 'Pendientes', align: 'right', sortable: true, render: (r) => <ThresholdValue value={r.pending} warn={4} bad={9} higherIsBetter={false} variant="pill" /> },
    { key: 'status', label: 'Estado', sortable: true, sortValue: (r) => ({ risk: 0, warn: 1, ok: 2 })[r.status], render: (r) => <StatusDot tone={STATUS[r.status].tone}>{STATUS[r.status].label}</StatusDot> },
  ];

  return (
    <div>
      <PageHeader kicker="Coordinación · Ciclo 2026" title="Seguimiento de" highlight="cursos"
        subtitle="Promedios, asistencia y entregas de todos los cursos, con alertas automáticas."
        actions={<Button variant="secondary" size="sm" icon="file-spreadsheet">Exportar</Button>} />
      {risk.length > 0 && (
        <Alert tone="error" title={risk.length === 1 ? '1 curso en riesgo' : `${risk.length} cursos en riesgo`} style={{ marginBottom: '20px' }}
          action={<Button variant="secondary" size="sm" onClick={() => setOnlyFlagged(true)}>Ver solo cursos con alertas</Button>}>
          {risk.map((r) => r.course).join(' y ')} {risk.length === 1 ? 'combina' : 'combinan'} promedio bajo, asistencia por debajo del 75% o muchas entregas pendientes.
        </Alert>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginRight: '4px' }}>Áreas</span>
        {data.areas.map((a) => (
          <CategoryChip key={a.key} tone={a.tone} icon={a.icon} count={all.filter((r) => r.area === a.key).length}
            selected={!areas.length || areas.includes(a.key)} onClick={() => toggleArea(a.key)}>{a.label}</CategoryChip>
        ))}
        {areas.length > 0 && <Button variant="ghost" size="sm" onClick={() => setAreas([])}>Limpiar</Button>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <Input icon="search" size="sm" placeholder="Buscar curso o docente" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '260px' }} />
        <Tabs variant="segmented" value={onlyFlagged ? 'flag' : 'all'} onChange={(v) => setOnlyFlagged(v === 'flag')} items={[{ id: 'all', label: 'Todos' }, { id: 'flag', label: 'Con alertas' }]} />
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Vista de filas</span>
          <Tabs variant="segmented" value={variant} onChange={setVariant} items={[{ id: 'striped', label: 'Cebra', icon: 'layout-rows' }, { id: 'lines', label: 'Líneas', icon: 'separator' }, { id: 'separated', label: 'Separadas', icon: 'layout-list' }]} />
        </span>
      </div>
      <DataTable variant={variant} columns={cols} rows={rows} rowTone={(r) => (r.status === 'ok' ? null : r.status)}
        defaultSort={{ key: 'status', dir: 'asc' }} onRowClick={() => {}} empty="No hay cursos con esos filtros." />
      <Legend />
    </div>
  );
}

Object.assign(window, { TrackingScreen });
})();
