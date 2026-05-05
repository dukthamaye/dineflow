const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const role = require('../middleware/roleGuard');

router.post('/', auth, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, takenBy: req.user._id });
    req.io.emit('new_order', order);
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem').sort('-createdAt');
    res.json(orders);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.patch('/:id/status', auth, role('admin','manager','kitchen','waiter'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    req.io.emit('order_updated', order);
    res.json(order);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

module.exports = router;