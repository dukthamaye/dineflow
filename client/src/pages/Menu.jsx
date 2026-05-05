import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { addToCart, removeFromCart } from '../store/cartSlice';
import api from '../api/axios';

import menuImg from '../assets/picture 2.jpg';
import dishImg from '../assets/picture 3.jpg';

export default function Menu() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const cartItems = useSelector(s => s.cart.items);

  const [items,          setItems]          = useState([]);
  const [activecat,      setActiveCat]      = useState('All');
  const [search,         setSearch]         = useState('');
  const [loading,        setLoading]        = useState(true);
  const [tableNo,        setTableNo]        = useState('');
  const [tableInput,     setTableInput]     = useState('');
  const [tableStatus,    setTableStatus]    = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [availableTables,setAvailableTables]= useState([]);
  const [queueName,      setQueueName]      = useState('');
  const [guestCount,     setGuestCount]     = useState('');
  const [queueJoined,    setQueueJoined]    = useState(false);
  const [checkingTable,  setCheckingTable]  = useState(false);
  const [activeSection,  setActiveSection]  = useState('veg');

  useEffect(() => {
    api.get('/menu').then(({ data }) => setItems(data))
      .catch(console.error).finally(() => setLoading(false));
    const saved = localStorage.getItem('tableNumber');
    if (saved) { setTableNo(saved); setTableInput(saved); }
  }, []);

  const vegItems    = items.filter(i => i.isVeg);
  const nonVegItems = items.filter(i => !i.isVeg);
  const sourceItems = activeSection === 'veg' ? vegItems : nonVegItems;
  const cats        = ['All', ...new Set(sourceItems.map(i => i.category).filter(Boolean))];

  const filtered = sourceItems.filter(item => {
    const matchCat    = activecat === 'All' || item.category === activecat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.available !== false;
  });

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const getQty    = id => cartItems.find(i => i._id === id)?.quantity || 0;

  const handleAdd    = item => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added`, {
      duration: 1200,
      style: { background: '#1B3C53', color: '#D2C1B6', fontFamily: "'DM Sans', sans-serif" },
    });
  };
  const handleRemove = item => dispatch(removeFromCart(item._id));

  const checkTable = async () => {
    if (!tableInput) return toast.error('Enter a table number');
    setCheckingTable(true);
    try {
      const { data } = await api.get(`/tables/number/${tableInput}`);
      if (data.status === 'available') {
        setTableNo(tableInput);
        localStorage.setItem('tableNumber', tableInput);
        toast.success(`Table ${tableInput} is yours!`, {
          style: { background: '#1B3C53', color: '#D2C1B6' },
        });
      } else {
        setTableStatus(data);
        const allRes = await api.get('/tables');
        setAvailableTables(allRes.data.filter(t => t.status === 'available'));
        setShowTableModal(true);
      }
    } catch (e) {
      toast.error('Table not found — ask your waiter');
    } finally {
      setCheckingTable(false);
    }
  };

  const joinQueue = async () => {
    if (!queueName) return toast.error('Enter your name');
    try {
      const { data } = await api.post(`/tables/number/${tableStatus.number}/queue`, {
        name: queueName,
        guestCount: Number(guestCount) || 1,
      });
      setQueueJoined(true);
      toast.success(`You are #${data.position} in queue!`, {
        duration: 4000,
        style: { background: '#1B3C53', color: '#D2C1B6' },
      });
    } catch (e) {
      toast.error('Failed to join queue');
    }
  };

  const selectAvailableTable = num => {
    setTableNo(String(num));
    setTableInput(String(num));
    localStorage.setItem('tableNumber', String(num));
    setShowTableModal(false);
    setTableStatus(null);
    setQueueJoined(false);
    toast.success(`Table ${num} selected!`, {
      style: { background: '#1B3C53', color: '#D2C1B6' },
    });
  };

  const clearTable = () => {
    setTableNo('');
    setTableInput('');
    localStorage.removeItem('tableNumber');
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5', minHeight: '100vh' }}>
      <Toaster position="top-right" />

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: '#fff', borderBottom: '1.5px solid #e8e4df',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Logo */}
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

        {/* Table selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tableNo ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#f0fff4', border: '1.5px solid #86efac',
              borderRadius: '8px', padding: '6px 12px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ color: '#166534', fontSize: '13px', fontWeight: '600' }}>
                Table {tableNo}
              </span>
              <button onClick={clearTable} style={{
                background: 'none', border: 'none', color: '#166534',
                cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '0 2px',
              }}>×</button>
            </div>
          ) : (
            <>
              <input
                type="number" placeholder="Table no."
                value={tableInput}
                onChange={e => setTableInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkTable()}
                style={{
                  width: '90px', padding: '8px 12px',
                  border: '1.5px solid #e8e4df', borderRadius: '8px',
                  fontSize: '14px', color: '#1B3C53', background: '#f8f7f5',
                  fontFamily: "'DM Sans', sans-serif", outline: 'none',
                }}
              />
              <button onClick={checkTable} disabled={checkingTable} style={{
                padding: '8px 14px', background: '#1B3C53', color: '#D2C1B6',
                border: 'none', borderRadius: '8px', fontWeight: '600',
                fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                {checkingTable ? '...' : 'Set Table'}
              </button>
            </>
          )}
        </div>

        {/* Cart */}
        {cartCount > 0 && (
          <button onClick={() => navigate('/cart')} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 20px', background: '#1B3C53', color: '#D2C1B6',
            border: 'none', borderRadius: '10px', fontWeight: '700',
            fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            <span style={{
              background: '#D2C1B6', color: '#1B3C53',
              width: '22px', height: '22px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '800',
            }}>{cartCount}</span>
            View Cart · ₹{cartTotal.toFixed(0)}
          </button>
        )}
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img src={menuImg} alt="Menu" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,60,83,0.88) 40%, rgba(27,60,83,0.4) 100%)',
          display: 'flex', alignItems: 'center', padding: '0 48px',
        }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-1px' }}>
              Our Menu
            </h1>
            <p style={{ color: 'rgba(210,193,182,0.85)', fontSize: '15px', margin: 0 }}>
              {items.length} dishes · Fresh every day
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{
        position: 'sticky', top: '64px', zIndex: 90,
        background: '#fff', borderBottom: '1.5px solid #e8e4df',
        padding: '14px 40px',
      }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
          <button onClick={() => { setActiveSection('veg'); setActiveCat('All'); }} style={{
            padding: '10px 24px',
            background: activeSection === 'veg' ? '#f0fff4' : '#f8f7f5',
            color: activeSection === 'veg' ? '#166534' : '#456882',
            border: activeSection === 'veg' ? '2px solid #22c55e' : '1.5px solid #e8e4df',
            borderRadius: '10px', fontWeight: '700', fontSize: '14px',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <div style={{
              width: '14px', height: '14px', border: '2px solid #22c55e',
              borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            Veg ({vegItems.length})
          </button>

          <button onClick={() => { setActiveSection('nonveg'); setActiveCat('All'); }} style={{
            padding: '10px 24px',
            background: activeSection === 'nonveg' ? '#fff0f0' : '#f8f7f5',
            color: activeSection === 'nonveg' ? '#991b1b' : '#456882',
            border: activeSection === 'nonveg' ? '2px solid #ef4444' : '1.5px solid #e8e4df',
            borderRadius: '10px', fontWeight: '700', fontSize: '14px',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <div style={{
              width: '14px', height: '14px', border: '2px solid #ef4444',
              borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
            </div>
            Non-Veg ({nonVegItems.length})
          </button>

          <input
            type="text" placeholder="Search dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              marginLeft: 'auto',
              padding: '9px 16px', border: '1.5px solid #e8e4df',
              borderRadius: '9px', fontSize: '14px', color: '#1B3C53',
              background: '#f8f7f5', fontFamily: "'DM Sans', sans-serif",
              outline: 'none', width: '220px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding: '7px 16px',
              background: activecat === cat ? '#1B3C53' : '#f8f7f5',
              color: activecat === cat ? '#D2C1B6' : '#456882',
              border: activecat === cat ? 'none' : '1.5px solid #e8e4df',
              borderRadius: '20px', fontWeight: '600', fontSize: '13px',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu Grid ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 40px' }}>
        {loading ? (
          <p style={{ color: '#456882', textAlign: 'center', padding: '60px' }}>Loading menu...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#1B3C53', fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>No dishes found</p>
            <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>Try a different category or search term</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map(item => {
              const qty = getQty(item._id);
              return (
                <div key={item._id} style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1.5px solid #e8e4df', overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,60,83,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#f8f7f5' }}>
                    <img
                      src={item.image || dishImg}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = dishImg; }}
                    />
                    <div style={{
                      position: 'absolute', top: '10px', left: '10px',
                      width: '20px', height: '20px',
                      border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
                      borderRadius: '4px', background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: item.isVeg ? '#22c55e' : '#ef4444',
                      }} />
                    </div>
                    {item.category && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(27,60,83,0.85)', color: '#D2C1B6',
                        fontSize: '11px', fontWeight: '600',
                        padding: '3px 8px', borderRadius: '6px',
                      }}>
                        {item.category}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '16px' }}>
                    <h3 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p style={{
                        color: '#456882', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#1B3C53', fontSize: '18px', fontWeight: '800' }}>
                        ₹{item.price}
                      </span>
                      {qty === 0 ? (
                        <button onClick={() => handleAdd(item)} style={{
                          padding: '8px 20px', background: '#1B3C53', color: '#D2C1B6',
                          border: 'none', borderRadius: '8px', fontWeight: '700',
                          fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>Add</button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button onClick={() => handleRemove(item)} style={{
                            width: '32px', height: '32px', background: '#f8f7f5',
                            border: '1.5px solid #e8e4df', borderRadius: '8px',
                            fontWeight: '700', fontSize: '18px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#1B3C53',
                          }}>−</button>
                          <span style={{ fontWeight: '700', fontSize: '16px', color: '#1B3C53', minWidth: '16px', textAlign: 'center' }}>
                            {qty}
                          </span>
                          <button onClick={() => handleAdd(item)} style={{
                            width: '32px', height: '32px', background: '#1B3C53',
                            border: 'none', borderRadius: '8px',
                            fontWeight: '700', fontSize: '18px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#D2C1B6',
                          }}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Sticky cart bar ── */}
      {cartCount > 0 && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 200,
          background: '#1B3C53', color: '#D2C1B6',
          borderRadius: '16px', padding: '16px 28px',
          display: 'flex', alignItems: 'center', gap: '24px',
          boxShadow: '0 8px 32px rgba(27,60,83,0.35)',
          minWidth: '360px',
        }}>
          <div style={{
            background: '#D2C1B6', color: '#1B3C53',
            width: '28px', height: '28px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '800', flexShrink: 0,
          }}>
            {cartCount}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
              {cartCount} item{cartCount > 1 ? 's' : ''} in cart
            </p>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
              Table {tableNo || '?'}
            </p>
          </div>
          <button onClick={() => navigate('/cart')} style={{
            padding: '10px 22px', background: '#D2C1B6', color: '#1B3C53',
            border: 'none', borderRadius: '10px', fontWeight: '700',
            fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            View Cart →
          </button>
        </div>
      )}

      {/* ── Table occupied modal ── */}
      {showTableModal && tableStatus && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(27,60,83,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px',
            padding: '32px', width: '460px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            {!queueJoined ? (
              <>
                {/* Warning */}
                <div style={{
                  background: '#fff8f0', border: '1.5px solid #fcd34d',
                  borderRadius: '12px', padding: '16px 18px', marginBottom: '24px',
                }}>
                  <p style={{ color: '#92400e', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>
                    Table {tableStatus.number} is {tableStatus.status}
                  </p>
                  <p style={{ color: '#b45309', fontSize: '13px', margin: 0 }}>
                    {tableStatus.waitingQueue?.length > 0
                      ? `${tableStatus.waitingQueue.length} group(s) already waiting`
                      : 'No one waiting yet'}
                  </p>
                </div>

                <h3 style={{ color: '#1B3C53', fontSize: '17px', fontWeight: '700', margin: '0 0 20px' }}>
                  What would you like to do?
                </h3>

                {/* Option 1 — Wait */}
                <div style={{
                  border: '1.5px solid #e8e4df', borderRadius: '14px',
                  padding: '20px', marginBottom: '16px',
                }}>
                  <p style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700', margin: '0 0 14px' }}>
                    Wait for Table {tableStatus.number}
                  </p>
                  <input
                    placeholder="Your name"
                    value={queueName}
                    onChange={e => setQueueName(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', marginBottom: '10px',
                      border: '1.5px solid #e8e4df', borderRadius: '9px',
                      fontSize: '14px', color: '#1B3C53', background: '#f8f7f5',
                      fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <input
                    type="number" placeholder="Number of guests"
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', marginBottom: '12px',
                      border: '1.5px solid #e8e4df', borderRadius: '9px',
                      fontSize: '14px', color: '#1B3C53', background: '#f8f7f5',
                      fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <button onClick={joinQueue} style={{
                    width: '100%', padding: '12px',
                    background: '#f59e0b', color: '#fff',
                    border: 'none', borderRadius: '10px',
                    fontWeight: '700', fontSize: '14px',
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}>
                    Join Waiting Queue
                  </button>
                </div>

                {/* Option 2 — Choose another table */}
                <div style={{
                  border: '1.5px solid #e8e4df', borderRadius: '14px', padding: '20px',
                }}>
                  <p style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700', margin: '0 0 12px' }}>
                    Choose an available table
                  </p>
                  {availableTables.length === 0 ? (
                    <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>
                      No tables available right now — please wait or come back later
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {availableTables.map(t => (
                        <button key={t._id} onClick={() => selectAvailableTable(t.number)} style={{
                          padding: '10px 16px',
                          background: '#f0fff4', color: '#166534',
                          border: '1.5px solid #86efac', borderRadius: '10px',
                          fontWeight: '700', fontSize: '14px',
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}>
                          T{t.number} · {t.capacity} seats
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => { setShowTableModal(false); setQueueJoined(false); setQueueName(''); setGuestCount(''); }} style={{
                  width: '100%', padding: '11px', marginTop: '14px',
                  background: 'transparent', color: '#456882',
                  border: '1.5px solid #e8e4df', borderRadius: '10px',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Cancel
                </button>
              </>
            ) : (
              /* Queue confirmed screen */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#f0fff4', border: '2px solid #86efac',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ color: '#1B3C53', fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>
                  You're in the queue!
                </h3>
                <p style={{ color: '#456882', fontSize: '14px', margin: '0 0 8px' }}>
                  Name: <strong>{queueName}</strong>
                </p>
                <p style={{ color: '#456882', fontSize: '14px', margin: '0 0 24px' }}>
                  Waiting for Table {tableStatus.number} · {guestCount} guest{Number(guestCount) > 1 ? 's' : ''}
                </p>
                <p style={{ color: '#456882', fontSize: '13px', margin: '0 0 24px', lineHeight: 1.6 }}>
                  Please wait near the reception. Our staff will seat you shortly.
                </p>
                <button onClick={() => { setShowTableModal(false); setQueueJoined(false); }} style={{
                  padding: '12px 32px', background: '#1B3C53', color: '#D2C1B6',
                  border: 'none', borderRadius: '12px', fontWeight: '700',
                  fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}>
                  Browse Menu while waiting
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}