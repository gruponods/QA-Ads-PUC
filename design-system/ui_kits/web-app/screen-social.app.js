(() => {
const { VersusTable, BarChart, DataTable, CategoryChip, Tabs, Reveal, CountUp, StatDelta, PatternSwatch, Button, DataBar } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';
const compact = (v) => new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
const pct = (v) => `${v.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
const money = (v) => `$${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const count = (v) => (v >= 100000 ? compact(v) : Math.round(v).toLocaleString('es-AR'));
const FORMAT_TONE = { Reel: 1, Carrusel: 3, Historias: 4, Video: 2, Evento: 5, Post: 6 };

function NetCard({ icon, name, followers, growth, color, index }) {
  return (
    <Reveal index={index} style={{ flex: '1 1 260px' }}>
      <Panel style={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', fontWeight: 700 }}>
            <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface-muted)', border: 'var(--border-hairline)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${icon}`} style={{ fontSize: '22px', color }} /></span>
            {name}
          </span>
          <PatternSwatch color={color} label="en gráficos" style={{ whiteSpace: 'nowrap' }} />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Seguidores</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.02em' }}><CountUp value={followers} format={(v) => compact(v)} /></span>
          <StatDelta value={`${growth > 0 ? '+' : ''}${pct(growth)} en el período`} direction={growth >= 0 ? 'up' : 'down'} size={14} />
        </div>
      </Panel>
    </Reveal>
  );
}

function SocialScreen({ data }) {
  const S = data.social;
  const [period, setPeriod] = React.useState('30');
  const f = period === '90' ? 2.85 : 1;
  const metrics = S.metrics.map((m) => {
    const scale = (v) => (m.type === 'count' || m.key === 'spend' ? v * f : period === '90' ? v * (m.lower ? 1.04 : 0.96) : v);
    const fmt = m.type === 'pct' ? pct : m.type === 'money' ? money : count;
    return { key: m.key, label: m.label, hint: m.hint, left: scale(m.ig), right: scale(m.fb), lower: m.lower, neutral: m.neutral, format: fmt };
  });
  const scored = metrics.filter((m) => !m.neutral);
  const igWins = scored.filter((m) => (m.lower ? m.left < m.right : m.left > m.right)).length;
  const weeks = (period === '90' ? S.weekly : S.weekly.slice(-4)).map(([w, ig, fb]) => ({ label: `S${w}`, ig, fb }));
  const totalLeads = metrics.find((m) => m.key === 'leads');

  const cols = [
    { key: 'net', label: 'Red', width: 56, render: (r) => <i className={`ti ti-brand-${r.net === 'ig' ? 'instagram' : 'facebook'}`} title={r.net === 'ig' ? 'Instagram' : 'Facebook'} style={{ fontSize: '22px', color: r.net === 'ig' ? 'var(--chart-1)' : 'var(--chart-2)' }} /> },
    { key: 'title', label: 'Publicación', render: (r) => <div style={{ minWidth: '220px' }}><div style={{ fontWeight: 500, fontSize: '14px' }}>{r.title}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.program}</div></div> },
    { key: 'format', label: 'Formato', sortable: true, render: (r) => <CategoryChip tone={FORMAT_TONE[r.format] || 6}>{r.format}</CategoryChip> },
    { key: 'er', label: 'Engagement', sortable: true, render: (r) => <DataBar value={r.er} unit="%" max={10} width={80} style={{ '--accent': r.net === 'ig' ? 'var(--chart-1)' : 'var(--chart-2)' }} /> },
    { key: 'leads', label: 'Leads', align: 'right', sortable: true, render: (r) => <span style={{ fontWeight: 700 }}>{r.leads}</span> },
  ];

  return (
    <div>
      <PageHeader kicker="Redes sociales · orgánico + pauta" title="Instagram" highlight="vs. Facebook"
        subtitle="Qué red rinde mejor para cada objetivo: alcance, interacción, tráfico y leads."
        actions={<><Tabs variant="segmented" value={period} onChange={setPeriod} items={[{ id: '30', label: 'Últimos 30 días' }, { id: '90', label: '90 días' }]} /><Button variant="secondary" size="sm" icon="download">Exportar</Button></>} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <NetCard index={0} icon="brand-instagram" name="Instagram" followers={S.ig.followers + (period === '90' ? 0 : 0)} growth={period === '90' ? S.ig.growth * 2.4 : S.ig.growth} color="var(--chart-1)" />
        <NetCard index={1} icon="brand-facebook" name="Facebook" followers={S.fb.followers} growth={period === '90' ? S.fb.growth * 1.8 : S.fb.growth} color="var(--chart-2)" />
        <Reveal index={2} style={{ flex: '1 1 260px' }}>
          <Panel style={{ height: '100%' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Resultado del período</div>
            <div style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent)' }}><CountUp value={igWins} duration={600} /><span style={{ color: 'var(--text-faint)', fontSize: '24px' }}> / {scored.length}</span></div>
            <div style={{ fontSize: '15px', marginTop: '6px', lineHeight: 1.45 }}>métricas a favor de <b>Instagram</b>. Facebook gana en tráfico al sitio y en costo por lead.</div>
          </Panel>
        </Reveal>
      </div>
      <Reveal index={3} style={{ marginBottom: '16px' }}>
        <Panel title="Comparativa de KPIs" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Barras escaladas por fila</span>}>
          <VersusTable key={period} left={{ label: 'Instagram', icon: 'brand-instagram' }} right={{ label: 'Facebook', icon: 'brand-facebook' }} metrics={metrics} />
        </Panel>
      </Reveal>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
        <Reveal index={4} style={{ flex: '1 1 420px' }}>
          <Panel title="Leads por semana" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Total <b style={{ color: 'var(--text)' }}><CountUp value={totalLeads.left + totalLeads.right} /></b></span>}>
            <BarChart key={period} data={weeks} height={210} showValues={period === '30'} series={[{ key: 'ig', label: 'Instagram' }, { key: 'fb', label: 'Facebook' }]} />
          </Panel>
        </Reveal>
        <Reveal index={5} style={{ flex: '2 1 560px' }}>
          <Panel title="Publicaciones con más leads">
            <DataTable dense rows={S.posts} columns={cols} defaultSort={{ key: 'leads', dir: 'desc' }} />
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}

Object.assign(window, { SocialScreen });
})();
