const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name:     String,
    price:    Number,
    quantity: Number
  }],
  status:      { type: String, enum: ['pending','preparing','ready','served','billed'], default: 'pending' },
  totalAmount: Number,
  takenBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note:        String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);