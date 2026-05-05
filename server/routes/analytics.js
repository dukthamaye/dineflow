const router = require('express').Router();
const Order = require('../models/Order');
const Bill = require('../models/Bill');
const MenuItem = require('../models/Menu');
const auth = require('../middleware/auth');
const role = require('../middleware/roleGuard');

router.get('/summary', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, revenueData, topItems, totalTables] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Bill.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.name', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      require('../models/Table').countDocuments()
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: revenueData[0]?.total || 0,
      totalBills: revenueData[0]?.count || 0,
      topItems,
      totalTables
    });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

router.get('/revenue', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenue = await Bill.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(revenue.length ? revenue : []);
  } catch (e) { res.status(500).json({ msg: e.message }); }
});

module.exports = router;