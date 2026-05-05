import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import heroBg     from '../assets/picture 6.jpg';
import featureBg  from '../assets/picture 5.jpg';
import kitchenImg from '../assets/picture 1.jpg';
import menuImg    from '../assets/picture 2.jpg';
import dishImg    from '../assets/picture 3.jpg';
import drinksImg  from '../assets/picture 4.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const dashRoute = user ? (
    user.role === 'kitchen' ? '/kitchen' :
    user.role === 'waiter'  ? '/tables'  :
    user.role === 'cashier' ? '/billing' : '/dashboard'
  ) : null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5', minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '68px',
        background: '#fff', borderBottom: '1.5px solid #e8e4df',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#1B3C53', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h8v2H8V6z" fill="#D2C1B6" opacity="0.7"/>
              <path d="M9 8h2v10H9V8zm4 0h2v10h-2V8z" fill="#D2C1B6"/>
            </svg>
          </div>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#1B3C53', letterSpacing: '-0.5px' }}>
            Dineflow
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <span style={{ color: '#456882', fontSize: '14px' }}>Hi, {user.name}</span>
              <button onClick={() => navigate(dashRoute)} style={navBtnDark}>Go to Dashboard</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/menu')}  style={navBtnLight}>View Menu</button>
              <button onClick={() => navigate('/login')} style={navBtnDark}>Staff Login</button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '92vh', overflow: 'hidden' }}>

        {/* Background image */}
        <img
          src={heroBg}
          alt="Restaurant interior"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,60,83,0.92) 45%, rgba(27,60,83,0.5) 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center',
          height: '100%',
          maxWidth: '1200px', margin: '0 auto', padding: '0 48px',
          gap: '60px',
        }}>

          {/* Left text */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(210,193,182,0.15)',
              border: '1px solid rgba(210,193,182,0.3)',
              color: '#D2C1B6', fontSize: '12px', fontWeight: '700',
              letterSpacing: '0.1em', padding: '6px 14px',
              borderRadius: '20px', marginBottom: '28px',
              textTransform: 'uppercase',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#4ade80', display: 'inline-block',
              }}/>
              Live restaurant system
            </div>

            <h1 style={{
              fontSize: '64px', fontWeight: '800', color: '#ffffff',
              lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 24px',
            }}>
              Order in.<br />
              <span style={{ color: '#D2C1B6' }}>Chaos</span> out.
            </h1>

            <p style={{
              fontSize: '18px', color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7, margin: '0 0 44px', maxWidth: '460px',
            }}>
              The complete restaurant management system — real-time kitchen orders,
              smart table management, billing, and analytics. All in one place.
            </p>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => navigate('/menu')} style={{
                padding: '15px 32px', background: '#D2C1B6', color: '#1B3C53',
                border: 'none', borderRadius: '12px', fontWeight: '700',
                fontSize: '16px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => e.target.style.background = '#c4b0a4'}
                onMouseLeave={e => e.target.style.background = '#D2C1B6'}
              >
                Browse Menu
              </button>
              <button onClick={() => navigate('/login')} style={{
                padding: '15px 32px',
                background: 'transparent',
                color: '#D2C1B6',
                border: '1.5px solid rgba(210,193,182,0.5)',
                borderRadius: '12px', fontWeight: '700',
                fontSize: '16px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                Staff Login
              </button>
            </div>
          </div>

          {/* Right — stats card */}
          <div style={{ flex: '0 0 300px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(210,193,182,0.2)',
              borderRadius: '24px', padding: '28px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '24px',
              }}>
                <span style={{ color: '#D2C1B6', fontWeight: '700', fontSize: '15px' }}>
                  Today's snapshot
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(74,222,128,0.15)', color: '#4ade80',
                  fontSize: '11px', fontWeight: '700',
                  padding: '4px 10px', borderRadius: '20px',
                }}>
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: '#4ade80', display: 'inline-block',
                  }}/>
                  Live
                </span>
              </div>

              {[
                { label: 'Active orders',   value: '12',     unit: 'orders' },
                { label: 'Tables occupied', value: '8/14',   unit: 'tables' },
                { label: "Today's revenue", value: '₹4,280', unit: ''       },
                { label: 'Items served',    value: '94',     unit: 'dishes' },
              ].map(s => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 0',
                  borderBottom: '1px solid rgba(210,193,182,0.1)',
                }}>
                  <span style={{ fontSize: '13px', color: 'rgba(210,193,182,0.6)' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                    {s.value}
                    {s.unit && (
                      <span style={{ fontSize: '11px', fontWeight: '400', marginLeft: '4px', opacity: 0.5 }}>
                        {s.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Photo strip ── */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        height: '220px', overflow: 'hidden',
      }}>
        {[kitchenImg, menuImg, dishImg, drinksImg].map((img, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={img} alt="" style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s',
            }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(27,60,83,0.3)',
            }} />
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section style={{
        background: '#fff', padding: '80px 48px',
        borderTop: '1.5px solid #e8e4df',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center', fontSize: '36px', fontWeight: '800',
            color: '#1B3C53', margin: '0 0 12px', letterSpacing: '-1px',
          }}>
            Everything your restaurant needs
          </h2>
          <p style={{
            textAlign: 'center', color: '#456882',
            fontSize: '16px', margin: '0 0 56px',
          }}>
            From the kitchen screen to the billing counter — all connected in real time
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { title: 'Live kitchen display',  desc: 'Orders appear on the kitchen screen the moment a waiter places them. No paper, no delays.',     color: '#fff8f0', border: '#ffe4b5', img: kitchenImg },
              { title: 'Table management',      desc: 'See every table status at a glance. Seat guests, manage reservations, track occupancy live.',    color: '#f0f7ff', border: '#bfdbfe', img: null       },
              { title: 'Smart order tracking',  desc: 'Customers track their order live — from placed to preparing to ready to served.',                color: '#f0fff4', border: '#bbf7d0', img: dishImg   },
              { title: 'Instant billing',       desc: 'Auto-generate bills with GST, split payments, cash/UPI/card modes. One click.',                  color: '#fdf0ff', border: '#e9d5ff', img: null       },
              { title: 'Revenue analytics',     desc: 'Daily revenue charts, top dishes, table occupancy rates — all updated in real time.',            color: '#fff0f5', border: '#fecdd3', img: null       },
              { title: 'Staff and roles',       desc: 'Role-based access for admin, manager, waiter, kitchen and cashier. Secure by default.',          color: '#f5f0ff', border: '#ddd6fe', img: featureBg  },
            ].map(f => (
              <div key={f.title} style={{
                background: f.img ? 'transparent' : f.color,
                border: `1.5px solid ${f.border}`,
                borderRadius: '16px', padding: '0',
                overflow: 'hidden', position: 'relative',
                minHeight: '180px',
              }}>
                {f.img && (
                  <>
                    <img src={f.img} alt="" style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%', objectFit: 'cover',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(27,60,83,0.75)',
                    }} />
                  </>
                )}
                <div style={{
                  position: 'relative', zIndex: 1,
                  padding: '28px 24px',
                }}>
                  <h3 style={{
                    color: f.img ? '#ffffff' : '#1B3C53',
                    fontSize: '17px', fontWeight: '700', margin: '0 0 10px',
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    color: f.img ? 'rgba(255,255,255,0.75)' : '#456882',
                    fontSize: '14px', lineHeight: 1.65, margin: 0,
                  }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full width dining image ── */}
      <section style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        <img src={featureBg} alt="Fine dining" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(27,60,83,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '16px',
        }}>
          <h2 style={{
            color: '#ffffff', fontSize: '40px', fontWeight: '800',
            letterSpacing: '-1px', margin: 0, textAlign: 'center',
          }}>
            Built for the finest dining experiences
          </h2>
          <p style={{
            color: 'rgba(210,193,182,0.85)', fontSize: '16px',
            margin: 0, textAlign: 'center',
          }}>
            Trusted by restaurant teams to run their floor, kitchen and billing seamlessly
          </p>
          <button onClick={() => navigate('/login')} style={{
            marginTop: '8px', padding: '14px 32px',
            background: '#D2C1B6', color: '#1B3C53',
            border: 'none', borderRadius: '12px',
            fontWeight: '700', fontSize: '15px',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            Get Started
          </button>
        </div>
      </section>

      {/* ── Roles ── */}
      <section style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontSize: '32px', fontWeight: '800',
          color: '#1B3C53', margin: '0 0 48px', letterSpacing: '-0.8px',
        }}>
          Built for every role
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
          {[
            { role: 'Admin',   desc: 'Full system access + analytics', bg: '#1B3C53', text: '#D2C1B6' },
            { role: 'Manager', desc: 'Menu, staff and reports',         bg: '#234C6A', text: '#D2C1B6' },
            { role: 'Waiter',  desc: 'Orders and table management',     bg: '#456882', text: '#f8f7f5' },
            { role: 'Kitchen', desc: 'Live KOT display screen',         bg: '#5a7a6e', text: '#f8f7f5' },
            { role: 'Cashier', desc: 'Billing and payment processing',  bg: '#7a6a5a', text: '#f8f7f5' },
          ].map(r => (
            <div key={r.role} style={{
              background: r.bg, borderRadius: '16px',
              padding: '28px 20px', textAlign: 'center',
            }}>
              <p style={{ color: r.text, fontWeight: '700', fontSize: '16px', margin: '0 0 8px' }}>
                {r.role}
              </p>
              <p style={{ color: r.text, fontSize: '12px', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#1B3C53', padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: '800', fontSize: '18px', color: '#D2C1B6' }}>Dineflow</span>
        <span style={{ color: '#456882', fontSize: '13px' }}>
          Built with MERN Stack · {new Date().getFullYear()}
        </span>
      </footer>

    </div>
  );
}

const navBtnDark = {
  padding: '9px 20px', background: '#1B3C53', color: '#D2C1B6',
  border: 'none', borderRadius: '8px', fontWeight: '600',
  fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
};
const navBtnLight = {
  padding: '9px 20px', background: 'transparent', color: '#1B3C53',
  border: '1.5px solid #e8e4df', borderRadius: '8px', fontWeight: '600',
  fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
};