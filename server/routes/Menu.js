const router = require('express').Router();
const MenuItem = require('../models/Menu');
const auth = require('../middleware/auth');
const role = require('../middleware/roleGuard');

// Public - get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true }).sort('category');
    res.json(items);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Admin/Manager - add item
router.post('/', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

// Admin/Manager - update item
router.patch('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

// Admin/Manager - delete item
router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;