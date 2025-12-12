const mongoose = require('mongoose');

const PasswordResetRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  completedAt: { type: Date },
  adminNote: { type: String, default: '' }
});

module.exports = mongoose.model('PasswordResetRequest', PasswordResetRequestSchema);
