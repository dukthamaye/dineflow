import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import api from '../../api/axios';

export default function Billing() {
  const [orders,     setOrders]     = useState([]);
  const [bills,      setBills]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('unbilled');
  const [generating, setGenerating] = useState(null);
  const [printing,   setPrinting]   = useState(null);
  const [payMethod,  setPayMethod]  = useState({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [oRes, bRes] = await Promise.all([api.get('/orders'), api.get('/bills')]);
      setOrders(oRes.data.filter(o => o.status !== 'billed'));
      setBills(bRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const generateBill = async orderId => {
    setGenerating(orderId);
    try {
      await api.post('/bills', { orderId, paymentMethod: payMethod[orderId] || 'cash' });
      await fetchAll();
    } catch (e) { alert(e.response?.data?.msg || 'Failed'); }
    finally { setGenerating(null); }
  };

  const printBill = bill => {
    setPrinting(bill._id);
    try {
      const doc = new jsPDF({ unit: 'mm', format: [80, 200] });
      const W = 80; let y = 8;

      doc.setFontSize(16); doc.setFont('helvetica', 'bold');
      doc.text('DINEFLOW', W / 2, y, { align: 'center' }); y += 6;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.text('Order in. Chaos out.', W / 2, y, { align: 'center' }); y += 5;
      doc.line(5, y, W - 5, y); y += 5;

      doc.setFontSize(9); doc.setFont('helvetica', 'bold');
      doc.text(`Table: ${bill.tableNumber}`, 5, y);
      doc.text(`Bill #${bill._id.slice(-6).toUpperCase()}`, W - 5, y, { align: 'right' }); y += 5;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.text(new Date(bill.createdAt).toLocaleString('en-IN'), 5, y); y += 5;
      doc.text(`Payment: ${bill.paymentMethod?.toUpperCase()}`, 5, y); y += 5;
      doc.line(5, y, W - 5, y); y += 5;

      doc.setFont('helvetica', 'bold');
      doc.text('Item', 5, y); doc.text('Qty', 42, y); doc.text('Rate', 54, y); doc.text('Amt', W - 5, y, { align: 'right' }); y += 4;
      doc.line(5, y, W - 5, y); y += 4;

      doc.setFont('helvetica', 'normal');
      const orderItems = bill.order?.items || [];
      orderItems.forEach(item => {
        const name = item.name?.length > 18 ? item.name.slice(0, 18) + '..' : item.name;
        doc.text(name || '-', 5, y);
        doc.text(String(item.quantity), 42, y);
        doc.text(`${item.price}`, 54, y);
        doc.text(`${(item.price * item.quantity).toFixed(0)}`, W - 5, y, { align: 'right' }); y += 5;
      });

      y += 1; doc.line(5, y, W - 5, y); y += 5;
      doc.text('Subtotal', 5, y); doc.text(`Rs.${bill.subtotal?.toFixed(2)}`, W - 5, y, { align: 'right' }); y += 5;
      doc.text('GST (5%)', 5, y); doc.text(`Rs.${bill.gst?.toFixed(2)}`, W - 5, y, { align: 'right' }); y += 5;
      doc.line(5, y, W - 5, y); y += 5;
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text('TOTAL', 5, y); doc.text(`Rs.${bill.totalAmount?.toFixed(2)}`, W - 5, y, { align: 'right' }); y += 8;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.line(5, y, W - 5, y); y += 5;
      doc.text('Thank you for dining with us!', W / 2, y, { align: 'center' });

      doc.save(`bill-table${bill.tableNumber}-${bill._id.slice(-6)}.pdf`);
    } catch (e) { console.error(e); alert('Failed to generate PDF'); }
    finally { setPrinting(null); }
  };

  const totalRevenue = bills.filter(b => b.isPaid).reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '36px 40px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ color: '#1B3C53', fontSize: '26px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Billing</h1>
            <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>Generate bills, print PDF invoices and track payments</p>
          </div>
          <button onClick={fetchAll} style={{ padding: '10px 20px', background: '#1B3C53', color: '#D2C1B6', border: 'none', borderRadius: '9px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Refresh</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Unbilled Orders', value: orders.length,  sub: 'pending bills',  accent: '#c0392b' },
            { label: 'Bills Generated', value: bills.length,   sub: 'total invoices', accent: '#1B3C53' },
            { label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'paid bills', accent: '#2d6a4f' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: '14px', padding: '22px 20px', border: '1.5px solid #e8e4df' }}>
              <p style={{ color: '#456882', fontSize: '12px', fontWeight: '600', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</p>
              <p style={{ color: c.accent, fontSize: '30px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-1px' }}>{c.value}</p>
              <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>{c.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { key: 'unbilled', label: `Unbilled Orders (${orders.length})` },
            { key: 'bills',    label: `Bills History (${bills.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '9px 20px',
              background: tab === t.key ? '#1B3C53' : '#fff',
              color: tab === t.key ? '#D2C1B6' : '#456882',
              border: tab === t.key ? 'none' : '1.5px solid #e8e4df',
              borderRadius: '9px', fontWeight: '600', fontSize: '14px',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? <p style={{ color: '#456882' }}>Loading...</p> : tab === 'unbilled' ? (
          orders.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '14px', padding: '60px', textAlign: 'center', border: '1.5px solid #e8e4df' }}>
              <p style={{ color: '#1B3C53', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>No unbilled orders</p>
              <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>All orders have been billed</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.map(order => {
                const subtotal = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
                const gst = subtotal * 0.05;
                const total = subtotal + gst;
                return (
                  <div key={order._id} style={{ background: '#fff', borderRadius: '14px', padding: '22px 24px', border: '1.5px solid #e8e4df' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ background: '#1B3C53', color: '#D2C1B6', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' }}>Table {order.tableNumber}</span>
                          <span style={{ background: '#f0f7f0', color: '#2d6a4f', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px', textTransform: 'capitalize' }}>{order.status}</span>
                          <span style={{ color: '#bbb', fontSize: '12px' }}>{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f8f7f5' : 'none' }}>
                            <span style={{ color: '#1B3C53', fontSize: '14px' }}>{item.name} × {item.quantity}</span>
                            <span style={{ color: '#456882', fontSize: '14px' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div style={{ background: '#f8f7f5', borderRadius: '8px', padding: '10px 14px', display: 'flex', gap: '24px', marginTop: '10px' }}>
                          <span style={{ color: '#456882', fontSize: '13px' }}>Subtotal: <strong style={{ color: '#1B3C53' }}>₹{subtotal.toFixed(2)}</strong></span>
                          <span style={{ color: '#456882', fontSize: '13px' }}>GST 5%: <strong style={{ color: '#1B3C53' }}>₹{gst.toFixed(2)}</strong></span>
                          <span style={{ color: '#456882', fontSize: '13px' }}>Total: <strong style={{ color: '#2d6a4f', fontSize: '15px' }}>₹{total.toFixed(2)}</strong></span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                        <label style={{ color: '#456882', fontSize: '12px', fontWeight: '600' }}>Payment method</label>
                        <select value={payMethod[order._id] || 'cash'} onChange={e => setPayMethod(p => ({ ...p, [order._id]: e.target.value }))} style={{ padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4df', background: '#f8f7f5', color: '#1B3C53', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                          <option value="cash">Cash</option>
                          <option value="upi">UPI</option>
                          <option value="card">Card</option>
                        </select>
                        <button onClick={() => generateBill(order._id)} disabled={generating === order._id} style={{ padding: '11px 16px', background: generating === order._id ? '#456882' : '#2d6a4f', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '14px', cursor: generating === order._id ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          {generating === order._id ? 'Generating...' : 'Generate Bill'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          bills.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '14px', padding: '60px', textAlign: 'center', border: '1.5px solid #e8e4df' }}>
              <p style={{ color: '#1B3C53', fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>No bills yet</p>
              <p style={{ color: '#456882', fontSize: '14px', margin: 0 }}>Generated bills will appear here</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #e8e4df', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 120px', padding: '14px 24px', background: '#f8f7f5', borderBottom: '1.5px solid #e8e4df' }}>
                {['Table','Subtotal','GST','Total','Payment','Invoice'].map(h => (
                  <span key={h} style={{ color: '#456882', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>
              {bills.map((bill, i) => (
                <div key={bill._id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 120px', padding: '16px 24px', borderBottom: i < bills.length - 1 ? '1px solid #f0ede6' : 'none', alignItems: 'center' }}>
                  <span style={{ color: '#1B3C53', fontSize: '14px', fontWeight: '600' }}>Table {bill.tableNumber}</span>
                  <span style={{ color: '#456882', fontSize: '14px' }}>₹{bill.subtotal?.toFixed(2)}</span>
                  <span style={{ color: '#456882', fontSize: '14px' }}>₹{bill.gst?.toFixed(2)}</span>
                  <span style={{ color: '#2d6a4f', fontSize: '15px', fontWeight: '700' }}>₹{bill.totalAmount?.toFixed(2)}</span>
                  <span style={{ display: 'inline-block', background: bill.paymentMethod === 'cash' ? '#f0f7f0' : bill.paymentMethod === 'upi' ? '#f0f0ff' : '#fff0f5', color: bill.paymentMethod === 'cash' ? '#2d6a4f' : bill.paymentMethod === 'upi' ? '#3730a3' : '#be185d', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>{bill.paymentMethod}</span>
                  <button onClick={() => printBill(bill)} disabled={printing === bill._id} style={{ padding: '7px 14px', background: printing === bill._id ? '#f8f7f5' : '#1B3C53', color: printing === bill._id ? '#456882' : '#D2C1B6', border: printing === bill._id ? '1.5px solid #e8e4df' : 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: printing === bill._id ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    {printing === bill._id ? 'Printing...' : 'Print PDF'}
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}