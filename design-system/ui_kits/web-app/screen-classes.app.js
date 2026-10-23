(() => {
const { Button, Tabs, Input, Select, DataTable, ProgressBar, StatusDot, Avatar, IconButton, StatDelta, CategoryChip } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';

function ProgressCell({ value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
      <ProgressBar value={value} size="sm" style={{ flex: 1 }} />
      <span style={{ fontSize: '13px', fontWeight: 500, width: '38px', textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function ClassesScreen({ data, onOpen }) {
  const [tab, setTab] = React.useState('active');
  const [q, setQ] = React.useState('');
  const [level, setLevel] = React.useState('');
  const active = data.classes.filter((c) => !c.archived);
  const archived = data.classes.filter((c) => c.archived);
  const rows = (tab === 'active' ? active : archived).filter((c) => (!level || c.level === level) && c.name.toLowerCase().includes(q.toLowerCase()));
  const cols = [
    { key: 'name', label: 'Aula', render: (c) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ width: '38px', height: '38px', flex: '0 0 38px', borderRadius: '10px', background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${c.icon}`} style={{ fontSize: '19px', color: 'var(--accent)' }} /></span>
        <div><div style={{ fontWeight: 500, fontSize: '15px', whiteSpace: 'nowrap' }}>{c.name}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{c.schedule}</div></div>
      </div>) },
    { key: 'level', label: 'Nivel', render: (c) => <CategoryChip tone={c.level === 'Primaria' ? 2 : 1} variant="outline">{c.level}</CategoryChip> },
    { key: 'students', label: 'Alumnos', align: 'right' },
    { key: 'progress', label: 'Progreso', render: (c) => <ProgressCell value={c.progress} /> },
    { key: 'avg', label: 'Promedio', align: 'right', render: (c) => <span style={{ fontWeight: 500 }}>{c.avg}</span> },
    { key: 'status', label: 'Estado', render: (c) => <StatusDot tone={c.status}>{c.statusLabel}</StatusDot> },
    { key: 'go', label: '', align: 'right', width: 40, render: () => <i className="ti ti-chevron-right" style={{ fontSize: '18px', color: 'var(--gray-400)' }} /> },
  ];
  return (
    <div>
      <PageHeader kicker="Ciclo lectivo 2026" title="Tus" highlight="aulas" subtitle="Seguí el avance, las notas y las entregas de cada curso." actions={<Button size="sm" icon="plus">Nueva aula</Button>} />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'active', label: 'Activas', count: active.length }, { id: 'archived', label: 'Archivadas', count: archived.length }]} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', margin: '20px 0 16px' }}>
        <Input icon="search" size="sm" placeholder="Buscar aula" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '280px' }} />
        <Select size="sm" placeholder="Todos los niveles" options={['Primaria', 'Secundaria']} value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: '200px' }} />
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>{rows.length} {rows.length === 1 ? 'aula' : 'aulas'}</span>
      </div>
      <DataTable columns={cols} rows={rows} onRowClick={(c) => onOpen(c.id)} empty="No hay aulas que coincidan con tu búsqueda." />
    </div>
  );
}

function Stat({ label, value, children }) {
  return (
    <div style={{ border: hair, borderRadius: '16px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '30px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</span>
      {children}
    </div>
  );
}

function ClassDetailScreen({ data, cls, onBack, onNewTask }) {
  const [tab, setTab] = React.useState('all');
  const risk = data.students.filter((s) => s.status !== 'ok');
  const rows = tab === 'all' ? data.students : risk;
  const cols = [
    { key: 'name', label: 'Alumno', render: (s) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Avatar name={s.name} size={32} />
        <div><div style={{ fontWeight: 500, fontSize: '15px', whiteSpace: 'nowrap' }}>{s.name}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.email}</div></div>
      </div>) },
    { key: 'progress', label: 'Progreso', render: (s) => <ProgressCell value={s.progress} /> },
    { key: 'avg', label: 'Nota', align: 'right', render: (s) => <span style={{ fontWeight: 500 }}>{s.avg}</span> },
    { key: 'delivered', label: 'Entregas', align: 'right', render: (s) => `${s.delivered}/12` },
    { key: 'last', label: 'Última actividad' },
    { key: 'status', label: 'Estado', render: (s) => <StatusDot tone={s.status}>{s.statusLabel}</StatusDot> },
    { key: 'more', label: '', align: 'right', width: 48, render: () => <IconButton icon="dots-vertical" label="Más acciones" size="sm" /> },
  ];
  return (
    <div>
      <Button variant="ghost" size="sm" icon="arrow-left" onClick={onBack} style={{ marginBottom: '12px', marginLeft: '-12px' }}>Aulas</Button>
      <PageHeader kicker={cls.level} title={cls.name} subtitle={`${cls.schedule} · ${cls.students} alumnos`}
        actions={<><Button variant="secondary" size="sm" icon="file-spreadsheet">Exportar notas</Button><Button size="sm" icon="plus" onClick={onNewTask}>Nueva tarea</Button></>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Stat label="Progreso medio" value={`${cls.progress}%`}><ProgressBar value={cls.progress} size="sm" /></Stat>
        <Stat label="Promedio del aula" value={cls.avg}><StatDelta value="+0.4 este mes" direction="up" size={14} /></Stat>
        <Stat label="Entregas a tiempo" value="91%"><StatDelta value="+3 pts" direction="up" size={14} /></Stat>
      </div>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Todos', count: data.students.length }, { id: 'risk', label: 'Requieren atención', count: risk.length }]} style={{ marginBottom: '16px' }} />
      <DataTable columns={cols} rows={rows} />
    </div>
  );
}

Object.assign(window, { ClassesScreen, ClassDetailScreen });
})();
