const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  customerName:  { type: String, required: true },
  phone:         String,
  tableNumber:   Number,
  guestCount:    Number,
  reservedFor:   Date,
  status:        { type: String, enum: ['confirmed','cancelled','completed'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);