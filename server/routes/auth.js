const router = require('express').Router();
const User   = require('../models/User');
const jwt    = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already exists' });
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) { res.status(400).json({ msg: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ msg: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;