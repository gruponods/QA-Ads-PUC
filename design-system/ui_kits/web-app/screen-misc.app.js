(() => {
const { Button, Tabs, Input, Select, Card, Tag, Avatar, Switch, Checkbox, Alert, Dialog, Kicker, TaglineRoll, DotGlobe } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';

function ContentScreen({ data }) {
  const [type, setType] = React.useState('all');
  const [q, setQ] = React.useState('');
  const items = data.contents.filter((c) => (type === 'all' || c.type === type) && c.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader kicker="Biblioteca" title="Contenidos listos para" highlight="tu aula" subtitle="Material curado y alineado al currículo. Asignalo a cualquier aula en un clic." />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <Tabs variant="segmented" value={type} onChange={setType} items={[{ id: 'all', label: 'Todos' }, { id: 'Video', label: 'Videos' }, { id: 'Guía', label: 'Guías' }, { id: 'Ejercicios', label: 'Ejercicios' }, { id: 'Evaluación', label: 'Evaluaciones' }]} />
        <Input icon="search" size="sm" placeholder="Buscar contenido" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '280px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {items.map((c) => (
          <Card key={c.id} icon={c.icon} title={c.title} interactive padding="24px"
            footer={<div style={{ marginTop: 'auto', paddingTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}><Tag variant="neutral">{c.type}</Tag><Tag icon="clock">{c.minutes} min</Tag></div>}>
            {c.subject} · {c.level}
          </Card>
        ))}
      </div>
      {items.length === 0 && <p style={{ fontSize: '15px', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No encontramos contenidos con ese filtro.</p>}
    </div>
  );
}

const NOTIFS = [
  { k: 'deliveries', t: 'Entregas de tareas', d: 'Cuando un alumno entrega o se atrasa.' },
  { k: 'risk', t: 'Alertas de riesgo', d: 'Si un alumno baja su promedio o deja de participar.' },
  { k: 'messages', t: 'Mensajes de familias', d: 'Consultas nuevas en la mensajería del aula.' },
  { k: 'product', t: 'Novedades de NODS', d: 'Nuevos contenidos y funciones de la plataforma.' },
];

const THEMES = [
  { id: 'light', name: 'Claro', desc: 'Por defecto. Blanco puro.', bg: '#FFFFFF', surface: '#FFFFFF', line: '#E5E7EB', text: '#0A0A0A', muted: '#9CA3AF', accent: '#1946E3', soft: '#EEF2FE' },
  { id: 'dark', name: 'Grafito', desc: 'Oscuro neutro. Recomendado.', bg: '#0E0F12', surface: '#15171B', line: '#2C3038', text: '#F2F3F5', muted: '#7E8491', accent: '#6283FF', soft: 'rgba(98,131,255,.16)' },
  { id: 'dark-navy', name: 'Navy', desc: 'Azul profundo de la marca.', bg: '#081230', surface: '#0D1A40', line: '#22346C', text: '#F1F4FB', muted: '#8592BF', accent: '#7090FF', soft: 'rgba(112,144,255,.18)' },
  { id: 'dark-black', name: 'Negro', desc: 'Negro puro, solo líneas.', bg: '#000000', surface: '#000000', line: '#26282D', text: '#F5F5F6', muted: '#80848D', accent: '#6283FF', soft: 'rgba(98,131,255,.17)' },
];

function ThemePreview({ t }) {
  return (
    <div style={{ height: '96px', borderRadius: '10px', background: t.bg, border: `1px solid ${t.line}`, display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: '30%', borderRight: `1px solid ${t.line}`, background: t.surface, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '6px', boxSizing: 'border-box' }}>
        <span style={{ height: '6px', width: '70%', borderRadius: '3px', background: t.text, opacity: 0.85 }} />
        <span style={{ height: '10px', borderRadius: '4px', background: t.soft, marginTop: '6px' }} />
        <span style={{ height: '5px', width: '60%', borderRadius: '3px', background: t.muted, opacity: 0.6 }} />
        <span style={{ height: '5px', width: '50%', borderRadius: '3px', background: t.muted, opacity: 0.6 }} />
      </div>
      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '7px', boxSizing: 'border-box' }}>
        <span style={{ height: '7px', width: '55%', borderRadius: '3px', background: t.text }} />
        <div style={{ flex: 1, borderRadius: '6px', border: `1px solid ${t.line}`, background: t.surface, display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '6px' }}>
          {[40, 70, 55, 85].map((h, i) => <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', background: t.accent }} />)}
        </div>
      </div>
    </div>
  );
}

function AppearancePanel({ theme, onTheme }) {
  return (
    <Panel>
      <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>Tema de la interfaz</div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px' }}>Las presentaciones y documentos siempre se mantienen en blanco.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {THEMES.map((t) => {
          const on = theme === t.id;
          return (
            <button key={t.id} type="button" onClick={() => onTheme(t.id)} aria-pressed={on}
              style={{ textAlign: 'left', padding: '10px', borderRadius: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)', background: 'var(--surface)', border: on ? '1.5px solid var(--accent)' : 'var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'border-color .15s ease' }}>
              <ThemePreview t={t} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 2px' }}>
                <i className={`ti ti-${on ? 'circle-check-filled' : 'circle'}`} style={{ fontSize: '18px', color: on ? 'var(--accent)' : 'var(--gray-300)' }} />
                <span>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{t.name}</span>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function SettingsScreen({ data, theme, onTheme }) {
  const [tab, setTab] = React.useState(() => localStorage.getItem('nods-app-settings-tab') || 'profile');
  React.useEffect(() => { localStorage.setItem('nods-app-settings-tab', tab); }, [tab]);
  const [saved, setSaved] = React.useState(false);
  const [notif, setNotif] = React.useState({ deliveries: true, risk: true, messages: false, product: false });
  React.useEffect(() => { if (!saved) return undefined; const t = setTimeout(() => setSaved(false), 3500); return () => clearTimeout(t); }, [saved]);
  const [first, ...rest] = data.user.name.split(' ');
  return (
    <div style={{ maxWidth: '820px' }}>
      <PageHeader kicker="Cuenta" title="Ajustes" subtitle="Tus datos personales y cómo querés que te avisemos." />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'profile', label: 'Perfil', icon: 'user' }, { id: 'notifications', label: 'Notificaciones', icon: 'bell' }, { id: 'appearance', label: 'Apariencia', icon: 'palette' }]} style={{ marginBottom: '24px' }} />
      {saved && <Alert tone="success" title="Cambios guardados" onClose={() => setSaved(false)} style={{ marginBottom: '16px' }}>Tu configuración se actualizó correctamente.</Alert>}
      {tab === 'appearance' ? <AppearancePanel theme={theme} onTheme={onTheme} /> : tab === 'profile' ? (
        <Panel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', paddingBottom: '24px', borderBottom: hair, marginBottom: '24px' }}>
            <Avatar name={data.user.name} size={64} />
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ fontSize: '17px', fontWeight: 500 }}>{data.user.name}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{data.user.role} · {data.user.school}</div>
            </div>
            <Button variant="secondary" size="sm" icon="camera">Cambiar foto</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <Input label="Nombre" defaultValue={first} />
            <Input label="Apellido" defaultValue={rest.join(' ')} />
            <Input label="Email" icon="mail" defaultValue="laura.mendez@sanmartin.edu.ar" />
            <Input label="Teléfono" icon="phone" placeholder="+54 11 0000 0000" />
            <Select label="Institución" options={[data.user.school, 'Instituto Belgrano']} />
            <Select label="Idioma" options={['Español (Latinoamérica)', 'English', 'Português']} />
          </div>
        </Panel>
      ) : (
        <Panel>
          {NOTIFS.map((n, i) => (
            <div key={n.k} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 0', borderTop: i ? hair : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>{n.t}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.d}</div>
              </div>
              <Switch checked={notif[n.k]} onChange={(v) => setNotif({ ...notif, [n.k]: v })} />
            </div>
          ))}
          <div style={{ borderTop: hair, paddingTop: '20px', marginTop: '4px' }}>
            <Checkbox label="Recibir un resumen semanal por email" description="Todos los lunes, con el avance de cada aula." defaultChecked />
          </div>
        </Panel>
      )}
      {tab !== 'appearance' && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <Button variant="ghost">Cancelar</Button>
        <Button onClick={() => setSaved(true)}>Guardar cambios</Button>
      </div>}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = React.useState('laura.mendez@sanmartin.edu.ar');
  const [pass, setPass] = React.useState('');
  const [err, setErr] = React.useState({});
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!email.includes('@')) er.email = 'Ingresá un email válido.';
    if (pass.length < 4) er.pass = 'La contraseña debe tener al menos 4 caracteres.';
    setErr(er);
    if (!Object.keys(er).length) onLogin();
  };
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ flex: '1 1 50%', minWidth: 0, display: 'flex', flexDirection: 'column', padding: '40px 56px', boxSizing: 'border-box' }}>
        <img className="logo-light" src="../../assets/logo-nods-blue.png" alt="NODS — Technology for Education" style={{ height: '34px', width: 'auto', alignSelf: 'flex-start' }} />
        <img className="logo-dark" src="../../assets/logo-nods-white.png" alt="NODS — Technology for Education" style={{ height: '34px', width: 'auto', alignSelf: 'flex-start' }} />
        <form onSubmit={submit} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px', width: '100%', maxWidth: '400px', margin: '0 auto', padding: '40px 0' }}>
          <TaglineRoll size="md" style={{ alignSelf: 'flex-start' }} />
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: '34px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>Te damos la bienvenida a <span style={{ color: 'var(--accent)' }}>NODS.</span></h1>
          <p style={{ margin: '0 0 8px', fontSize: '16px', lineHeight: 1.55, color: 'var(--text-muted)' }}>Ingresá para ver tus aulas, tareas y analíticas.</p>
          <Input label="Email" icon="mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} />
          <Input label="Contraseña" icon="lock" type="password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} error={err.pass} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <Checkbox label="Recordarme" defaultChecked />
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '14px', fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
          </div>
          <Button type="submit" size="lg" style={{ width: '100%', marginTop: '6px' }}>Ingresar</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-faint)' }}><span style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />o<span style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} /></div>
          <Button type="button" variant="secondary" size="lg" icon="brand-google" onClick={onLogin} style={{ width: '100%' }}>Continuar con Google</Button>
        </form>
        <span style={{ fontSize: '13px', color: 'var(--text-faint)' }}>© 2026 NODS · Technology for Education</span>
      </div>
      <div style={{ flex: '1 1 50%', minWidth: 0, padding: '24px 24px 24px 0', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', height: '100%', minHeight: '520px', borderRadius: '24px', background: 'var(--surface-muted)', border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', boxSizing: 'border-box' }}>
          <DotGlobe size={460} />
          <div style={{ position: 'absolute', left: '32px', bottom: '32px', background: 'var(--surface)', border: hair, borderRadius: '16px', padding: '20px 24px' }}>
            <div style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)' }}>3.2M</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>alumnos en +40 países de América</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTaskDialog({ open, onClose, classes, onCreate }) {
  const [title, setTitle] = React.useState('');
  const [err, setErr] = React.useState('');
  React.useEffect(() => { if (open) { setTitle(''); setErr(''); } }, [open]);
  const create = () => { if (!title.trim()) { setErr('Poné un título para la tarea.'); return; } onCreate(title.trim()); };
  return (
    <Dialog open={open} onClose={onClose} title="Nueva tarea" description="Se publica en el aula y los alumnos reciben un aviso."
      footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button icon="check" onClick={create}>Crear tarea</Button></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input label="Título" placeholder="Ej. Práctica de ecuaciones lineales" value={title} onChange={(e) => { setTitle(e.target.value); setErr(''); }} error={err} autoFocus />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select label="Aula" options={classes.filter((c) => !c.archived).map((c) => ({ value: c.id, label: c.name }))} />
          <Select label="Tipo" options={['Práctica', 'Evaluación', 'Proyecto', 'Lectura']} />
        </div>
        <Input label="Fecha de entrega" type="date" defaultValue="2026-10-09" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', border: hair, borderRadius: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Notificar a los alumnos</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Aviso por email y en la app.</div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </Dialog>
  );
}

Object.assign(window, { ContentScreen, SettingsScreen, LoginScreen, NewTaskDialog });
})();
