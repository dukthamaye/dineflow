const router = require('express').Router();
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');
const role = require('../middleware/roleGuard');

router.get('/', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort('-reservedFor');
    res.json(reservations);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(reservation);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Reservation deleted' });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;