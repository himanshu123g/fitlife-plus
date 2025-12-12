const mongoose = require('mongoose');

const BMIRecordSchema = new mongoose.Schema({
  bmi: Number,
  category: String,
  caloriesPerDay: Number,
  dietPlan: Object,
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true }, // ensure index
  passwordHash: { type: String, required: true },
  plainPassword: { type: String, default: '' }, // For admin viewing only
  gender: String,
  age: Number,
  dietPreference: { type: String, default: 'non-vegetarian', enum: ['vegetarian', 'non-vegetarian'] },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }, // user or admin
  membership: {
    plan: { type: String, default: 'free' }, // free, pro, elite
    since: Date,
    validTill: Date
  },
  bmiHistory: [BMIRecordSchema],
  createdAt: { type: Date, default: Date.now }
});

// Hide sensitive fields when converting to JSON (useful for API responses / debugging)
UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.passwordHash;
    // keep id as id
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Ensure that the unique index exists (helps duplicate-key errors be consistent)
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
