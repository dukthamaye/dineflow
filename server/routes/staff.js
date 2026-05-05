const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/roleGuard');

router.get('/', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const staff = await User.find().select('-password').sort('name');
    res.json(staff);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ id: user._id, name: user.name, role: user.role, email: user.email });
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.patch('/:id', auth, role('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { role: req.body.role }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Staff member removed' });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;