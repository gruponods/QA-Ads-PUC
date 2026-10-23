(() => {
const { IconButton, Avatar, Input, Kicker, TaglineRoll } = window.NodsDesignSystem_bde349;
const hair = '1px solid var(--gray-200)';

const NAV = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'classes', label: 'Aulas', icon: 'school' },
  { id: 'tracking', label: 'Seguimiento', icon: 'table' },
  { id: 'performance', label: 'Rendimiento', icon: 'chart-bar' },
  { id: 'funnel', label: 'Funnel', icon: 'filter' },
  { id: 'social', label: 'Redes sociales', icon: 'brand-instagram' },
  { id: 'persona', label: 'Buyer persona', icon: 'user-search' },
  { id: 'content', label: 'Contenidos', icon: 'books' },
  { id: 'reach', label: 'Red regional', icon: 'world' },
];

function NavItem({ item, active, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, textAlign: 'left', transition: 'background .15s ease', background: active ? 'var(--accent-soft)' : h ? 'var(--gray-050)' : 'transparent', color: active ? 'var(--accent-strong)' : 'var(--text)' }}>
      <i className={`ti ti-${item.icon}`} style={{ fontSize: '20px', color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
      {item.label}
    </button>
  );
}

function Sidebar({ current, onNavigate, user, onLogout }) {
  return (
    <aside style={{ width: 'var(--app-sidebar-w)', flex: '0 0 var(--app-sidebar-w)', height: '100vh', position: 'sticky', top: 0, boxSizing: 'border-box', borderRight: hair, background: 'var(--surface)', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
      <img className="logo-light" src="../../assets/logo-nods-blue.png" alt="NODS — Technology for Education" style={{ height: '30px', width: 'auto', alignSelf: 'flex-start', margin: '4px 12px 36px' }} />
      <img className="logo-dark" src="../../assets/logo-nods-white.png" alt="NODS — Technology for Education" style={{ height: '30px', width: 'auto', alignSelf: 'flex-start', margin: '4px 12px 36px' }} />
      <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', margin: '0 12px 10px' }}>Menú</span>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV.map((n) => <NavItem key={n.id} item={n} active={current === n.id} onClick={() => onNavigate(n.id)} />)}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavItem item={{ id: 'settings', label: 'Ajustes', icon: 'settings' }} active={current === 'settings'} onClick={() => onNavigate('settings')} />
        <div style={{ borderTop: hair, marginTop: '12px', padding: '16px 4px 0 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={user.name} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.role}</div>
          </div>
          <IconButton icon="logout" label="Cerrar sesión" size="sm" onClick={onLogout} />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumbs = [], onCrumb, dark, onToggleTheme }) {
  const [vw, setVw] = React.useState(window.innerWidth);
  React.useEffect(() => { const f = () => setVw(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return (
    <header style={{ height: 'var(--app-topbar-h)', flex: '0 0 auto', boxSizing: 'border-box', borderBottom: hair, background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 5, display: 'flex', alignItems: 'center', gap: '12px', padding: '0 32px' }}>
      <nav style={{ flex: '1 1 auto', minWidth: '140px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', overflow: 'hidden' }}>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          const link = !last && c.to;
          return (
            <React.Fragment key={i}>
              {i > 0 && <i className="ti ti-chevron-right" style={{ fontSize: '14px', color: 'var(--gray-300)' }} />}
              <span onClick={link ? () => onCrumb(c.to) : undefined} style={{ color: last ? 'var(--text)' : 'var(--text-muted)', fontWeight: last ? 500 : 400, cursor: link ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>{c.label}</span>
            </React.Fragment>
          );
        })}
      </nav>
      <Input icon="search" size="sm" placeholder="Buscar alumnos, aulas o contenidos" style={{ flex: '0 1 300px', minWidth: '160px' }} />
      {vw >= 1180 && <TaglineRoll style={{ margin: '0 6px 0 8px', flex: '0 0 auto' }} />}
      <IconButton icon={dark ? 'sun' : 'moon'} label={dark ? 'Modo claro' : 'Modo oscuro'} onClick={onToggleTheme} />
      <IconButton icon="bell" label="Notificaciones" badge />
      <IconButton icon="help-circle" label="Ayuda" />
    </header>
  );
}

function PageHeader({ kicker, title, highlight, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0, flex: '1 1 380px' }}>
        {kicker && <Kicker>{kicker}</Kicker>}
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: '30px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{title}{highlight && <> <span style={{ color: 'var(--accent)' }}>{highlight}</span></>}</h1>
        {subtitle && <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.55, color: 'var(--text-muted)', maxWidth: '62ch' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

function Panel({ title, action, children, style = {} }) {
  return (
    <section style={{ border: hair, borderRadius: '16px', background: 'var(--surface)', padding: '24px', minWidth: 0, boxSizing: 'border-box', ...style }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px 12px', marginBottom: '18px' }}>
          {title && <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 500, whiteSpace: 'nowrap' }}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

Object.assign(window, { Sidebar, Topbar, PageHeader, Panel });
})();
