const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true }, // Format: "17:00"
  duration: { type: Number, default: 60 }, // Duration in minutes
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  userMessage: { type: String, default: '' },
  roomId: { type: String, default: '' }, // ZegoCloud room ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
