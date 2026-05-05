import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { addToCart, removeFromCart, clearCart } from '../store/cartSlice';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';

export default function Cart() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const cartItems = useSelector(s => s.cart.items);
  const [placing, setPlacing] = useState(false);
  const [note,    setNote]    = useState('');

  const tableNo   = localStorage.getItem('tableNumber');
  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst       = subtotal * 0.05;
  const total     = subtotal + gst;

  const placeOrder = async () => {
    if (!tableNo) return toast.error('Please set your table number first!');
    if (cartItems.length === 0) return toast.error('Cart is empty!');
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        tableNumber: Number(tableNo),
        items: cartItems.map(i => ({
          menuItem: i._id,
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
        })),
        note,
      });
      dispatch(clearCart());
      toast.success('Order placed!', {
        style: { background: '#1B3C53', color: '#D2C1B6' },
      });
      navigate(`/track/${data._id}`);
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) return (
    <div style={{
      minHeight: '100vh', background: '#f8f7f5',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Toaster position="top-right" />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</p>
        <h2 style={{ color: '#1B3C53', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>
          Your cart is empty
        </h2>
        <p style={{ color: '#456882', fontSize: '15px', margin: '0 0 28px' }}>
          Add some delicious dishes from our menu
        </p>
        <button onClick={() => navigate('/menu')} style={{
          padding: '13px 32px', background: '#1B3C53', color: '#D2C1B6',
          border: 'none', borderRadius: '12px', fontWeight: '700',
          fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          Browse Menu
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5', minHeight: '100vh' }}>
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: '#fff', borderBottom: '1.5px solid #e8e4df',
        position: 'sticky', top: 0, zIndex: 100,
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
          padding: '9px 18px', background: 'transparent', color: '#1B3C53',
          border: '1.5px solid #e8e4df', borderRadius: '8px', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          Back to Menu
        </button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 40px' }}>
        <h1 style={{ color: '#1B3C53', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          Your Cart
        </h1>
        <p style={{ color: '#456882', fontSize: '14px', margin: '0 0 28px' }}>
          Table {tableNo || '?'} · {cartItems.length} item{cartItems.length > 1 ? 's' : ''}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* Cart items */}
          <div>
            <div style={{
              background: '#fff', borderRadius: '16px',
              border: '1.5px solid #e8e4df', overflow: 'hidden',
              marginBottom: '16px',
            }}>
              {cartItems.map((item, i) => (
                <div key={item._id} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '18px 20px',
                  borderBottom: i < cartItems.length - 1 ? '1px solid #f0ede6' : 'none',
                }}>
                  {/* Veg indicator */}
                  <div style={{
                    width: '18px', height: '18px', flexShrink: 0,
                    border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
                    borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: item.isVeg ? '#22c55e' : '#ef4444',
                    }} />
                  </div>

                  {/* Name + price */}
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '600', margin: '0 0 2px' }}>
                      {item.name}
                    </p>
                    <p style={{ color: '#456882', fontSize: '13px', margin: 0 }}>
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => dispatch(removeFromCart(item._id))} style={{
                      width: '30px', height: '30px', background: '#f8f7f5',
                      border: '1.5px solid #e8e4df', borderRadius: '7px',
                      fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#1B3C53',
                    }}>−</button>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#1B3C53', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => dispatch(addToCart(item))} style={{
                      width: '30px', height: '30px', background: '#1B3C53',
                      border: 'none', borderRadius: '7px',
                      fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#D2C1B6',
                    }}>+</button>
                  </div>

                  {/* Item total */}
                  <span style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700', minWidth: '70px', textAlign: 'right' }}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Note */}
            <div style={{
              background: '#fff', borderRadius: '14px',
              border: '1.5px solid #e8e4df', padding: '18px 20px',
            }}>
              <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                Special instructions (optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Any allergies or special requests..."
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #e8e4df', borderRadius: '9px',
                  fontSize: '14px', color: '#1B3C53', background: '#f8f7f5',
                  fontFamily: "'DM Sans', sans-serif", outline: 'none',
                  resize: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Order summary */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1.5px solid #e8e4df', padding: '24px',
            position: 'sticky', top: '80px',
          }}>
            <h2 style={{ color: '#1B3C53', fontSize: '17px', fontWeight: '700', margin: '0 0 20px' }}>
              Order Summary
            </h2>

            {/* Table info */}
            <div style={{
              background: tableNo ? '#f0fff4' : '#fff0f0',
              border: `1.5px solid ${tableNo ? '#86efac' : '#fca5a5'}`,
              borderRadius: '10px', padding: '12px 14px', marginBottom: '20px',
            }}>
              <p style={{ color: tableNo ? '#166534' : '#991b1b', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                {tableNo ? `Table ${tableNo}` : 'No table set — go back to menu!'}
              </p>
            </div>

            {/* Price breakdown */}
            <div style={{ marginBottom: '20px' }}>
              {cartItems.map(item => (
                <div key={item._id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0',
                }}>
                  <span style={{ color: '#456882', fontSize: '13px' }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ color: '#1B3C53', fontSize: '13px', fontWeight: '500' }}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1.5px solid #e8e4df', paddingTop: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#456882', fontSize: '14px' }}>Subtotal</span>
                <span style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '600' }}>₹{subtotal.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#456882', fontSize: '14px' }}>GST (5%)</span>
                <span style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '600' }}>₹{gst.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700' }}>Total</span>
                <span style={{ color: '#2d6a4f', fontSize: '20px', fontWeight: '800' }}>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              style={{
                width: '100%', padding: '14px',
                background: placing ? '#456882' : '#1B3C53',
                color: '#D2C1B6', border: 'none', borderRadius: '12px',
                fontWeight: '700', fontSize: '16px',
                cursor: placing ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '10px',
              }}
            >
              {placing ? 'Placing order...' : 'Place Order →'}
            </button>

            <button
              onClick={() => { dispatch(clearCart()); navigate('/menu'); }}
              style={{
                width: '100%', padding: '11px',
                background: 'transparent', color: '#456882',
                border: '1.5px solid #e8e4df', borderRadius: '10px',
                fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}