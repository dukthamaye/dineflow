import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';

const STATUS_COLORS = {
  available: { bg: '#f0fff4', border: '#86efac', text: '#166534', dot: '#22c55e' },
  occupied:  { bg: '#fff0f0', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
  reserved:  { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
  cleaning:  { bg: '#f0f7ff', border: '#93c5fd', text: '#1e40af', dot: '#3b82f6' },
};

export default function TableManager() {
  const { user } = useSelector(s => s.auth);
  const isAdmin  = ['admin', 'manager'].includes(user?.role);

  const [tables,        setTables]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selected,      setSelected]      = useState(null);
  const [updating,      setUpdating]      = useState(null);
  const [guestCount,    setGuestCount]    = useState('');
  const [filterApplied, setFilterApplied] = useState(false);
  const [showAdd,       setShowAdd]       = useState(false);
  const [newTable,      setNewTable]      = useState({ number: '', capacity: 4, status: 'available' });
  const [adding,        setAdding]        = useState(false);

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    setLoading(true);
    try { const { data } = await api.get('/tables'); setTables(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/tables/${id}`, { status });
      setTables(t => t.map(tb => tb._id === id ? { ...tb, status } : tb));
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
    } catch (e) { alert(e.response?.data?.msg || 'Failed'); }
    finally { setUpdating(null); }
  };

  const addTable = async () => {
    if (!newTable.number) return alert('Enter table number');
    setAdding(true);
    try {
      const { data } = await api.post('/tables', newTable);
      setTables(t => [...t, data]);
      setNewTable({ number: '', capacity: 4, status: 'available' });
      setShowAdd(false);
    } catch (e) { alert(e.response?.data?.msg || 'Failed'); }
    finally { setAdding(false); }
  };

  const displayedTables = filterApplied && guestCount
    ? tables.filter(t => t.capacity >= Number(guestCount) && t.status === 'available')
    : tables;

  const counts = {
    available: tables.filter(t => t.status === 'available').length,
    occupied:  tables.filter(t => t.status === 'occupied').length,
    reserved:  tables.filter(t => t.status === 'reserved').length,
    cleaning:  tables.filter(t => t.status === 'cleaning').length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ color: '#1B3C53', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Table Manager</h1>
            <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>{tables.length} tables · {counts.occupied} occupied · {counts.available} available</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchTables} style={{ padding: '10px 18px', background: '#fff', color: '#1B3C53', border: '1.5px solid #e8e4df', borderRadius: '9px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Refresh</button>
            {isAdmin && <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', background: '#1B3C53', color: '#D2C1B6', border: 'none', borderRadius: '9px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ Add Table</button>}
          </div>
        </div>

        {/* Guest filter */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e8e4df', padding: '20px 24px', marginBottom: '20px' }}>
          <p style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '700', margin: '0 0 14px' }}>Find table by guest count</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1,2,3,4,5,6,7,8,10,12].map(n => (
                <button key={n} onClick={() => setGuestCount(String(n))} style={{ width: '40px', height: '40px', background: guestCount === String(n) ? '#1B3C53' : '#f8f7f5', color: guestCount === String(n) ? '#D2C1B6' : '#456882', border: guestCount === String(n) ? 'none' : '1.5px solid #e8e4df', borderRadius: '9px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{n}</button>
              ))}
            </div>
            <button onClick={() => { setFilterApplied(true); setSelected(null); }} disabled={!guestCount} style={{ padding: '10px 20px', background: guestCount ? '#1B3C53' : '#f8f7f5', color: guestCount ? '#D2C1B6' : '#bbb', border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '14px', cursor: guestCount ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>Find Available Tables</button>
            {filterApplied && <button onClick={() => { setFilterApplied(false); setGuestCount(''); }} style={{ padding: '10px 16px', background: '#fff0f0', color: '#c0392b', border: '1.5px solid #fca5a5', borderRadius: '9px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Clear Filter</button>}
          </div>
          {filterApplied && guestCount && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f0f7f0', borderRadius: '9px', border: '1px solid #86efac' }}>
              <p style={{ color: '#166534', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                Showing {displayedTables.length} available table{displayedTables.length !== 1 ? 's' : ''} for {guestCount} guest{Number(guestCount) > 1 ? 's' : ''}
                {displayedTables.length === 0 && ' — no tables available right now'}
              </p>
            </div>
          )}
        </div>

        {/* Status summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {Object.entries(counts).map(([status, count]) => {
            const c = STATUS_COLORS[status];
            return (
              <div key={status} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                <div>
                  <p style={{ color: c.text, fontSize: '22px', fontWeight: '800', margin: '0 0 2px' }}>{count}</p>
                  <p style={{ color: c.text, fontSize: '12px', fontWeight: '500', margin: 0, textTransform: 'capitalize', opacity: 0.8 }}>{status}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table grid */}
        {loading ? <p style={{ color: '#456882' }}>Loading tables...</p>
        : tables.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '80px', textAlign: 'center', border: '1.5px solid #e8e4df' }}>
            <p style={{ color: '#1B3C53', fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>No tables yet</p>
            {isAdmin && <button onClick={() => setShowAdd(true)} style={{ padding: '12px 24px', background: '#1B3C53', color: '#D2C1B6', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>+ Add Table</button>}
          </div>
        ) : displayedTables.length === 0 && filterApplied ? (
          <div style={{ background: '#fff0f0', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1.5px solid #fca5a5' }}>
            <p style={{ color: '#991b1b', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>No available tables for {guestCount} guests</p>
            <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>All tables with enough seats are occupied or reserved</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {displayedTables.map(table => {
              const c = STATUS_COLORS[table.status] || STATUS_COLORS.available;
              const isSelected = selected?._id === table._id;
              return (
                <div key={table._id} onClick={() => setSelected(isSelected ? null : table)} style={{ background: isSelected ? '#1B3C53' : '#fff', border: isSelected ? '2px solid #1B3C53' : `1.5px solid ${c.border}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '14px', right: '14px', width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? '#D2C1B6' : c.dot }} />
                  <p style={{ fontSize: '28px', fontWeight: '800', color: isSelected ? '#D2C1B6' : '#1B3C53', margin: '0 0 4px', letterSpacing: '-1px' }}>T{table.number}</p>
                  <p style={{ fontSize: '12px', color: isSelected ? 'rgba(210,193,182,0.7)' : '#456882', margin: '0 0 8px' }}>{table.capacity} seats</p>
                  <span style={{ display: 'inline-block', background: isSelected ? 'rgba(210,193,182,0.15)' : c.bg, color: isSelected ? '#D2C1B6' : c.text, fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', textTransform: 'capitalize' }}>{table.status}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected table actions */}
        {selected && (
          <div style={{ marginTop: '24px', background: '#fff', borderRadius: '14px', padding: '24px', border: '1.5px solid #e8e4df' }}>
            <h3 style={{ color: '#1B3C53', fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>Table {selected.number} · {selected.capacity} seats</h3>
            <p style={{ color: '#456882', fontSize: '13px', margin: '0 0 16px' }}>Current status: <strong style={{ textTransform: 'capitalize' }}>{selected.status}</strong></p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_COLORS).map(([status, c]) => (
                <button key={status} onClick={() => updateStatus(selected._id, status)} disabled={updating === selected._id || selected.status === status} style={{ padding: '10px 20px', background: selected.status === status ? c.bg : '#f8f7f5', color: selected.status === status ? c.text : '#456882', border: selected.status === status ? `1.5px solid ${c.border}` : '1.5px solid #e8e4df', borderRadius: '9px', fontWeight: '600', fontSize: '14px', cursor: selected.status === status ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize', opacity: updating === selected._id ? 0.6 : 1 }}>{status}</button>
              ))}
            </div>
          </div>
        )}

        {/* Add table modal */}
        {showAdd && isAdmin && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,60,83,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '380px' }}>
              <h2 style={{ color: '#1B3C53', fontSize: '20px', fontWeight: '700', margin: '0 0 24px' }}>Add New Table</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Table Number</label>
                <input type="number" min="1" value={newTable.number} onChange={e => setNewTable(n => ({ ...n, number: e.target.value }))} placeholder="e.g. 1" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4df', borderRadius: '9px', fontSize: '15px', color: '#1B3C53', background: '#f8f7f5', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Capacity (seats)</label>
                <select value={newTable.capacity} onChange={e => setNewTable(n => ({ ...n, capacity: Number(e.target.value) }))} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e4df', borderRadius: '9px', fontSize: '15px', color: '#1B3C53', background: '#f8f7f5', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none' }}>
                  {[2,4,6,8,10,12].map(n => <option key={n} value={n}>{n} seats</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', background: '#f8f7f5', color: '#456882', border: '1.5px solid #e8e4df', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                <button onClick={addTable} disabled={adding} style={{ flex: 1, padding: '12px', background: '#1B3C53', color: '#D2C1B6', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: adding ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{adding ? 'Adding...' : 'Add Table'}</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}