(() => {
const { Button, StatDelta, BarChart, Avatar, ProgressBar, Tabs } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';

function Kpi({ k }) {
  return (
    <div style={{ border: hair, borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{k.label}</span>
        <span style={{ width: '36px', height: '36px', flex: '0 0 36px', borderRadius: '10px', background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${k.icon}`} style={{ fontSize: '19px', color: 'var(--accent)' }} /></span>
      </div>
      <span style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>{k.value}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <StatDelta value={k.delta} direction={k.dir} size={14} />
        <span style={{ fontSize: '13px', color: 'var(--text-faint)' }}>vs. semana pasada</span>
      </div>
    </div>
  );
}

function HomeScreen({ data, onOpenClass, onNewTask, onNavigate }) {
  const [range, setRange] = React.useState('week');
  return (
    <div>
      <PageHeader kicker="Jueves 2 de octubre" title={`Hola, ${data.user.first}. Tu semana viene`} highlight="muy bien."
        subtitle="87% de las tareas se entregaron a tiempo. Hay 3 alumnos que necesitan un seguimiento más cercano."
        actions={<><Button variant="secondary" size="sm" icon="download">Informe semanal</Button><Button size="sm" icon="plus" onClick={onNewTask}>Nueva tarea</Button></>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {data.kpis.map((k) => <Kpi key={k.label} k={k} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <Panel title="Entregas por día"
          action={<Tabs variant="segmented" value={range} onChange={setRange} items={[{ id: 'week', label: 'Semana' }, { id: 'month', label: 'Mes' }]} />}>
          <BarChart data={data.activity[range]} unit="%" height={190} series={[
            { key: 'onTime', label: 'A tiempo', color: 'var(--chart-1)' },
            { key: 'late', label: 'Con atraso', color: 'var(--chart-5)' },
            { key: 'missing', label: 'Sin entregar', color: 'var(--chart-2)' },
          ]} />
        </Panel>
        <Panel title="Próximas entregas" action={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => onNavigate('classes')}>Ver aulas</Button>}>
          {data.upcoming.map((u, i) => (
            <div key={u.title} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderTop: i ? hair : 'none' }}>
              <span style={{ width: '40px', height: '40px', flex: '0 0 40px', borderRadius: '12px', border: hair, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${u.icon}`} style={{ fontSize: '20px', color: 'var(--accent)' }} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u.cls} · {u.due}</div>
              </div>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Necesitan tu atención" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{data.attention.length} alumnos</span>}>
        {data.attention.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 24px', padding: '14px 0', borderTop: i ? hair : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px', minWidth: 0 }}>
              <Avatar name={s.name} size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.clsName}</div>
              </div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)', flex: '1 1 200px' }}><i className={`ti ti-${s.icon}`} style={{ fontSize: '18px', color: 'var(--data-warn)' }} />{s.reason}</span>
            <ProgressBar value={s.progress} size="sm" label="Progreso" showValue style={{ flex: '0 1 180px' }} />
            <Button variant="secondary" size="sm" onClick={() => onOpenClass(s.clsId)}>Ver aula</Button>
          </div>
        ))}
      </Panel>
    </div>
  );
}

Object.assign(window, { HomeScreen });
})();
