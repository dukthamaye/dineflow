import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/authSlice';

const ALL_NAV = [
  { label: 'Dashboard',   path: '/dashboard',    roles: ['admin','manager'] },
  { label: 'Analytics',   path: '/analytics',    roles: ['admin','manager'] },
  { label: 'Tables',      path: '/tables',       roles: ['admin','manager','waiter'] },
  { label: 'Kitchen',     path: '/kitchen',      roles: ['admin','manager','kitchen'] },
  { label: 'Billing',     path: '/billing',      roles: ['admin','manager','cashier'] },
  { label: 'Manage Menu', path: '/menu-manager', roles: ['admin','manager'] },
];

export default function Sidebar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useSelector(s => s.auth);

  const navItems = ALL_NAV.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside style={{
      width: '240px', background: '#1B3C53',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(210,193,182,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: '#D2C1B6', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h8v2H8V6z" fill="#1B3C53" opacity="0.7"/>
              <path d="M9 8h2v10H9V8zm4 0h2v10h-2V8z" fill="#1B3C53"/>
            </svg>
          </div>
          <span style={{ color: '#D2C1B6', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>
            Dineflow
          </span>
        </div>
      </div>

      {/* User chip */}
      <div style={{ margin: '16px 16px 8px', background: 'rgba(210,193,182,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
        <p style={{ color: '#D2C1B6', fontSize: '13px', fontWeight: '600', margin: '0 0 2px' }}>
          {user?.name}
        </p>
        <p style={{ color: '#456882', fontSize: '11px', margin: 0, textTransform: 'capitalize' }}>
          {user?.role}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.label} onClick={() => navigate(item.path)} style={{
              width: '100%', textAlign: 'left', padding: '11px 14px', marginBottom: '2px',
              background: active ? 'rgba(210,193,182,0.12)' : 'transparent',
              border: active ? '1px solid rgba(210,193,182,0.15)' : '1px solid transparent',
              borderRadius: '9px',
              color: active ? '#D2C1B6' : '#456882',
              fontSize: '14px', fontWeight: active ? '600' : '400',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#D2C1B6'; e.currentTarget.style.background = 'rgba(210,193,182,0.06)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#456882'; e.currentTarget.style.background = 'transparent'; }}}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(210,193,182,0.1)' }}>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '11px 14px',
          background: 'transparent', border: '1px solid rgba(210,193,182,0.15)',
          borderRadius: '9px', color: '#456882', fontSize: '14px',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.15s', textAlign: 'left',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#456882'; e.currentTarget.style.borderColor = 'rgba(210,193,182,0.15)'; }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}