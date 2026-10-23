(() => {
const { Gauge, BudgetChart, PivotTable, HeatmapGrid, ThresholdValue, DataBar, StatDelta, Tabs, Button, Kicker } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';
const n = (v) => v.toLocaleString('es-AR');
const pct = (v, d = 2) => `${v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
const money = (v) => `${v < 0 ? '-' : ''}$${Math.abs(v).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function isoRange(year, week) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const mon = new Date(jan4); mon.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7) + (week - 1) * 7);
  const sun = new Date(mon); sun.setUTCDate(mon.getUTCDate() + 6);
  const d = (x) => `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]}`;
  return mon.getUTCMonth() === sun.getUTCMonth() ? `${mon.getUTCDate()}–${d(sun)}` : `${d(mon)} – ${d(sun)}`;
}

function KpiPill({ label, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', padding: '7px 14px', border: hair, borderRadius: '999px', fontSize: '13px', whiteSpace: 'nowrap' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{children}</span>
    </span>
  );
}

function Tile({ label, children, sub }) {
  return (
    <div style={{ flex: '1 1 160px', minWidth: 0, border: hair, borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{children}</span>
      {sub}
    </div>
  );
}

function ComplianceCard({ p }) {
  return (
    <Panel title="Cumplimiento" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.campaign}</span>} style={{ flex: '1 1 560px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
        <Tile label="Inversión realizada">{money(p.invested)}</Tile>
        <Tile label="Inversión remanente" sub={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 500, color: 'var(--data-down-fg)', whiteSpace: 'nowrap' }}><i className="ti ti-alert-triangle" style={{ fontSize: '15px' }} />Sobre-ejecutado</span>}>
          <span style={{ color: 'var(--data-down-fg)' }}>{money(p.remaining)}</span>
        </Tile>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 32px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          <Kicker>Cumplimiento de leads</Kicker>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--accent)' }}>{pct(p.leadsCompliance)}</span>
            <span style={{ padding: '6px 12px', borderRadius: '999px', background: 'var(--data-down-soft)' }}><StatDelta value={`${pct(p.gap)} GAP`} direction="down" size={14} /></span>
          </div>
          <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Leads por encima del objetivo, con la inversión aún más adelantada.</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
            <Tile label="% Ejecutado"><ThresholdValue value={p.executed} warn={100} bad={125} higherIsBetter={false} format={(v) => pct(v)} style={{ fontSize: '22px' }} /></Tile>
            <Tile label="GAP"><ThresholdValue value={p.gap} warn={0} bad={-20} format={(v) => pct(v)} style={{ fontSize: '22px' }} /></Tile>
          </div>
        </div>
        <div style={{ flex: '1 1 240px', display: 'flex', justifyContent: 'center' }}>
          <Gauge value={p.executed} label="Ejecución vs presupuesto" overflowLabel={`+${pct(p.executed - 100)} sobre presupuesto`} width={280} />
        </div>
      </div>
    </Panel>
  );
}

