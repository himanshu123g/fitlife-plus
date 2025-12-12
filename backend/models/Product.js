const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true }, // protein, vitamins, pre-workout, etc.
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // for showing discounts
  imageUrl: { type: String },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  features: [String],
  isActive: { type: Boolean, default: true },
  approved: { type: Boolean, default: true }, // Admin approval status
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
