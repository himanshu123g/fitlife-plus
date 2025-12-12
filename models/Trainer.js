const mongoose = require('mongoose');

const AvailabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: { type: String, required: true }, // Format: "17:00"
  endTime: { type: String, required: true }     // Format: "20:00"
});

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  plainPassword: { type: String, default: '' }, // For admin viewing only
  specialization: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  availability: [AvailabilitySlotSchema],
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'blocked', 'removed'], default: 'active' },
  passwordChangeRequest: {
    requested: { type: Boolean, default: false },
    requestedAt: { type: Date },
    newPasswordHash: { type: String },
    approved: { type: Boolean, default: false }
  },
  createdByAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trainer', TrainerSchema);
