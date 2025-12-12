const mongoose = require('mongoose');

const SupplementSchema = new mongoose.Schema({
  name: String,
  brand: String,
  image: String,
  usage: String,
  benefits: String,
  affiliateLink: String,
  discountForElite: { type: String, default: '10%' }
});

module.exports = mongoose.model('Supplement', SupplementSchema);
