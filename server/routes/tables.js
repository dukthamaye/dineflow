const router = require('express').Router();
const Table  = require('../models/Table');
const auth   = require('../middleware/auth');
const role   = require('../middleware/roleGuard');

// Public — get all tables (customers need this)
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort('number');
    res.json(tables);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Get single table
router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ msg: 'Table not found' });
    res.json(table);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Get table by number (for customer check)
router.get('/number/:number', async (req, res) => {
  try {
    const table = await Table.findOne({ number: req.params.number });
    if (!table) return res.status(404).json({ msg: 'Table not found' });
    res.json(table);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

// Add table — admin/manager only
router.post('/', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

// Update table status
router.patch('/:id', auth, role('admin', 'manager', 'waiter'), async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(table);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

// Join waiting queue — public (customer action)
router.post('/number/:number/queue', async (req, res) => {
  try {
    const { name, guestCount } = req.body;
    const table = await Table.findOne({ number: req.params.number });
    if (!table) return res.status(404).json({ msg: 'Table not found' });
    table.waitingQueue.push({ name: name || 'Guest', guestCount: guestCount || 1 });
    await table.save();
    req.io?.emit('queue_updated', table);
    res.json({ msg: 'Added to queue', position: table.waitingQueue.length, table });
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

// Remove from queue — waiter/admin
router.delete('/:id/queue/:queueId', auth, role('admin', 'manager', 'waiter'), async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    table.waitingQueue = table.waitingQueue.filter(q => q._id.toString() !== req.params.queueId);
    await table.save();
    req.io?.emit('queue_updated', table);
    res.json(table);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

// Delete table
router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;