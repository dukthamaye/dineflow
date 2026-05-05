import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import api from '../api/axios';

export default function Login() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch(setCredentials(data));
      const routes = {
        admin:   '/dashboard',
        manager: '/dashboard',
        kitchen: '/kitchen',
        waiter:  '/tables',
        cashier: '/billing',
      };
      navigate(routes[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    background: '#f8f7f5',
    border: '1.5px solid #e8e4df',
    borderRadius: '10px',
    color: '#1B3C53',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      background: '#f8f7f5',
    }}>

      {/* ── Left panel — branding ── */}
      <div style={{
        width: '45%',
        background: '#1B3C53',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(210,193,182,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* big decorative circle */}
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(210,193,182,0.06)',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', left: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(210,193,182,0.05)',
        }} />

        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* Logo mark */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: '#D2C1B6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 4C10.268 4 4 10.268 4 18s6.268 14 14 14 14-6.268 14-14S25.732 4 18 4z" fill="#1B3C53" opacity="0.15"/>
              <path d="M12 10h4v16h-4V10zm8 0h4v16h-4V10z" fill="#1B3C53"/>
              <rect x="10" y="8" width="16" height="3" rx="1.5" fill="#1B3C53" opacity="0.6"/>
            </svg>
          </div>

          <h1 style={{
            color: '#D2C1B6', fontSize: '42px', fontWeight: '800',
            margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1,
          }}>
            Dineflow
          </h1>
          <p style={{
            color: '#456882', fontSize: '17px', margin: '0 0 48px', fontWeight: '400',
          }}>
            Order in. Chaos out.
          </p>

          {/* feature pills */}
          {[
            { icon: '⚡', text: 'Real-time kitchen orders' },
            { icon: '🍽️', text: 'Smart table management' },
            { icon: '📊', text: 'Live revenue analytics' },
          ].map(f => (
            <div key={f.text} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(210,193,182,0.08)',
              border: '1px solid rgba(210,193,182,0.12)',
              borderRadius: '12px', padding: '12px 18px',
              marginBottom: '10px', textAlign: 'left',
            }}>
              <span style={{ fontSize: '18px' }}>{f.icon}</span>
              <span style={{ color: '#D2C1B6', fontSize: '14px', fontWeight: '500' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <h2 style={{
            color: '#1B3C53', fontSize: '30px', fontWeight: '700',
            margin: '0 0 8px', letterSpacing: '-0.5px',
          }}>
            Welcome back
          </h2>
          <p style={{ color: '#456882', fontSize: '15px', margin: '0 0 36px' }}>
            Sign in to your Dineflow staff account
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fff0f0', border: '1.5px solid #fca5a5',
              borderRadius: '10px', padding: '13px 16px',
              color: '#dc2626', fontSize: '14px',
              marginBottom: '24px', fontWeight: '500',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', color: '#1B3C53',
                fontSize: '14px', fontWeight: '600', marginBottom: '8px',
              }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="staff@dineflow.in"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1B3C53'}
                onBlur={e  => e.target.style.borderColor = '#e8e4df'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block', color: '#1B3C53',
                fontSize: '14px', fontWeight: '600', marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1B3C53'}
                onBlur={e  => e.target.style.borderColor = '#e8e4df'}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#456882' : '#1B3C53',
                color: '#D2C1B6', fontWeight: '700',
                fontSize: '16px', borderRadius: '10px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.2px',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#234C6A'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#1B3C53'; }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

          </form>

          {/* Role guide */}
          <div style={{
            marginTop: '36px', padding: '16px 18px',
            background: '#fff', borderRadius: '12px',
            border: '1.5px solid #e8e4df',
          }}>
            <p style={{
              color: '#456882', fontSize: '11px', fontWeight: '700',
              letterSpacing: '0.08em', margin: '0 0 10px',
              textTransform: 'uppercase',
            }}>
              Role access guide
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { role: 'Admin',   color: '#1B3C53', dest: 'Full dashboard' },
                { role: 'Manager', color: '#234C6A', dest: 'Dashboard + analytics' },
                { role: 'Waiter',  color: '#456882', dest: 'Tables + orders' },
                { role: 'Kitchen', color: '#5a7a6e', dest: 'KOT display' },
                { role: 'Cashier', color: '#7a6a5a', dest: 'Billing screen' },
              ].map(r => (
                <div key={r.role} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontSize: '13px', fontWeight: '600',
                    color: r.color,
                  }}>{r.role}</span>
                  <span style={{
                    fontSize: '12px', color: '#888',
                  }}>{r.dest}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}