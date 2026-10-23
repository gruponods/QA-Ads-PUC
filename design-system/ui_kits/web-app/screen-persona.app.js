(() => {
const { Select, CategoryChip, BarChart, Reveal, CountUp, ProgressBar, StepItem } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';

function IconList({ items, tone }) {
  const c = tone === 'warn' ? 'var(--data-warn-fg)' : 'var(--accent)';
  const bg = tone === 'warn' ? 'var(--data-warn-soft)' : 'var(--accent-soft)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map(([icon, text], i) => (
        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '11px 0', borderTop: i ? hair : 'none' }}>
          <span style={{ width: '38px', height: '38px', flex: '0 0 38px', borderRadius: '10px', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className={`ti ti-${icon}`} style={{ fontSize: '20px', color: c }} /></span>
          <span style={{ flex: 1, minWidth: 0, fontSize: '15px', lineHeight: 1.4 }}>{text}</span>
        </div>
      ))}
    </div>
  );
}

function PersonaScreen({ data }) {
  const [id, setId] = React.useState(() => localStorage.getItem('nods-app-persona') || data.personas[0].id);
  React.useEffect(() => { localStorage.setItem('nods-app-persona', id); }, [id]);
  const p = data.personas.find((x) => x.id === id) || data.personas[0];
  const [qa, qb] = p.quote.split(p.highlight);
  const muted = { fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' };
  return (
    <div>
      <PageHeader kicker="Buyer persona · Posgrado" title="¿Quién elige" highlight={`${p.short}?`} subtitle={p.program}
        actions={<Select size="sm" value={p.id} onChange={(e) => setId(e.target.value)} options={data.personas.map((x) => ({ value: x.id, label: x.short }))} style={{ width: '260px' }} />} />
      <div key={p.id}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <Reveal index={0} style={{ gridRow: 'span 2' }}>
            <Panel style={{ height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                <div style={{ width: '96px', height: '96px', flex: '0 0 96px', borderRadius: '999px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}><i className="ti ti-user" style={{ fontSize: '44px' }} /></div>
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.01em' }}>{p.name}, <CountUp value={p.age} duration={700} /></div>
                  <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-faint)', marginTop: '6px' }}><i className="ti ti-map-pin" style={{ fontSize: '15px' }} />{p.city}</div>
                </div>
              </div>
              <div style={{ margin: '26px 0 22px', display: 'flex', gap: '12px' }}>
                <i className="ti ti-quote" style={{ fontSize: '28px', color: 'var(--accent)', flex: '0 0 auto' }} />
                <p style={{ margin: 0, fontSize: '21px', lineHeight: 1.45, fontWeight: 500, textWrap: 'pretty' }}>{qa}<span style={{ color: 'var(--accent)' }}>{p.highlight}</span>{qb}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
                {p.traits.map((t, i) => <CategoryChip key={t} tone={[1, 2, 3, 6][i % 4]} variant="outline">{t}</CategoryChip>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                {p.facts.map(([l, v]) => (
                  <div key={l} style={{ border: hair, borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{l}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>{v}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
          <Reveal index={1}><Panel title="Motivaciones"><IconList items={p.motivations} /></Panel></Reveal>
          <Reveal index={2}><Panel title="Frenos y objeciones"><IconList items={p.barriers} tone="warn" /></Panel></Reveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <Reveal index={3}>
            <Panel title="Dónde se informa" action={<span style={muted}>% de leads por canal</span>} style={{ height: '100%' }}>
              {p.channels.map(([icon, name, v], i) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '24px minmax(0,110px) 1fr 44px', alignItems: 'center', gap: '12px', padding: '9px 0' }}>
                  <i className={`ti ti-${icon}`} style={{ fontSize: '20px', color: `var(--chart-${i + 1})` }} />
                  <span style={{ fontSize: '14px', fontWeight: i === 0 ? 700 : 500 }}>{name}</span>
                  <ProgressBar value={v} max={p.channels[0][2]} size="sm" color={`var(--chart-${i + 1})`} />
                  <span style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right' }}><CountUp value={v} />%</span>
                </div>
              ))}
            </Panel>
          </Reveal>
          <Reveal index={4}>
            <Panel title="Edad de los inscriptos" action={<span style={muted}>Últimos 12 meses</span>} style={{ height: '100%' }}>
              <BarChart data={p.ages.map(([label, value], i) => ({ label, value, color: `var(--aurora-${i + 2})` }))} unit="%" height={180} max={50} />
            </Panel>
          </Reveal>
        </div>
        <Reveal index={5} style={{ marginBottom: '16px' }}>
          <Panel title="Recorrido de decisión" action={<span style={muted}>~{p.days} días de la primera visita a la inscripción</span>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px 20px' }}>
              {p.journey.map(([icon, title, desc, day], i) => (
                <StepItem key={title} icon={icon} orientation="horizontal" last={i === p.journey.length - 1} title={title}>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2px' }}>Día {day}</span>{desc}
                </StepItem>
              ))}
            </div>
          </Panel>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          <Reveal index={6}>
            <Panel title="Mensajes que funcionan" style={{ height: '100%' }}>
              {p.yes.map((t) => <div key={t} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', padding: '7px 0', fontSize: '15px' }}><i className="ti ti-circle-check" style={{ fontSize: '18px', color: 'var(--data-up-fg)', position: 'relative', top: '3px' }} />{t}</div>)}
            </Panel>
          </Reveal>
          <Reveal index={7}>
            <Panel title="Evitar" style={{ height: '100%' }}>
              {p.no.map((t) => <div key={t} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', padding: '7px 0', fontSize: '15px', color: 'var(--text-muted)' }}><i className="ti ti-circle-x" style={{ fontSize: '18px', color: 'var(--data-down-fg)', position: 'relative', top: '3px' }} />{t}</div>)}
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PersonaScreen });
})();
