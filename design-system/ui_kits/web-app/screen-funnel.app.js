(() => {
const { FunnelChart, BarChart, Select, Tabs, Reveal, CountUp, Button } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';
const pct = (v, d = 1) => `${v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;

function Tile({ label, value, sub, color, index }) {
  return (
    <Reveal index={index} style={{ flex: '1 1 200px' }}>
      <div style={{ border: hair, borderRadius: '16px', padding: '18px 20px', background: 'var(--surface)', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}><span style={{ width: '8px', height: '8px', borderRadius: '999px', background: color }} />{label}</div>
        <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '8px', whiteSpace: 'nowrap' }}>{value}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-faint)', marginTop: '2px' }}>{sub}</div>
      </div>
    </Reveal>
  );
}

function FunnelScreen({ data }) {
  const F = data.funnel;
  const [prog, setProg] = React.useState('all');
  const [period, setPeriod] = React.useState('q');
  const pf = F.programs.find((p) => p.id === prog) || F.programs[0];
  const k = period === 'm' ? 0.36 : 1;
  const stages = F.stages.map((s, i) => ({ ...s, value: Math.round(s.value * pf.f[i] * k) }));
  const first = stages[0].value; const leads = stages[1].value; const last = stages[stages.length - 1].value;
  const drops = stages.map((s, i) => (i ? 100 - (s.value / stages[i - 1].value) * 100 : -1));
  const wi = drops.indexOf(Math.max(...drops));
  const maxReason = F.reasons[0][1];

  return (
    <div>
      <PageHeader kicker="Marketing · Admisiones 2026" title="Funnel de" highlight="admisiones"
        subtitle="De la primera visita a la inscripción. Pasá el mouse por cada etapa para ver cuánto se cae entre una y otra."
        actions={<>
          <Select size="sm" value={prog} onChange={(e) => setProg(e.target.value)} options={F.programs.map((p) => ({ value: p.id, label: p.label }))} style={{ width: '240px' }} />
          <Tabs variant="segmented" value={period} onChange={setPeriod} items={[{ id: 'm', label: 'Mes' }, { id: 'q', label: 'Trimestre' }]} />
        </>} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <Tile index={0} color="var(--funnel-1)" label="Conversión total" value={<CountUp value={(last / first) * 100} format={(v) => pct(v, 2)} />} sub="de visita a inscripción" />
        <Tile index={1} color="var(--funnel-3)" label="Lead → inscripto" value={<CountUp value={(last / leads) * 100} format={(v) => pct(v)} />} sub={`${last.toLocaleString('es-AR')} de ${leads.toLocaleString('es-AR')} leads`} />
        <Tile index={2} color="var(--data-down)" label="Mayor caída" value={<CountUp value={drops[wi]} format={(v) => `−${pct(v)}`} />} sub={`${stages[wi - 1].label} → ${stages[wi].label}`} />
        <Tile index={3} color="var(--funnel-5)" label="Costo por inscripto" value={<CountUp value={F.cost * (prog === 'all' ? 1 : 1.12)} format={(v) => `$${Math.round(v).toLocaleString('es-AR')}`} />} sub="inversión / inscriptos" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <Reveal index={4} style={{ flex: '2 1 600px', minWidth: 0 }}>
          <Panel title="Funnel" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{pf.label} · {period === 'm' ? 'último mes' : 'último trimestre'}</span>}>
            <FunnelChart key={prog + period} stages={stages} />
          </Panel>
        </Reveal>
        <Reveal index={5} style={{ flex: '1 1 320px', minWidth: 0 }}>
          <Panel title="Por qué se caen" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>% de leads perdidos</span>}>
            {F.reasons.map(([label, v], i) => (
              <div key={label} style={{ padding: '9px 0', borderTop: i ? hair : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px', marginBottom: '7px' }}><span>{label}</span><b><CountUp value={v} />%</b></div>
                <div style={{ height: '10px', borderRadius: '999px', background: 'var(--gray-100)', overflow: 'hidden' }}>
                  <div style={{ width: `${(v / maxReason) * 100}%`, height: '100%', borderRadius: '999px', background: `var(--chart-${[2, 5, 4, 3, 6, 8][i]})` }} />
                </div>
              </div>
            ))}
          </Panel>
        </Reveal>
      </div>
      <Reveal index={6}>
        <Panel title="Conversión por etapa y canal" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>% que avanza a la etapa siguiente</span>}>
          <BarChart key={prog + period} data={F.byChannel} unit="%" height={220} max={100}
            series={[{ key: 'ig', label: 'Instagram' }, { key: 'fb', label: 'Facebook' }, { key: 'google', label: 'Google' }, { key: 'organic', label: 'Orgánico' }]} />
        </Panel>
      </Reveal>
    </div>
  );
}

Object.assign(window, { FunnelScreen });
})();
