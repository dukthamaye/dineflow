import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#1B3C53', '#456882', '#2d6a4f', '#5a7a6e', '#7a6a5a'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/summary'), api.get('/analytics/revenue')])
      .then(([s, r]) => {
        setSummary(s.data);
        setRevenue(r.data.map(d => ({
          date: new Date(d._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          revenue: d.total, bills: d.count,
        })));
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const topItemsData = summary?.topItems?.map(i => ({ name: i._id, value: i.count })) || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#1B3C53', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Analytics</h1>
          <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>Revenue trends, top dishes and performance overview</p>
        </div>

        {loading ? <p style={{ color: '#456882' }}>Loading analytics...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Revenue',  value: `₹${(summary?.totalRevenue || 0).toLocaleString('en-IN')}`, accent: '#2d6a4f' },
                { label: 'Total Orders',   value: summary?.totalOrders  || 0, accent: '#1B3C53' },
                { label: "Today's Orders", value: summary?.todayOrders  || 0, accent: '#456882' },
                { label: 'Bills',          value: summary?.totalBills   || 0, accent: '#5a7a6e' },
              ].map(c => (
                <div key={c.label} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1.5px solid #e8e4df' }}>
                  <p style={{ color: '#456882', fontSize: '11px', fontWeight: '700', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</p>
                  <p style={{ color: c.accent, fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>{c.value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1.5px solid #e8e4df', marginBottom: '20px' }}>
              <h2 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 24px' }}>Revenue — Last 7 Days</h2>
              {revenue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontSize: '15px', margin: '0 0 6px', color: '#456882', fontWeight: '600' }}>No revenue data yet</p>
                  <p style={{ fontSize: '13px', margin: 0, color: '#bbb' }}>Generate some bills to see the chart</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={revenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B3C53" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#1B3C53" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false}/>
                    <XAxis dataKey="date" tick={{ fill: '#456882', fontSize: 12 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill: '#456882', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v.toLocaleString('en-IN')}`}/>
                    <Tooltip contentStyle={{ background: '#1B3C53', border: 'none', borderRadius: '10px', color: '#D2C1B6' }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}/>
                    <Area type="monotone" dataKey="revenue" stroke="#1B3C53" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#1B3C53', strokeWidth: 2, r: 4 }}/>
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1.5px solid #e8e4df' }}>
                <h2 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 24px' }}>Bills Per Day</h2>
                {revenue.length === 0 ? <p style={{ color: '#bbb', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No data yet</p> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false}/>
                      <XAxis dataKey="date" tick={{ fill: '#456882', fontSize: 12 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill: '#456882', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                      <Tooltip contentStyle={{ background: '#1B3C53', border: 'none', borderRadius: '10px', color: '#D2C1B6' }} formatter={v => [v, 'Bills']}/>
                      <Bar dataKey="bills" fill="#1B3C53" radius={[6, 6, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1.5px solid #e8e4df' }}>
                <h2 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 24px' }}>Top Dishes</h2>
                {topItemsData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: '15px', margin: '0 0 6px', color: '#456882', fontWeight: '600' }}>No order data yet</p>
                    <p style={{ fontSize: '13px', margin: 0, color: '#bbb' }}>Place some orders to see top dishes</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={topItemsData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                        {topItemsData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1B3C53', border: 'none', borderRadius: '10px', color: '#D2C1B6' }} formatter={v => [v, 'Orders']}/>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {topItemsData.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1.5px solid #e8e4df' }}>
                <h2 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 20px' }}>Top Selling Dishes</h2>
                {topItemsData.map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < topItemsData.length - 1 ? '1px solid #f0ede6' : 'none' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ flex: 1, color: '#1B3C53', fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
                    <div style={{ width: '140px', height: '6px', background: '#f0ede6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '3px', background: COLORS[i % COLORS.length], width: `${(item.value / topItemsData[0].value) * 100}%` }} />
                    </div>
                    <span style={{ color: '#2d6a4f', fontSize: '13px', fontWeight: '700', minWidth: '70px', textAlign: 'right' }}>{item.value} orders</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}