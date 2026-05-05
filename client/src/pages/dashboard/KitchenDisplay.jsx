import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../../api/axios';

const socket = io('http://localhost:5000');

const STATUS_STYLES = {
  pending:   { bg: '#fff8f0', border: '#fcd34d', text: '#92400e', badge: '#f59e0b' },
  preparing: { bg: '#f0f7ff', border: '#93c5fd', text: '#1e40af', badge: '#3b82f6' },
  ready:     { bg: '#f0fff4', border: '#86efac', text: '#166534', badge: '#22c55e' },
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(r =>
      setOrders(r.data.filter(o => ['pending','preparing','ready'].includes(o.status)))
    );

    socket.on('new_order', o => setOrders(prev => [o, ...prev]));
    socket.on('order_updated', updated =>
      setOrders(prev =>
        prev.map(o => o._id === updated._id ? updated : o)
          .filter(o => ['pending','preparing','ready'].includes(o.status))
      )
    );

    return () => { socket.off('new_order'); socket.off('order_updated'); };
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#0f172a' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ color: '#f8fafc', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              Kitchen Display
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              {orders.length} active order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(74,222,128,0.1)', color: '#4ade80',
            padding: '6px 14px', borderRadius: '20px',
            fontSize: '13px', fontWeight: '700',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
            Live
          </div>
        </div>

        {/* Orders grid */}
        {orders.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '400px', flexDirection: 'column', gap: '12px',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(74,222,128,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              Kitchen is clear!
            </p>
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>No active orders right now</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {orders.map(order => {
              const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
              return (
                <div key={order._id} style={{
                  background: s.bg, border: `2px solid ${s.border}`,
                  borderRadius: '16px', padding: '20px',
                  transition: 'transform 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ color: s.text, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                      Table {order.tableNumber}
                    </span>
                    <span style={{
                      background: s.badge, color: '#fff',
                      fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: '20px',
                    }}>
                      {order.status}
                    </span>
                  </div>

                  {/* Time */}
                  <p style={{ color: s.text, fontSize: '12px', opacity: 0.7, margin: '0 0 12px' }}>
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Items */}
                  <div style={{ marginBottom: '14px' }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 0',
                        borderBottom: i < order.items.length - 1 ? `1px solid ${s.border}` : 'none',
                      }}>
                        <span style={{ color: s.text, fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
                        <span style={{
                          background: s.border, color: s.text,
                          fontWeight: '800', fontSize: '14px',
                          width: '28px', height: '28px', borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  {order.note && (
                    <div style={{
                      background: 'rgba(255,255,255,0.5)', borderRadius: '8px',
                      padding: '8px 12px', marginBottom: '14px',
                    }}>
                      <p style={{ color: s.text, fontSize: '12px', fontStyle: 'italic', margin: 0, opacity: 0.8 }}>
                        Note: {order.note}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {order.status === 'pending' && (
                      <button onClick={() => updateStatus(order._id, 'preparing')} style={{
                        flex: 1, padding: '10px',
                        background: '#3b82f6', color: '#fff',
                        border: 'none', borderRadius: '10px',
                        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => updateStatus(order._id, 'ready')} style={{
                        flex: 1, padding: '10px',
                        background: '#22c55e', color: '#fff',
                        border: 'none', borderRadius: '10px',
                        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button onClick={() => updateStatus(order._id, 'served')} style={{
                        flex: 1, padding: '10px',
                        background: '#1B3C53', color: '#D2C1B6',
                        border: 'none', borderRadius: '10px',
                        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Mark Served
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}