function RealBudgetTable({ rows, totals, year, mode, setMode }) {
  const [open, setOpen] = React.useState(true);
  const th = { position: 'sticky', top: 0, zIndex: 1, padding: '11px 14px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', background: 'var(--gray-050)', borderBottom: hair, whiteSpace: 'nowrap' };
  const td = { padding: '10px 14px', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const ft = { ...td, position: 'sticky', bottom: 0, background: 'var(--gray-050)', borderTop: '1px solid var(--gray-300)', fontWeight: 700 };
  const cumpl = (v) => <ThresholdValue value={v} warn={100} bad={80} good={100} variant="pill" format={(x) => pct(x, 1)} />;
  return (
    <Panel title="Real vs budget · leads" action={<Tabs variant="segmented" value={mode} onChange={setMode} items={[{ id: 'week', label: 'Semanal' }, { id: 'cum', label: 'Acumulado', icon: 'sum' }]} />} style={{ flex: '1 1 520px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <KpiPill label="Leads">{n(totals.real)}</KpiPill>
        <KpiPill label="Budget">{n(totals.budget)}</KpiPill>
        <KpiPill label="Cumpl."><span style={{ color: 'var(--data-up-fg)' }}>{pct(totals.cumpl)}</span></KpiPill>
        <KpiPill label="Ejec."><span style={{ color: 'var(--accent)' }}>{pct(totals.exec)}</span></KpiPill>
      </div>
      <div style={{ border: hair, borderRadius: '14px', overflow: 'auto', maxHeight: '440px' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead><tr>
            <th style={{ ...th, textAlign: 'left' }}>Semana</th>
            <th style={{ ...th, textAlign: 'right' }}>Leads</th>
            <th style={{ ...th, textAlign: 'right' }}>Budget</th>
            <th style={{ ...th, textAlign: 'center' }}>Cumpl.</th>
            <th style={{ ...th, textAlign: 'left' }}>Ejec.</th>
          </tr></thead>
          <tbody>
            <tr onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
              <td colSpan={5} style={{ ...td, background: 'var(--accent-soft)', borderBottom: hair }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <i className={`ti ti-chevron-${open ? 'down' : 'right'}`} style={{ fontSize: '18px', color: 'var(--accent)' }} />
                  <span style={{ fontWeight: 700, color: 'var(--accent-strong)' }}>{year}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', flex: '1 1 auto' }}>{rows.length} semanas · Leads <b style={{ color: 'var(--text)' }}>{n(totals.real)}</b> · Budget <b style={{ color: 'var(--text)' }}>{n(totals.budget)}</b></span>
                  <span>{cumpl(totals.cumpl)}</span>
                </span>
              </td>
            </tr>
            {open && rows.map((r, i) => {
              const bg = i % 2 ? 'var(--table-stripe)' : 'var(--surface)';
              return (
                <tr key={r.label}>
                  <td style={{ ...td, background: bg, fontWeight: 500 }}>{r.label}<span style={{ display: 'block', fontSize: '11px', fontWeight: 400, color: 'var(--text-faint)' }}>{r.range}</span></td>
                  <td style={{ ...td, background: bg, textAlign: 'right', fontWeight: 500 }}>{n(r.real)}</td>
                  <td style={{ ...td, background: bg, textAlign: 'right', color: 'var(--text-muted)' }}>{n(r.budget)}</td>
                  <td style={{ ...td, background: bg, textAlign: 'center' }}>{cumpl(r.cumpl)}</td>
                  <td style={{ ...td, background: bg }}><DataBar value={Math.round(r.exec * 10) / 10} unit="%" max={150} warn={100} bad={125} higherIsBetter={false} width={60} /></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot><tr>
            <td style={ft}>Total</td>
            <td style={{ ...ft, textAlign: 'right' }}>{n(totals.real)}</td>
            <td style={{ ...ft, textAlign: 'right', color: 'var(--text-muted)' }}>{n(totals.budget)}</td>
            <td style={{ ...ft, textAlign: 'center', color: 'var(--data-up-fg)' }}>{pct(totals.cumpl)}</td>
            <td style={{ ...ft, color: 'var(--accent)' }}>{pct(totals.exec)}</td>
          </tr></tfoot>
        </table>
      </div>
    </Panel>
  );
}

function PerformanceScreen({ data }) {
  const P = data.perf;
  const [mode, setMode] = React.useState('week');
  const cur = `S${P.currentWeek}`;
  const done = P.weeks.filter((w) => w.real !== null);
  let cr = 0; let cb = 0; let ce = 0;
  const series = P.weeks.map((w) => {
    if (mode === 'week') return { ...w };
    cb += w.budget;
    if (w.real === null) return { ...w, budget: cb };
    cr += w.real; ce += w.exec * w.budget;
    return { ...w, real: cr, budget: cb, exec: Math.round(ce / cb) };
  });
  const chartData = series.map((w) => ({ label: `S${w.w}`, real: w.real, budget: w.budget, exec: w.exec }));
  const tableRows = series.filter((w) => w.real !== null).map((w) => ({ label: `S${w.w}`, range: isoRange(P.year, w.w), real: w.real, budget: w.budget, cumpl: (w.real / w.budget) * 100, exec: w.exec })).reverse();
  const tr = done.reduce((a, w) => a + w.real, 0);
  const tb = done.reduce((a, w) => a + w.budget, 0);
  const te = done.reduce((a, w) => a + w.exec * w.budget, 0) / tb;
  const totals = { real: tr, budget: tb, cumpl: (tr / tb) * 100, exec: te };

  const groups = P.isoWeeks.map((w, i) => ({ key: String(w), label: `S${w}`, sub: `${isoRange(P.year, w)} · ${P.year}`, highlight: i === P.isoWeeks.length - 1 }));
  const toCells = (arr) => Object.fromEntries(P.isoWeeks.map((w, i) => [String(w), { cpl: arr[i][0], leads: arr[i][1] }]));
  const rows = P.programs.map((p) => ({ id: p.id, label: p.name, cells: toCells(p.cells) }));
  const moneyCell = (v) => `$${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      <PageHeader kicker={`Marketing · Semana ${P.currentWeek} · ${P.year}`} title="Rendimiento de" highlight="campañas"
        subtitle="Cumplimiento de leads e inversión contra presupuesto, por semana ISO."
        actions={<Button variant="secondary" size="sm" icon="file-spreadsheet">Exportar</Button>} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <ComplianceCard p={P} />
        <RealBudgetTable rows={tableRows} totals={totals} year={P.year} mode={mode} setMode={setMode} />
      </div>
      <Panel title="Evolución semanal · leads" style={{ marginBottom: '16px' }}
        action={<Tabs variant="segmented" value={mode} onChange={setMode} items={[{ id: 'week', label: 'Semanal' }, { id: 'cum', label: 'Acumulado', icon: 'sum' }]} />}>
        <BudgetChart data={chartData} current={cur} height={260} />
      </Panel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <Panel title="Cumplimiento por programa · semana" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>% vs budget de leads</span>} style={{ flex: '3 1 640px' }}>
          <HeatmapGrid scale="diverging" center={100} unit="%" rowLabelWidth={200}
            rows={P.programs.map((p) => ({ key: p.id, label: p.name.split(':')[0] }))}
            cols={Array.from({ length: 12 }, (_, i) => ({ key: String(28 + i), label: `S${28 + i}` }))}
            values={P.complianceByProgramWeek} format={(v) => `${Math.round(v)}`} />
        </Panel>
        <Panel title="Leads por día y hora" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Últimas 4 semanas</span>} style={{ flex: '2 1 520px' }}>
          <HeatmapGrid palette="aurora" rows={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => ({ key: d, label: d }))}
            cols={Array.from({ length: 13 }, (_, i) => ({ key: String(8 + i), label: `${8 + i}h` }))}
            values={P.leadsByDayHour} rowLabelWidth={44} cellHeight={30} showValues={false} totals legendLow="Menos leads" legendHigh="Más leads" />
        </Panel>
      </div>
      <Panel title="Evolutivo por programa · semanas ISO" action={<span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Costo por lead y leads</span>}>
        <PivotTable rowLabel="Programa" groups={groups} rows={rows} firstColWidth={300}
          measures={[
            { key: 'cpl', label: 'Costo por lead', render: (v) => <ThresholdValue value={v} warn={9} bad={11} higherIsBetter={false} format={moneyCell} />, format: moneyCell },
            { key: 'leads', label: 'Leads', format: (v) => n(v), render: (v) => n(v) },
          ]}
          total={{ label: 'Total', cells: toCells(P.programTotal) }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>Costo por lead</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}><i className="ti ti-alert-triangle" style={{ fontSize: '16px', color: 'var(--data-warn-fg)' }} />más de $9</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}><i className="ti ti-alert-circle" style={{ fontSize: '16px', color: 'var(--data-down-fg)' }} />más de $11</span>
          <span style={{ whiteSpace: 'nowrap' }}>Semana actual en azul</span>
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { PerformanceScreen });
})();
