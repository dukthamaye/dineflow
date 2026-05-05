const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  category:    { 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Starters', 'Fastfood', 'Desserts', 'Drinks', 'Main Course', 'Biryani', 'Breads'],
    required: true 
  },
  isVeg:     { type: Boolean, default: true },
  image:     { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuSchema);