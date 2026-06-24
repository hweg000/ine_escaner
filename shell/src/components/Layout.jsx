import { NavLink, useNavigate } from 'react-router-dom';
import { clearSession, getUser } from '../auth.js';

const NAV = [
  { to: '/',        icon: '👥', label: 'Clientes' },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = getUser();

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#1e3a5f', color: '#fff',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 24 }}>🏢</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>Inmobiliaria</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Sistema de gestión</div>
        </div>

        {/* Navegación */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to} to={to} end
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', textDecoration: 'none', fontSize: 14,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderRight: isActive ? '3px solid #60a5fa' : '3px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>{user?.role === 'admin' ? 'Administrador' : 'Agente'}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
          <button
            onClick={logout}
            style={{
              marginTop: 10, width: '100%', padding: '7px',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
              cursor: 'pointer', fontSize: 12,
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, background: '#f3f4f6', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
