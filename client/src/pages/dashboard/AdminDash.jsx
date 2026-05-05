import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDash() {
  const { user } = useSelector(s => s.auth);
  const navigate  = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/summary')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px' }}>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ color: '#1B3C53', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            Good {timeOfDay()}, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {loading ? (
          <div style={{ color: '#456882', fontSize: '14px' }}>Loading stats...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Orders',   value: stats?.totalOrders ?? '—',  sub: 'all time',       accent: '#1B3C53' },
                { label: "Today's Orders", value: stats?.todayOrders ?? '—',  sub: 'since midnight', accent: '#234C6A' },
                { label: 'Total Revenue',  value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—', sub: 'from paid bills', accent: '#2d6a4f' },
                { label: 'Total Tables',   value: stats?.totalTables ?? '—',  sub: 'in restaurant',  accent: '#5a7a6e' },
              ].map(c => (
                <div key={c.label} style={{
                  background: '#fff', borderRadius: '14px',
                  padding: '22px 20px', border: '1.5px solid #e8e4df',
                }}>
                  <p style={{ color: '#456882', fontSize: '12px', fontWeight: '600', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {c.label}
                  </p>
                  <p style={{ color: c.accent, fontSize: '32px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-1px' }}>
                    {c.value}
                  </p>
                  <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>{c.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1.5px solid #e8e4df' }}>
                <h2 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 20px' }}>
                  Top selling dishes
                </h2>
                {stats?.topItems?.length ? stats.topItems.map((item, i) => (
                  <div key={item._id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: i < stats.topItems.length - 1 ? '1px solid #f0ede6' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: '#f8f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#1B3C53', fontSize: '12px', fontWeight: '700',
                      }}>{i + 1}</div>
                      <span style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '500' }}>{item._id}</span>
                    </div>
                    <span style={{
                      background: '#f0f7f0', color: '#2d6a4f',
                      fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
                    }}>{item.count} orders</span>
                  </div>
                )) : <p style={{ color: '#bbb', fontSize: '14px' }}>No order data yet</p>}
              </div>

              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1.5px solid #e8e4df' }}>
                <h2 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 20px' }}>
                  Quick actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Analytics',     path: '/analytics',    bg: '#1B3C53', text: '#D2C1B6' },
                    { label: 'Tables',        path: '/tables',       bg: '#234C6A', text: '#D2C1B6' },
                    { label: 'Kitchen',       path: '/kitchen',      bg: '#2d6a4f', text: '#fff'    },
                    { label: 'Billing',       path: '/billing',      bg: '#5a7a6e', text: '#fff'    },
                    { label: 'Manage Menu',   path: '/menu-manager', bg: '#7a6a5a', text: '#fff'    },
                    { label: 'View Menu',     path: '/menu',         bg: '#f8f7f5', text: '#1B3C53' },
                  ].map(a => (
                    <button key={a.label} onClick={() => navigate(a.path)} style={{
                      padding: '14px 12px', background: a.bg, color: a.text,
                      border: a.bg === '#f8f7f5' ? '1.5px solid #e8e4df' : 'none',
                      borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textAlign: 'center',
                    }}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              background: '#1B3C53', borderRadius: '14px', padding: '24px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ color: '#D2C1B6', fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>
                  Total bills processed
                </p>
                <p style={{ color: '#456882', fontSize: '13px', margin: 0 }}>All paid invoices</p>
              </div>
              <div style={{ color: '#D2C1B6', fontSize: '40px', fontWeight: '800', letterSpacing: '-1px' }}>
                {stats?.totalBills ?? '—'}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}