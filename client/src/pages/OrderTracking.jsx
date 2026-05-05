import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';

const STATUS_STEPS = ['pending', 'preparing', 'ready', 'served'];

const STATUS_INFO = {
  pending:   { label: 'Order Received',  desc: 'Your order has been received and sent to kitchen', color: '#f59e0b' },
  preparing: { label: 'Preparing',       desc: 'The kitchen is preparing your food',               color: '#3b82f6' },
  ready:     { label: 'Ready to Serve',  desc: 'Your food is ready and will be served shortly',    color: '#8b5cf6' },
  served:    { label: 'Served',          desc: 'Enjoy your meal!',                                 color: '#22c55e' },
  billed:    { label: 'Billed',          desc: 'Your bill has been generated',                     color: '#1B3C53' },
};

export default function OrderTracking() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    const socket = io('http://localhost:5000');
    socket.on('order_updated', updated => {
      if (updated._id === id) setOrder(updated);
    });
    return () => socket.disconnect();
  }, [id]);

  const currentStep  = STATUS_STEPS.indexOf(order?.status);
  const statusInfo   = STATUS_INFO[order?.status] || STATUS_INFO.pending;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: '#fff', borderBottom: '1.5px solid #e8e4df',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: '#1B3C53', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h8v2H8V6z" fill="#D2C1B6" opacity="0.7"/>
              <path d="M9 8h2v10H9V8zm4 0h2v10h-2V8z" fill="#D2C1B6"/>
            </svg>
          </div>
          <span style={{ fontWeight: '800', fontSize: '18px', color: '#1B3C53', letterSpacing: '-0.5px' }}>
            Dineflow
          </span>
        </div>
        <button onClick={() => navigate('/menu')} style={{
          padding: '9px 18px', background: '#1B3C53', color: '#D2C1B6',
          border: 'none', borderRadius: '8px', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          Order More
        </button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#456882' }}>Loading order...</p>
        ) : !order ? (
          <p style={{ textAlign: 'center', color: '#456882' }}>Order not found</p>
        ) : (
          <>
            {/* Status card */}
            <div style={{
              background: '#1B3C53', borderRadius: '20px',
              padding: '32px', marginBottom: '20px', textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: statusInfo.color, margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  {order.status === 'served' || order.status === 'billed' ? (
                    <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  )}
                </svg>
              </div>
              <h2 style={{ color: '#D2C1B6', fontSize: '22px', fontWeight: '800', margin: '0 0 8px' }}>
                {statusInfo.label}
              </h2>
              <p style={{ color: 'rgba(210,193,182,0.7)', fontSize: '14px', margin: '0 0 16px' }}>
                {statusInfo.desc}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(74,222,128,0.15)', color: '#4ade80',
                fontSize: '12px', fontWeight: '700',
                padding: '5px 12px', borderRadius: '20px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}/>
                Live tracking
              </div>
            </div>

            {/* Progress steps */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              border: '1.5px solid #e8e4df', padding: '24px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700', margin: '0 0 20px' }}>
                Order Progress
              </h3>
              {STATUS_STEPS.map((step, i) => {
                const done    = i <= currentStep;
                const current = i === currentStep;
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: i < STATUS_STEPS.length - 1 ? '16px' : 0 }}>
                    {/* Circle */}
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: done ? '#1B3C53' : '#f8f7f5',
                      border: current ? '2px solid #1B3C53' : done ? 'none' : '1.5px solid #e8e4df',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="#D2C1B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e8e4df' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        color: done ? '#1B3C53' : '#bbb',
                        fontSize: '14px', fontWeight: current ? '700' : '500', margin: 0,
                        textTransform: 'capitalize',
                      }}>
                        {STATUS_INFO[step]?.label}
                      </p>
                    </div>
                    {current && (
                      <span style={{
                        background: '#f0f7f0', color: '#2d6a4f',
                        fontSize: '11px', fontWeight: '700',
                        padding: '3px 8px', borderRadius: '6px',
                      }}>
                        Now
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order items */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              border: '1.5px solid #e8e4df', padding: '24px',
            }}>
              <h3 style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700', margin: '0 0 16px' }}>
                Your Order · Table {order.tableNumber}
              </h3>
              {order.items?.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i < order.items.length - 1 ? '1px solid #f0ede6' : 'none',
                }}>
                  <span style={{ color: '#456882', fontSize: '14px' }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '600' }}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: '14px', marginTop: '4px',
                borderTop: '1.5px solid #e8e4df',
              }}>
                <span style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700' }}>Total</span>
                <span style={{ color: '#2d6a4f', fontSize: '18px', fontWeight: '800' }}>
                  ₹{order.items?.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(0)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}