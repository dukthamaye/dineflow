const router = require('express').Router();
const Bill = require('../models/Bill');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const bills = await Bill.find().populate('order').sort('-createdAt');
    res.json(bills);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findById(orderId).populate('items.menuItem');
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const gst = parseFloat((subtotal * 0.05).toFixed(2));
    const totalAmount = parseFloat((subtotal + gst).toFixed(2));

    const bill = await Bill.create({
      order: orderId,
      tableNumber: order.tableNumber,
      subtotal,
      gst,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      isPaid: true,           // ← THIS was the only missing line
    });

    await Order.findByIdAndUpdate(orderId, { status: 'billed' });
    res.status(201).json(bill);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.patch('/:id/pay', auth, async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { isPaid: true, paymentMethod: req.body.paymentMethod },
      { new: true }
    );
    if (!bill) return res.status(404).json({ msg: 'Bill not found' });
    res.json(bill);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

module.exports = router;