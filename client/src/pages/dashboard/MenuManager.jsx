import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api/axios';

const CATEGORIES = ['Breakfast','Lunch','Dinner','Starters','Fastfood','Desserts','Drinks'];
const EMPTY_FORM  = { name: '', description: '', price: '', category: 'Starters', isVeg: true, available: true, image: '' };

export default function MenuManager() {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(null);
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try { const { data } = await api.get('/menu'); setItems(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = item => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || '', price: item.price, category: item.category, isVeg: item.isVeg, available: item.available, image: item.image || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return toast.error('Name, price and category required');
    setSaving(true);
    try {
      if (editing) {
        const { data } = await api.patch(`/menu/${editing._id}`, { ...form, price: Number(form.price) });
        setItems(items.map(i => i._id === editing._id ? data : i));
        toast.success('Item updated!', { style: { background: '#1B3C53', color: '#D2C1B6' } });
      } else {
        const { data } = await api.post('/menu', { ...form, price: Number(form.price) });
        setItems([...items, data]);
        toast.success('Item added!', { style: { background: '#1B3C53', color: '#D2C1B6' } });
      }
      setShowForm(false);
    } catch (e) { toast.error(e.response?.data?.msg || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return;
    setDeleting(id);
    try { await api.delete(`/menu/${id}`); setItems(items.filter(i => i._id !== id)); toast.success('Deleted', { style: { background: '#1B3C53', color: '#D2C1B6' } }); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const toggleAvailable = async item => {
    try {
      const { data } = await api.patch(`/menu/${item._id}`, { available: !item.available });
      setItems(items.map(i => i._id === item._id ? data : i));
    } catch { toast.error('Failed'); }
  };

  const cats     = ['All', ...CATEGORIES];
  const filtered = filterCat === 'All' ? items : items.filter(i => i.category === filterCat);

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e8e4df', borderRadius: '9px', fontSize: '14px', color: '#1B3C53', background: '#f8f7f5', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5' }}>
      <Toaster position="top-right" />
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ color: '#1B3C53', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Menu Manager</h1>
            <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>{items.length} items · Add, edit or remove dishes</p>
          </div>
          <button onClick={openAdd} style={{ padding: '11px 22px', background: '#1B3C53', color: '#D2C1B6', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            + Add Dish
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total',       value: items.length,                           accent: '#1B3C53' },
            { label: 'Veg',         value: items.filter(i => i.isVeg).length,      accent: '#2d6a4f' },
            { label: 'Non-Veg',     value: items.filter(i => !i.isVeg).length,     accent: '#c0392b' },
            { label: 'Unavailable', value: items.filter(i => !i.available).length, accent: '#f59e0b' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1.5px solid #e8e4df' }}>
              <p style={{ color: '#456882', fontSize: '11px', fontWeight: '700', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</p>
              <p style={{ color: c.accent, fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>{c.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{
              padding: '7px 16px', background: filterCat === cat ? '#1B3C53' : '#fff',
              color: filterCat === cat ? '#D2C1B6' : '#456882',
              border: filterCat === cat ? 'none' : '1.5px solid #e8e4df',
              borderRadius: '20px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>{cat}</button>
          ))}
        </div>

        {loading ? <p style={{ color: '#456882' }}>Loading...</p> : (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e8e4df', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '13px 20px', background: '#f8f7f5', borderBottom: '1.5px solid #e8e4df' }}>
              {['Dish', 'Category', 'Price', 'Type', 'Actions'].map(h => (
                <span key={h} style={{ color: '#456882', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' }}><p style={{ color: '#456882', fontSize: '15px', margin: 0 }}>No items</p></div>
            ) : filtered.map((item, i) => (
              <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '14px 20px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid #f0ede6' : 'none', opacity: item.available ? 1 : 0.5 }}>
                <div>
                  <p style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '600', margin: '0 0 2px' }}>{item.name}</p>
                  {item.description && <p style={{ color: '#bbb', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{item.description}</p>}
                </div>
                <span style={{ display: 'inline-block', background: '#f8f7f5', color: '#456882', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px' }}>{item.category}</span>
                <span style={{ color: '#1B3C53', fontSize: '15px', fontWeight: '700' }}>₹{item.price}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.isVeg ? '#22c55e' : '#ef4444' }} />
                  </div>
                  <button onClick={() => toggleAvailable(item)} style={{ padding: '3px 8px', fontSize: '11px', fontWeight: '600', background: item.available ? '#f0fff4' : '#fff0f0', color: item.available ? '#166534' : '#991b1b', border: `1px solid ${item.available ? '#86efac' : '#fca5a5'}`, borderRadius: '6px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    {item.available ? 'Available' : 'Hidden'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEdit(item)} style={{ padding: '6px 12px', background: '#f8f7f5', color: '#1B3C53', border: '1.5px solid #e8e4df', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                  <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} style={{ padding: '6px 12px', background: '#fff0f0', color: '#c0392b', border: '1.5px solid #fca5a5', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    {deleting === item._id ? '...' : 'Del'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,60,83,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#1B3C53', fontSize: '20px', fontWeight: '700', margin: '0 0 24px' }}>{editing ? 'Edit Dish' : 'Add New Dish'}</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>Dish Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Paneer Butter Masala" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 280" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#1B3C53', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>Image URL (optional)</label>
              <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <button onClick={() => setForm(f => ({ ...f, isVeg: !f.isVeg }))} style={{ flex: 1, padding: '10px', background: form.isVeg ? '#f0fff4' : '#fff0f0', color: form.isVeg ? '#166534' : '#991b1b', border: `1.5px solid ${form.isVeg ? '#86efac' : '#fca5a5'}`, borderRadius: '9px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {form.isVeg ? 'Veg' : 'Non-Veg'}
              </button>
              <button onClick={() => setForm(f => ({ ...f, available: !f.available }))} style={{ flex: 1, padding: '10px', background: form.available ? '#f0fff4' : '#fff0f0', color: form.available ? '#166534' : '#991b1b', border: `1.5px solid ${form.available ? '#86efac' : '#fca5a5'}`, borderRadius: '9px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {form.available ? 'Available' : 'Hidden'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#f8f7f5', color: '#456882', border: '1.5px solid #e8e4df', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: saving ? '#456882' : '#1B3C53', color: '#D2C1B6', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Dish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}