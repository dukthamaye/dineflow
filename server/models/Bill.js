const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  order:         { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  tableNumber:   Number,
  subtotal:      Number,
  gst:           Number,
  totalAmount:   Number,
  paymentMethod: { type: String, enum: ['cash','upi','card'], default: 'cash' },
  isPaid:        { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);