const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productId: String,
  productName: { type: String, required: true },
  productImage: String,
  brand: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  membershipPlan: { type: String, enum: ['free', 'pro', 'elite'], default: 'free' },
  finalPayableAmount: { type: Number, required: true },
  deliveryStatus: { 
    type: String, 
    default: 'Order Placed',
    enum: ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Paid', 'Failed', 'Refunded']
  },
  paymentMethod: { type: String, default: 'Razorpay Test Payment' },
  paymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  estimatedDeliveryDate: { type: Date },
  orderTimestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
