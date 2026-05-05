const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  number:   { type: Number, required: true, unique: true },
  capacity: { type: Number, default: 4 },
  status:   { type: String, enum: ['available', 'occupied', 'reserved', 'cleaning'], default: 'available' },
  waitingQueue: [
    {
      name:       { type: String, default: 'Guest' },
      guestCount: { type: Number, default: 1 },
      joinedAt:   { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Table', TableSchema);